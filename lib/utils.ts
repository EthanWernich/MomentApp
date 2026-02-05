/**
 * Legacy utils file - Re-exports from dateEngine for backward compatibility
 * All new code should import directly from utils/dateEngine
 */

export {
  getDaysInYear,
  isLeapYear,
  getDayOfYear,
  getWeeksLived,
  getWeeksRemaining,
  getLifePercentage,
  getMonthsLived,
  getMonthsRemaining,
  getLifePercentageMonths,
  getDaysUntil,
  formatDate,
  getProgressPercentage,
  getCurrentYear,
  getCurrentDate,
  daysBetweenDates,
  calculateLifeProgress,
  calculateEventProgress,
  getDaysPassedInYear,
  getDaysRemainingInYear,
  getYearProgressPercentage,
} from '../utils/dateEngine';
