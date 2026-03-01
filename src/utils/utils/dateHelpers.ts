const STUDY_END_HOUR = 16;
const TUESDAY_FULL_DAY_HOURS = 12;
const TUESDAY_PARTIAL_HOURS = 4;
const DEFAULT_DAILY_HOURS = 7;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export type DateInput = Date | string | number;

const toDate = (input: DateInput): Date => {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) throw new Error(`Invalid Date object`);
    return input;
  }

  if (typeof input === "number") {
    if (!Number.isFinite(input) || input < 0)
      throw new Error(`Invalid timestamp: "${input}"`);
    return new Date(input);
  }

  if (typeof input === "string") {
    const date = new Date(input);
    if (isNaN(date.getTime()))
      throw new Error(`Invalid date string: "${input}"`);
    return date;
  }

  throw new Error(`Unsupported date input: "${input}"`);
};

function isBetween(date: DateInput, a: DateInput, b: DateInput): boolean {
  const time = toDate(date).getTime();
  const start = toDate(a).getTime();
  const end = toDate(b).getTime();
  return time >= Math.min(start, end) && time <= Math.max(start, end);
}

const isTuesday = (date: DateInput): boolean => {
  return toDate(date).getDay() === 2; // 0 = Sunday, 1 = Monday, 2 = Tuesday ...
};

const getDaysDiff = (a: DateInput, b: DateInput): number => {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / MS_PER_DAY);
};
const getPartialDayHours = (startHour: number): number => {
  return startHour > 12
    ? STUDY_END_HOUR - startHour // Afternoon absence: e.g 14h → 16 - 14 = 2h
    : STUDY_END_HOUR - 1 - startHour; // Morning absence:   e.g 8h  → 15 - 8  = 7h
};

const missedHours = (
  absence_date: DateInput,
  rapport_date: DateInput,
  eachDayMissedHours?: number,
): number => {
  const absenceDate = toDate(absence_date);
  const rapportDate = toDate(rapport_date);

  const daysOfAbsence = getDaysDiff(absenceDate, rapportDate);

  const isMultiDay = daysOfAbsence >= 1;
  const startHour = absenceDate.getHours();
  const tuesday = isTuesday(rapportDate);

  // Multi-day absence ending on Tuesday → half day (4h)
  if (tuesday && isMultiDay) return TUESDAY_PARTIAL_HOURS;

  // Same-day absence on Tuesday → remaining hours until noon
  if (tuesday && !isMultiDay) return TUESDAY_FULL_DAY_HOURS - startHour;

  // Multi-day absence → use provided hours or fallback to default
  if (isMultiDay) return eachDayMissedHours ?? DEFAULT_DAILY_HOURS;

  // Same-day absence → calculate remaining study hours based on start hour
  return getPartialDayHours(startHour);
};

export {
  STUDY_END_HOUR,
  DEFAULT_DAILY_HOURS,
  MS_PER_DAY,
  TUESDAY_FULL_DAY_HOURS,
  TUESDAY_PARTIAL_HOURS,
};

export { getPartialDayHours, getDaysDiff, isTuesday, isBetween, missedHours };

// ---------------------------------------------------------------------------
// Monthly-Absences helpers
// ---------------------------------------------------------------------------

export type AbsenceRecord = Record<string, any>;

export type GroupedStudent = {
  id: string;
  total_missed_hours: number;
  total_justified_missed_hours: number;
  className: string;
  fullName: string;
  dates: {
    supervisor_id: string;
    missed_hours: number;
    justified_missed_hours: number;
    start: string;
    return: string;
    daysOfAbsence: number;
  }[];
  total: number;
};

/**
 * Groups a flat list of absence rows by student, aggregates totals, and sorts
 * by total hours descending.
 */
export function groupAbsencesByStudent(
  absencesData: AbsenceRecord[],
): GroupedStudent[] {
  return Object.values(
    absencesData.reduce(
      (acc, absence) => {
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

        acc[studentId].total_missed_hours += absence.missed_hours || 0;
        acc[studentId].total_justified_missed_hours +=
          absence.justified_missed_hours || 0;

        const dateOfAbsence = new Date(absence.date_of_absence);
        const dateOfReturn = new Date(absence.date_of_return);
        const daysOfAbsence = Math.floor(
          (dateOfReturn.getTime() - dateOfAbsence.getTime()) / 86400000,
        );

        acc[studentId].dates.push({
          supervisor_id: absence.supervisor_id,
          missed_hours: absence.missed_hours,
          justified_missed_hours: absence.justified_missed_hours,
          start: absence.date_of_absence,
          return: absence.date_of_return,
          daysOfAbsence,
        });

        return acc;
      },
      {} as Record<string, any>,
    ),
  )
    .map((student) => ({
      ...student,
      total: student.total_missed_hours + student.total_justified_missed_hours,
    }))
    .sort((a, b) => b.total - a.total) as GroupedStudent[];
}

/**
 * Returns the subset of absence records where the given timestamp falls
 * inside the [date_of_absence, date_of_return] window.
 */
export function getAbsentStudentsForDate(
  absentClassData: AbsenceRecord[],
  timestamp: number,
): AbsenceRecord[] {
  return absentClassData.filter(
    (i) =>
      (new Date(i.date_of_return).getTime() > timestamp || !i.date_of_return) &&
      new Date(i.date_of_absence).getTime() <= timestamp,
  );
}

export type DayEntry = { id: string; missedHours: number };
export type AttendanceGrid = Record<string, DayEntry[]>;

/**
 * Iterates over every calendar day of a given month, skipping weekends and
 * holidays, and builds a grid of { studentId → missedHours } per school day.
 * Also returns the total class hours for the month.
 */
export function buildMonthlyAttendanceGrid(
  year: number,
  month: number,
  absentClassData: AbsenceRecord[],
  program: AbsenceRecord[] | undefined,
  holidays: AbsenceRecord[] | undefined,
): { grid: AttendanceGrid; classHours: number } {
  const grid: AttendanceGrid = {};
  let classHours = 0;

  for (let day = 1; day <= 30; day++) {
    const newDate = new Date(`${year}-${month}-${day}`).setHours(23);
    const dayOfWeek = new Date(`${year}-${month}-${day}`).getDay();

    // Skip Friday (5) and Saturday (6)
    if (dayOfWeek === 5 || dayOfWeek === 6) continue;

    // Skip holidays
    const isHoliday = holidays?.some((holiday) =>
      isBetween(newDate, holiday.start_date, holiday.end_date),
    );
    if (isHoliday) continue;

    const eachDayMissedHours =
      program?.filter(
        (p) =>
          p.day ===
          new Date(newDate).toLocaleDateString("ar-DZ", { weekday: "long" }),
      ).length ?? 0;

    classHours += eachDayMissedHours;

    const absentToday = getAbsentStudentsForDate(absentClassData, newDate);
    const dayEntries: DayEntry[] = absentToday.map((student) => ({
      id: student.student_id,
      missedHours: missedHours(
        new Date(student.date_of_absence).getTime(),
        newDate,
        eachDayMissedHours,
      ),
    }));

    grid[`${year}-${month}-${day}`] = dayEntries;
  }

  return { grid, classHours };
}

// ---------------------------------------------------------------------------
// Teacher-Absence helpers
// ---------------------------------------------------------------------------

/**
 * Returns the first absence record whose `date` timestamp falls within the
 * one-hour window [slotHour, slotHour+1).  `slotHour` may be fractional
 * (e.g. 13.5 = 13:30).
 *
 * @param records   Array of absence records, each with a numeric `date` field.
 * @param baseDate  A Date object representing the current day (mutated internally
 *                  via setHours — pass a fresh copy when reusing across slots).
 * @param slotHour  Start of the hour slot (e.g. 8, 13.5).
 */
export function getAbsenceInHourSlot(
  records: AbsenceRecord[],
  baseDate: Date,
  slotHour: number,
): AbsenceRecord | undefined {
  const h = Math.floor(slotHour);
  const m = slotHour % 1 ? 30 : 0;
  const slotStart = new Date(baseDate).setHours(h, m, 0, 0);
  const slotEnd = new Date(baseDate).setHours(Math.floor(slotHour + 1), m, 0, 0);
  return records.find((s) => s.date >= slotStart && s.date < slotEnd);
}

/**
 * Returns `"(part / total * 100).toFixed(decimals) %"`, guarded against
 * division by zero (returns `"0.00 %"`).
 */
export function formatPercentage(
  part: number,
  total: number,
  decimals = 2,
): string {
  if (!total) return `0.${'0'.repeat(decimals)}%`;
  return `${((part * 100) / total).toFixed(decimals)}%`;
}
