/**
 * Date Engine - Single source of truth for all time calculations
 * All date-related logic should be centralized here
 */

import {
  DEFAULT_LIFE_EXPECTANCY_YEARS,
  WEEKS_PER_YEAR,
  MONTHS_PER_YEAR,
  DAYS_PER_WEEK,
  MILLISECONDS_PER_SECOND,
  SECONDS_PER_MINUTE,
  MINUTES_PER_HOUR,
  HOURS_PER_DAY,
  DATE_FORMAT_LONG,
  DATE_FORMAT_OPTIONS,
} from '../constants/appConfig';

// Core date utilities
const MS_PER_DAY =
  MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
const MS_PER_WEEK = MS_PER_DAY * DAYS_PER_WEEK;

/**
 * Get the current year
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Get the current date
 */
export const getCurrentDate = (): Date => {
  return new Date();
};

/**
 * Check if a year is a leap year
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Get the number of days in a specific year
 */
export const getDaysInYear = (year: number): number => {
  return isLeapYear(year) ? 366 : 365;
};

/**
 * Get the day of year (1-365/366) for a given date
 */
export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / MS_PER_DAY);
};

/**
 * Get days between two dates
 */
export const daysBetweenDates = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diff = d2.getTime() - d1.getTime();
  return Math.ceil(diff / MS_PER_DAY);
};

/**
 * Get days until a target date (from today)
 */
export const getDaysUntil = (targetDate: Date): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return daysBetweenDates(now, target);
};

/**
 * Get days passed in current year
 */
export const getDaysPassedInYear = (year?: number): number => {
  const now = new Date();
  const targetYear = year || now.getFullYear();
  
  if (targetYear === now.getFullYear()) {
    return getDayOfYear(now);
  }
  
  return 0;
};

/**
 * Get days remaining in current year
 */
export const getDaysRemainingInYear = (year?: number): number => {
  const targetYear = year || getCurrentYear();
  const totalDays = getDaysInYear(targetYear);
  const passed = getDaysPassedInYear(targetYear);
  return Math.max(0, totalDays - passed);
};

/**
 * Get year progress percentage
 */
export const getYearProgressPercentage = (year?: number): number => {
  const targetYear = year || getCurrentYear();
  const totalDays = getDaysInYear(targetYear);
  const passed = getDaysPassedInYear(targetYear);
  return (passed / totalDays) * 100;
};

// Life calculations

/**
 * Calculate total weeks in a lifespan
 */
export const getTotalWeeksInLife = (lifeExpectancy: number = DEFAULT_LIFE_EXPECTANCY_YEARS): number => {
  return Math.floor(lifeExpectancy * WEEKS_PER_YEAR);
};

/**
 * Calculate total months in a lifespan
 */
export const getTotalMonthsInLife = (lifeExpectancy: number = DEFAULT_LIFE_EXPECTANCY_YEARS): number => {
  return lifeExpectancy * MONTHS_PER_YEAR;
};

/**
 * Calculate weeks lived from birthdate
 */
export const getWeeksLived = (birthdate: Date): number => {
  const now = new Date();
  const diff = now.getTime() - birthdate.getTime();
  return Math.floor(diff / MS_PER_WEEK);
};

/**
 * Calculate weeks remaining in life
 */
export const getWeeksRemaining = (
  birthdate: Date,
  lifeExpectancy: number = DEFAULT_LIFE_EXPECTANCY_YEARS
): number => {
  const totalWeeks = getTotalWeeksInLife(lifeExpectancy);
  const lived = getWeeksLived(birthdate);
  return Math.max(0, totalWeeks - lived);
};

/**
 * Calculate life percentage (weeks)
 */
export const getLifePercentage = (
  birthdate: Date,
  lifeExpectancy: number = DEFAULT_LIFE_EXPECTANCY_YEARS
): number => {
  const totalWeeks = getTotalWeeksInLife(lifeExpectancy);
  const lived = getWeeksLived(birthdate);
  return Math.min(100, (lived / totalWeeks) * 100);
};

/**
 * Calculate months lived from birthdate
 */
export const getMonthsLived = (birthdate: Date): number => {
  const now = new Date();
  const years = now.getFullYear() - birthdate.getFullYear();
  const months = now.getMonth() - birthdate.getMonth();
  return years * MONTHS_PER_YEAR + months;
};

/**
 * Calculate months remaining in life
 */
export const getMonthsRemaining = (
  birthdate: Date,
  lifeExpectancy: number = DEFAULT_LIFE_EXPECTANCY_YEARS
): number => {
  const totalMonths = getTotalMonthsInLife(lifeExpectancy);
  const lived = getMonthsLived(birthdate);
  return Math.max(0, totalMonths - lived);
};

/**
 * Calculate life percentage (months)
 */
export const getLifePercentageMonths = (
  birthdate: Date,
  lifeExpectancy: number = DEFAULT_LIFE_EXPECTANCY_YEARS
): number => {
  const totalMonths = getTotalMonthsInLife(lifeExpectancy);
  const lived = getMonthsLived(birthdate);
  return Math.min(100, (lived / totalMonths) * 100);
};

/**
 * Calculate full life progress data
 */
export const calculateLifeProgress = (birthdate: Date, lifeExpectancy?: number) => {
  const expectancy = lifeExpectancy || DEFAULT_LIFE_EXPECTANCY_YEARS;
  
  return {
    weeks: {
      total: getTotalWeeksInLife(expectancy),
      lived: getWeeksLived(birthdate),
      remaining: getWeeksRemaining(birthdate, expectancy),
      percentage: getLifePercentage(birthdate, expectancy),
    },
    months: {
      total: getTotalMonthsInLife(expectancy),
      lived: getMonthsLived(birthdate),
      remaining: getMonthsRemaining(birthdate, expectancy),
      percentage: getLifePercentageMonths(birthdate, expectancy),
    },
  };
};

// Event calculations

/**
 * Calculate event progress percentage
 */
export const calculateEventProgress = (startDate: Date, eventDate: Date): number => {
  const now = new Date();
  const start = startDate.getTime();
  const end = eventDate.getTime();
  const current = now.getTime();

  if (current >= end) return 100;
  if (current <= start) return 0;

  return ((current - start) / (end - start)) * 100;
};

/**
 * Calculate progress percentage between two dates
 */
export const getProgressPercentage = (startDate: Date, endDate: Date): number => {
  return calculateEventProgress(startDate, endDate);
};

// Formatting

/**
 * Format date to localized string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString(DATE_FORMAT_LONG, DATE_FORMAT_OPTIONS);
};

/**
 * Format date range
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${formatDate(startDate)} → ${formatDate(endDate)}`;
};
