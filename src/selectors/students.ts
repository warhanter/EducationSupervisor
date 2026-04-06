import { endOfDay, startOfDay } from "@/utils/dates";
import { filter, groupBy, sortBy } from "lodash";

export function getYesterdayStudents(all, date) {
  const y = startOfDay(new Date(date));
  return filter(
    all,
    (s) =>
      new Date(s.student_inscription_date) < y &&
      !((s.switched_school || s.is_fired) && y > new Date(s.student_leave_date))
  );
}

export function getTodayStudents(all, date) {
  const t = endOfDay(new Date(date));
  return filter(
    all,
    (s) =>
      new Date(s.student_inscription_date) < t &&
      !((s.switched_school || s.is_fired) && new Date(s.student_leave_date) < t)
  );
}

export function groupStudentsByLevelAndClass(students) {
  return {
    byLevel: groupBy(students, "level"),
    byClass: groupBy(students, "class_abbreviation"),
  };
}
