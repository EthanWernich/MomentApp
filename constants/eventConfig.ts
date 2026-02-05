/**
 * Event-specific configuration
 * Icons, colors, and event-related constants
 */

// Available icon names for events (free tier)
export const EVENT_ICON_NAMES = [
  'cake',
  'airplane',
  'academic',
  'heart',
  'home',
  'flag',
  'star',
  'rocket',
  'paint',
  'book',
  'trophy',
  'plus',
] as const;

// Premium icon names (50+ additional icons)
export const PREMIUM_ICON_NAMES = [
  'bell',
  'gift',
  'camera',
  'music',
  'film',
  'microphone',
  'phone',
  'envelope',
  'map',
  'globe',
  'sun',
  'moon',
  'cloud',
  'fire',
  'bolt',
  'sparkles',
  'beaker',
  'briefcase',
  'calculator',
  'calendar',
  'chart-bar',
  'chat-bubble',
  'check-circle',
  'clock',
  'cog',
  'credit-card',
  'currency-dollar',
  'document',
  'eye',
  'folder',
  'key',
  'light-bulb',
  'lock-closed',
  'puzzle',
  'shield-check',
  'shopping-cart',
  'ticket',
  'truck',
  'user',
  'users',
  'wrench',
  'x-circle',
  'badge-check',
  'bar-chart',
  'bookmark',
  'building',
  'coffee',
  'cube',
  'database',
  'device-mobile',
  'game-controller',
] as const;

export type EventIconName = (typeof EVENT_ICON_NAMES)[number];
export type PremiumIconName = (typeof PREMIUM_ICON_NAMES)[number];
export type AllIconName = EventIconName | PremiumIconName;

// Available color options for events
export const EVENT_COLOR_OPTIONS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
] as const;

// Default event values
export const DEFAULT_EVENT_ICON: EventIconName = 'cake';
export const DEFAULT_EVENT_COLOR = EVENT_COLOR_OPTIONS[0];

// Event card styling
export const EVENT_CARD_ICON_SIZE = 24;
export const EVENT_CARD_MARGIN_BOTTOM = 16;
export const EVENT_CARD_PROGRESS_BAR_HEIGHT = 8;
export const EVENT_CARD_PROGRESS_BAR_RADIUS = 4;

// Event modal styling
export const EVENT_MODAL_ICON_BUTTON_SIZE = 48;
export const EVENT_MODAL_COLOR_BUTTON_SIZE = 48;
export const EVENT_MODAL_ICON_GRID_GAP = 8;
