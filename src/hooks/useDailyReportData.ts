import { useMemo, useState } from "react";
import {
  getTodayStudents,
  getYesterdayStudents,
  groupStudentsByLevelAndClass,
} from "../selectors/students";
import { getTeacherAbsences } from "../selectors/teachers";
import { startOfDay, endOfDay } from "../utils/dates";

export function useDailyReportData({ date, allStudents, professors }) {
  const todayStart = useMemo(() => startOfDay(new Date(date)), [date]);
  const todayEnd = useMemo(() => endOfDay(new Date(date)), [date]);

  /* ============================
     Students
  ============================ */
  const yesterdayStudents = useMemo(
    () => getYesterdayStudents(allStudents, date),
    [allStudents, date]
  );

  const todayStudents = useMemo(
    () => getTodayStudents(allStudents, date),
    [allStudents, date]
  );

  const newStudents = useMemo(
    () =>
      todayStudents.filter(
        (s) =>
          new Date(s.student_inscription_date) >= todayStart &&
          new Date(s.student_inscription_date) <= todayEnd
      ),
    [todayStudents, todayStart, todayEnd]
  );

  const goneStudents = useMemo(
    () =>
      yesterdayStudents.filter((s) =>
        todayStudents.every((t) => t.id !== s.id)
      ),
    [yesterdayStudents, todayStudents]
  );

  /* ============================
     Grouping
  ============================ */
  const groupedByLevel = useMemo(
    () => groupStudentsByLevelAndClass(todayStudents),
    [todayStudents]
  );

  /* ============================
     Teachers absences
  ============================ */
  const teacherAbsences = useMemo(
    () => getTeacherAbsences(professors, todayStart, todayEnd),
    [professors, todayStart, todayEnd]
  );

  /* ============================
     Calculated values
  ============================ */
  const [missedHours, setMissedHours] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  const absenceRatio =
    totalHours > 0 ? ((missedHours * 100) / totalHours).toFixed(2) : "0.00";

  return {
    dateRange: {
      todayStart,
      todayEnd,
    },

    students: {
      today: todayStudents,
      yesterday: yesterdayStudents,
      new: newStudents,
      gone: goneStudents,
      byLevel: groupedByLevel,
    },

    teachers: {
      absences: teacherAbsences,
      missedHours,
      setMissedHours,
      totalHours,
      setTotalHours,
      absenceRatio,
    },
  };
}
