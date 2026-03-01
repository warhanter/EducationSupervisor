import {
  MS_PER_DAY,
  WEEKEND_DAYS,
  HOURS_IN_MILLISECONDS,
  TUESDAY_VARIANTS,
  TUESDAY_HOURS,
  TUESDAY_SAME_DAY_START,
  DEFAULT_MISSED_HOURS,
  AFTERNOON_START,
  END_OF_DAY,
  END_OF_MORNING,
} from "../constants/absenceConstants";

/**
 * Check if a date falls between two other dates (inclusive)
 */
export const isDateBetween = (date: Date, start: Date, end: Date): boolean => {
  const min = Math.min(start.getTime(), end.getTime());
  const max = Math.max(start.getTime(), end.getTime());
  return date.getTime() >= min && date.getTime() <= max;
};

/**
 * Check if a date is a weekend (Friday or Saturday)
 */
export const isWeekend = (date: Date): boolean => {
  return WEEKEND_DAYS.includes(date.getDay());
};

/**
 * Check if a date falls within any holiday period
 */
export const isHoliday = (
  date: Date,
  holidays: Array<{ start_date: string; end_date: string }>
): boolean => {
  if (!holidays) return false;
  
  return holidays.some((holiday) =>
    isDateBetween(
      date,
      new Date(holiday.start_date),
      new Date(holiday.end_date)
    )
  );
};

/**
 * Check if a date is Tuesday
 */
export const isTuesday = (date: Date): boolean => {
  const weekday = new Intl.DateTimeFormat("fr", {
    weekday: "long",
  }).format(date);
  return TUESDAY_VARIANTS.includes(weekday);
};

/**
 * Calculate the number of days between two dates
 */
export const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / HOURS_IN_MILLISECONDS);
};

/**
 * Calculate the number of days rounded between two timestamps
 */
export const calculateDaysRounded = (startTime: number, endTime: number): number => {
  return Math.round((endTime - startTime) / MS_PER_DAY);
};

/**
 * Get weekday name in Arabic (for matching with program schedule)
 */
export const getArabicWeekday = (date: Date): string => {
  return new Date(date).toLocaleDateString("ar-DZ", {
    weekday: "long",
  });
};

/**
 * Set time to end of day (23:00)
 */
export const setToEndOfDay = (date: Date): number => {
  return new Date(date).setHours(23, 0, 0, 0);
};

/**
 * Get the number of days in a specific month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * Calculate missed hours based on absence date, report date, and daily hours
 */
export const calculateMissedHours = (
  absenceDate: number,
  reportDate: number,
  eachDayMissedHours?: number
): number => {
  const daysOfAbsence = calculateDaysRounded(absenceDate, reportDate);
  const start = new Date(absenceDate).getHours();
  const reportDateObj = new Date(reportDate);
  const isTues = isTuesday(reportDateObj);

  // Tuesday special case - full day absence
  if (isTues && daysOfAbsence >= 1) {
    return TUESDAY_HOURS;
  }

  // Tuesday same day absence
  if (isTues && daysOfAbsence < 1) {
    return TUESDAY_SAME_DAY_START - start;
  }

  // Multi-day absence
  if (daysOfAbsence >= 1) {
    return eachDayMissedHours || DEFAULT_MISSED_HOURS;
  }

  // Same day absence - afternoon or morning
  return start > AFTERNOON_START ? END_OF_DAY - start : END_OF_MORNING - start;
};
