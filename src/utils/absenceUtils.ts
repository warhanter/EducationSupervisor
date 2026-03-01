import _ from "lodash";
import {
  calculateDaysBetween,
  calculateMissedHours,
  isWeekend,
  isHoliday,
  getArabicWeekday,
  setToEndOfDay,
} from "./dateUtils";
import { DEFAULT_CLASS_HOURS_PER_DAY } from "../constants/absenceConstants";

export interface AbsenceRecord {
  student_id: string;
  full_name: string;
  full_class_name: string;
  date_of_absence: string;
  date_of_return: string;
  missed_hours: number;
  justified_missed_hours: number;
  supervisor_id: string;
}

export interface ProcessedStudent {
  id: string;
  total_missed_hours: number;
  total_justified_missed_hours: number;
  className: string;
  fullName: string;
  total: number;
  dates: Array<{
    supervisor_id: string;
    missed_hours: number;
    justified_missed_hours: number;
    start: string;
    return: string;
    daysOfAbsence: number;
  }>;
}

/**
 * Process raw absence data and group by student
 */
export const processAbsenceData = (
  absencesData: AbsenceRecord[]
): ProcessedStudent[] => {
  if (!absencesData) return [];

  const groupedByStudent = absencesData.reduce((acc, absence) => {
    const studentId = absence.student_id;

    if (!acc[studentId]) {
      acc[studentId] = {
        id: studentId,
        total_missed_hours: 0,
        total_justified_missed_hours: 0,
        className: absence.full_class_name,
        fullName: absence.full_name,
        dates: [],
      };
    }

    // Aggregate totals
    acc[studentId].total_missed_hours += absence.missed_hours || 0;
    acc[studentId].total_justified_missed_hours +=
      absence.justified_missed_hours || 0;

    // Calculate days of absence
    const dateOfAbsence = new Date(absence.date_of_absence);
    const dateOfReturn = new Date(absence.date_of_return);
    const daysOfAbsence = calculateDaysBetween(dateOfAbsence, dateOfReturn);

    // Add absence details
    acc[studentId].dates.push({
      supervisor_id: absence.supervisor_id,
      missed_hours: absence.missed_hours,
      justified_missed_hours: absence.justified_missed_hours,
      start: absence.date_of_absence,
      return: absence.date_of_return,
      daysOfAbsence,
    });

    return acc;
  }, {} as Record<string, any>);

  return Object.values(groupedByStudent)
    .map((student) => ({
      ...student,
      total: student.total_missed_hours + student.total_justified_missed_hours,
    }))
    .sort((a, b) => b.total - a.total);
};

/**
 * Filter students who are absent on a specific date
 */
export const getAbsentStudentsOnDate = (
  absenceData: AbsenceRecord[],
  targetDate: number
): AbsenceRecord[] => {
  return _.filter(
    absenceData,
    (absence) =>
      (new Date(absence.date_of_return).getTime() > targetDate ||
        !absence.date_of_return) &&
      new Date(absence.date_of_absence).getTime() <= targetDate
  );
};

/**
 * Calculate missed hours for each day in a month
 */
export const calculateMonthlyAbsences = (
  year: number,
  month: number,
  absentClassData: AbsenceRecord[],
  program: any[],
  holidays: any[]
): {
  dailyAbsences: Record<string, Array<{ id: string; missedHours: number }>>;
  totalClassHours: number;
  workingDays: number;
} => {
  const dailyAbsences: Record<string, Array<{ id: string; missedHours: number }>> = {};
  let totalClassHours = 0;

  for (let day = 1; day <= 31; day++) {
    try {
      const currentDate = new Date(`${year}-${month}-${day}`);
      
      // Skip weekends
      if (isWeekend(currentDate)) {
        continue;
      }

      const dateTime = setToEndOfDay(currentDate);

      // Skip holidays
      if (isHoliday(currentDate, holidays)) {
        continue;
      }

      // Calculate hours for this day based on program
      const weekday = getArabicWeekday(dateTime);
      const eachDayMissedHours = program?.filter((p) => p.day === weekday).length || DEFAULT_CLASS_HOURS_PER_DAY;
      totalClassHours += eachDayMissedHours;

      // Get students absent on this date
      const absentStudents = getAbsentStudentsOnDate(absentClassData, dateTime);

      const dayAbsences = absentStudents.map((student) => ({
        id: student.student_id,
        missedHours: calculateMissedHours(
          new Date(student.date_of_absence).getTime(),
          dateTime,
          eachDayMissedHours
        ),
      }));

      dailyAbsences[`${year}-${month}-${day}`] = dayAbsences;
    } catch (error) {
      // Invalid date, skip
      continue;
    }
  }

  return {
    dailyAbsences,
    totalClassHours,
    workingDays: Object.keys(dailyAbsences).length,
  };
};

/**
 * Calculate total missed hours for a student across all days
 */
export const calculateStudentTotalMissedHours = (
  studentId: string,
  dailyAbsences: Record<string, Array<{ id: string; missedHours: number }>>
): number => {
  return Object.values(dailyAbsences).reduce((total, dayData) => {
    const studentAbsence = dayData.find((a) => a.id === studentId);
    return total + (studentAbsence?.missedHours || 0);
  }, 0);
};

/**
 * Check if student should be excluded from report
 */
export const shouldExcludeStudent = (
  student: any,
  year: number,
  month: number
): boolean => {
  const cutoffDate = new Date(`${year}-${month}-30`);
  return (
    student.createdAt < cutoffDate &&
    (student.is_fired || student.switched_school)
  );
};

/**
 * Calculate attendance statistics
 */
export const calculateAttendanceStats = (
  totalClassHours: number,
  realMissedHours: number
): {
  totalHours: number;
  missedHours: number;
  actualHours: number;
  attendanceRate: number;
  absenceRate: number;
} => {
  const actualHours = totalClassHours - realMissedHours;
  const attendanceRate = (actualHours * 100) / totalClassHours;
  const absenceRate = (realMissedHours * 100) / totalClassHours;

  return {
    totalHours: totalClassHours,
    missedHours: realMissedHours,
    actualHours,
    attendanceRate: Number.isFinite(attendanceRate) ? attendanceRate : 0,
    absenceRate: Number.isFinite(absenceRate) ? absenceRate : 0,
  };
};
