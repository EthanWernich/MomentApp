/**
 * Feature Gate Service
 * Centralized feature access control for premium features
 */

import { FREE_EVENT_LIMIT, PREMIUM_UNLIMITED_EVENTS } from '../constants/appConfig';

/**
 * Check if user has premium access
 * @param isPremium - User's premium status from store
 */
export const isPremiumUser = (isPremium?: boolean): boolean => {
  return isPremium === true;
};

/**
 * Check if user can create more events
 * @param currentEventCount - Number of events user currently has
 * @param isPremium - User's premium status
 */
export const canCreateMoreEvents = (
  currentEventCount: number,
  isPremium?: boolean
): boolean => {
  if (isPremiumUser(isPremium) && PREMIUM_UNLIMITED_EVENTS) {
    return true;
  }
  return currentEventCount < FREE_EVENT_LIMIT;
};

/**
 * Get remaining free events count
 * @param currentEventCount - Number of events user currently has
 * @param isPremium - User's premium status
 */
export const getRemainingFreeEvents = (
  currentEventCount: number,
  isPremium?: boolean
): number => {
  if (isPremiumUser(isPremium)) {
    return Infinity;
  }
  return Math.max(0, FREE_EVENT_LIMIT - currentEventCount);
};

/**
 * Check if user can access a specific theme
 * Premium themes: pure-white, pure-black, monochrome, sunset, ocean, forest
 */
export const canAccessTheme = (theme: string, isPremium?: boolean): boolean => {
  const premiumThemes = ['pure-white', 'pure-black', 'monochrome', 'sunset', 'ocean', 'forest'];
  
  if (premiumThemes.includes(theme)) {
    return isPremiumUser(isPremium);
  }
  
  return true; // Free themes are always accessible
};

/**
 * Check if user can access premium icons
 */
export const canAccessPremiumIcons = (isPremium?: boolean): boolean => {
  return isPremiumUser(isPremium);
};

/**
 * Check if user can access life expectancy customization
 * Currently free, prepared for premium
 */
export const canCustomizeLifeExpectancy = (isPremium?: boolean): boolean => {
  // Currently free
  return true;
};

/**
 * Get feature gate message for blocked features
 */
export const getFeatureGateMessage = (feature: 'events' | 'themes' | 'icons' | 'lifespan'): string => {
  switch (feature) {
    case 'events':
      return `Free users can create up to ${FREE_EVENT_LIMIT} events. Upgrade to Premium for unlimited events.`;
    case 'themes':
      return 'Upgrade to Premium to unlock all premium themes.';
    case 'icons':
      return 'Upgrade to Premium to access 50+ exclusive icons.';
    case 'lifespan':
      return 'Upgrade to Premium to customize your life expectancy.';
    default:
      return 'This feature requires Premium.';
  }
};
