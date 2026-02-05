/**
 * Application-wide configuration constants
 * All hardcoded values should be centralized here
 */

// Life expectancy and time calculations
export const DEFAULT_LIFE_EXPECTANCY_YEARS = 90;
export const WEEKS_PER_YEAR = 52.1775; // More precise calculation
export const MONTHS_PER_YEAR = 12;
export const DAYS_PER_WEEK = 7;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_HOUR = 60;
export const SECONDS_PER_MINUTE = 60;
export const MILLISECONDS_PER_SECOND = 1000;

// Grid layout constants
export const YEAR_GRID_CIRCLES_PER_ROW = 21;
export const YEAR_GRID_HORIZONTAL_PADDING = 80; // Total horizontal padding (both sides)
export const YEAR_GRID_CIRCLE_MARGIN = 3;

export const LIFE_GRID_MONTHS_PER_ROW = 12;
export const LIFE_GRID_HORIZONTAL_PADDING = 100; // Total horizontal padding
export const LIFE_GRID_SQUARE_MARGIN = 2;
export const LIFE_GRID_YEAR_LABEL_WIDTH = 30;

// Life in Weeks grid constants
export const LIFE_WEEKS_PER_ROW = 52;
export const LIFE_WEEKS_HORIZONTAL_PADDING = 60; // Total horizontal padding
export const LIFE_WEEKS_SQUARE_MARGIN = 1.5;
export const LIFE_WEEKS_YEAR_LABEL_WIDTH = 30;
export const LIFE_WEEKS_GLOW_RADIUS = 8; // Glow effect for current week

// App metadata
export const APP_NAME = 'Moment';
export const APP_TAGLINE = 'See your life clearly';
export const APP_VERSION = '1.0.0';

// Premium/Pricing
export const FREE_EVENT_LIMIT = 3;
export const PREMIUM_PRICE_DISPLAY = '$9.99';
export const PREMIUM_UNLIMITED_EVENTS = true;

// Storage keys
export const STORAGE_KEY_APP_STATE = '@moment_app_state';

// Default values
export const DEFAULT_THEME = 'midnight' as const;
export const DEFAULT_BIRTHDATE_YEAR = 1990;
export const DEFAULT_BIRTHDATE_MONTH = 0; // January
export const DEFAULT_BIRTHDATE_DAY = 1;

// UI spacing and sizing
export const STANDARD_PADDING = 24;
export const STANDARD_BORDER_RADIUS = 16;
export const CARD_BORDER_RADIUS = 16;
export const BUTTON_BORDER_RADIUS = 16;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION_SHORT = 150;
export const ANIMATION_DURATION_MEDIUM = 300;
export const ANIMATION_DURATION_LONG = 500;

// Date formats
export const DATE_FORMAT_LONG = 'en-US';
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

// UI Colors (for elements outside theme system)
export const COLOR_DESTRUCTIVE = '#ef4444'; // Red for destructive actions
export const COLOR_SUCCESS = '#10b981'; // Green for success states
export const COLOR_WARNING = '#f59e0b'; // Amber for warnings
