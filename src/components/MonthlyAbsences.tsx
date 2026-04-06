import React, { useMemo, useState, useCallback } from "react";
import _ from "lodash";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAbsenceData, useClassProgram } from "../hooks/useAbsenceData";
import { AbsenceFilters } from "./AbsenceFilters";
import { MonthlyAbsenceTable } from "./MonthlyAbsenceTable";
import { AttendanceStatsBadges } from "./AttendanceStatsBadges";
import {
  calculateMonthlyAbsences,
  calculateAttendanceStats,
} from "../utils/absenceUtils";
import { getDaysInMonth } from "../utils/dateUtils";
import { DEFAULT_CLASS_HOURS_PER_DAY } from "../constants/absenceConstants";

interface MonthlyAbsencesProps {
  data: Record<string, any>[];
  students: Record<string, any>[];
}

export const MonthlyAbsences: React.FC<MonthlyAbsencesProps> = ({
  data,
  students,
}) => {
  const [level, setLevel] = useState("");
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const [calculatedStats, setCalculatedStats] = useState({
    totalMissedHours: 0,
    totalClassHours: 0,
    numStudents: 0,
  });

  // Fetch data from Supabase
  const { holidays, classPrograms, loading, error } = useAbsenceData();

  // Get unique levels sorted by abbreviation
  const levels = useMemo(
    () => _.sortBy(_.uniqBy(data, (e) => e.full_class_name), "class_abbreviation"),
    [data]
  );

  // Get program for selected class
  const program = useClassProgram(classPrograms, level);

  // Filter students and absences by selected class
  const allClassStudents = useMemo(
    () =>
      students
        .filter((student) => student.full_class_name === level)
        .sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [students, level]
  );

  const absentClassData = useMemo(
    () => data.filter((student) => student.full_class_name === level),
    [data, level]
  );

  // Calculate monthly absences
  const { dailyAbsences, totalClassHours, workingDays } = useMemo(() => {
    if (!level || !holidays) {
      return { dailyAbsences: {}, totalClassHours: 0, workingDays: 0 };
    }

    return calculateMonthlyAbsences(
      year,
      month,
      absentClassData,
      program,
      holidays
    );
  }, [year, month, absentClassData, program, holidays, level]);

  // Calculate attendance statistics
  const stats = useMemo(() => {
    const totalStudentClassHours = calculatedStats.numStudents * 
      (totalClassHours || workingDays * DEFAULT_CLASS_HOURS_PER_DAY);
    
    return calculateAttendanceStats(
      totalStudentClassHours,
      calculatedStats.totalMissedHours
    );
  }, [calculatedStats, totalClassHours, workingDays]);

  const monthDays = getDaysInMonth(year, month);

  const handleDataCalculated = useCallback(
    (totalMissed: number, totalClass: number, numStudents: number) => {
      setCalculatedStats({
        totalMissedHours: totalMissed,
        totalClassHours: totalClass,
        numStudents,
      });
    },
    []
  );

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">النسبة الشهرية</Button>
      </DialogTrigger>
      <DialogContent
        style={{ page: "wide" }}
        className="min-w-full min-h-full flex flex-col items-center"
      >
        <DialogHeader className="flex items-center">
          <DialogDescription>
            جدول يبين الساعات الضائعة شهريا لكل تلميذ حسب الاقسام.
          </DialogDescription>
        </DialogHeader>

        <div
          className="flex flex-col items-center gap-5 print:w-screen print:h-screen"
          id="section-to-print-landscape"
        >
          <AbsenceFilters
            levels={levels}
            selectedLevel={level}
            selectedMonth={month}
            selectedYear={year}
            onLevelChange={setLevel}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />

          <div className="w-full overflow-scroll print:overflow-visible print:h-screen h-[600px]">
            <MonthlyAbsenceTable
              students={allClassStudents}
              monthDays={monthDays}
              year={year}
              month={month}
              dailyAbsences={dailyAbsences}
              onDataCalculated={handleDataCalculated}
            />
          </div>

          <AttendanceStatsBadges
            totalHours={stats.totalHours}
            missedHours={stats.missedHours}
            actualHours={stats.actualHours}
            attendanceRate={stats.attendanceRate}
            absenceRate={stats.absenceRate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
