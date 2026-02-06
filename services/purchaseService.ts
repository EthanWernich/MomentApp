/**
 * RevenueCat Purchase Service
 * Handles lifetime purchase for anonymous users
 * Graceful offline handling with local state sync
 */

import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Keys
const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_tRqCeTnLhYPSYVkTsokafYskJwS',
  android: 'YOUR_ANDROID_API_KEY_HERE', // Add your Android key when ready
}) || '';

// Validate API key exists
const hasValidApiKey = () => {
  return REVENUECAT_API_KEY && REVENUECAT_API_KEY.length > 10 && !REVENUECAT_API_KEY.includes('YOUR_');
};

// Offering identifier for lifetime purchase
const LIFETIME_OFFERING_ID = 'lifetime';

interface PurchaseServiceState {
  isInitialized: boolean;
  isOffline: boolean;
}

const state: PurchaseServiceState = {
  isInitialized: false,
  isOffline: false,
};

/**
 * Initialize RevenueCat SDK
 * Call this once at app startup
 */
export const initializePurchases = async (): Promise<void> => {
  if (state.isInitialized) {
    console.log('[PurchaseService] Already initialized');
    return;
  }

  try {
    // Validate API key before attempting to initialize
    if (!hasValidApiKey()) {
      console.warn('[PurchaseService] Invalid or missing API key, skipping initialization');
      state.isOffline = true;
      return;
    }

    // Configure RevenueCat - set log level BEFORE configure
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    // Initialize with anonymous user - configure is SYNCHRONOUS, don't await
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    
    state.isInitialized = true;
    state.isOffline = false;
    console.log('[PurchaseService] Initialized successfully');
  } catch (error: any) {
    console.error('[PurchaseService] Initialization failed:', error?.message || error);
    // CRITICAL: Allow app to continue even if initialization fails
    // The app will work in offline mode with local premium state
    state.isOffline = true;
    state.isInitialized = false;
  }
};

/**
 * Get available offerings from RevenueCat
 * Returns null if offline or error occurs
 */
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    if (!state.isInitialized) {
      console.warn('[PurchaseService] Not initialized, attempting to initialize...');
      await initializePurchases();
    }

    const offerings = await Purchases.getOfferings();
    
    // Get the lifetime offering
    const lifetimeOffering = offerings.current;
    
    if (!lifetimeOffering) {
      console.warn('[PurchaseService] No current offering found');
      return null;
    }

    state.isOffline = false;
    return lifetimeOffering;
  } catch (error) {
    console.error('[PurchaseService] Failed to get offerings:', error);
    state.isOffline = true;
    return null;
  }
};

/**
 * Purchase the lifetime package
 * Returns CustomerInfo on success, null on failure
 */
export const purchaseLifetime = async (
  packageToPurchase?: PurchasesPackage
): Promise<CustomerInfo | null> => {
  try {
    if (!state.isInitialized) {
      console.warn('[PurchaseService] Not initialized, attempting to initialize...');
      await initializePurchases();
    }

    // If no package provided, fetch the current offering
    let purchasePackage = packageToPurchase;
    
    if (!purchasePackage) {
      const offering = await getOfferings();
      if (!offering || !offering.availablePackages.length) {
        console.error('[PurchaseService] No packages available');
        return null;
      }
      // Get the lifetime package (typically the first one)
      purchasePackage = offering.availablePackages[0];
    }

    // Make the purchase
    const { customerInfo } = await Purchases.purchasePackage(purchasePackage);
    
    state.isOffline = false;
    console.log('[PurchaseService] Purchase successful');
    return customerInfo;
  } catch (error: any) {
    console.error('[PurchaseService] Purchase failed:', error);
    
    // Check if user cancelled
    if (error.userCancelled) {
      console.log('[PurchaseService] User cancelled purchase');
      return null;
    }

    // Handle network errors gracefully
    if (error.code === 'NETWORK_ERROR') {
      state.isOffline = true;
    }

    return null;
  }
};

/**
 * Restore previous purchases
 * Returns CustomerInfo on success, null on failure
 */
export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  try {
    if (!state.isInitialized) {
      console.warn('[PurchaseService] Not initialized, attempting to initialize...');
      await initializePurchases();
    }

    const customerInfo = await Purchases.restorePurchases();
    
    state.isOffline = false;
    console.log('[PurchaseService] Purchases restored successfully');
    return customerInfo;
  } catch (error) {
    console.error('[PurchaseService] Restore failed:', error);
    state.isOffline = true;
    return null;
  }
};

/**
 * Check if user has premium access
 * Checks RevenueCat entitlements for active premium status
 */
export const isPremium = async (): Promise<boolean> => {
  try {
    if (!state.isInitialized) {
      console.warn('[PurchaseService] Not initialized, attempting to initialize...');
      await initializePurchases();
    }

    const customerInfo = await Purchases.getCustomerInfo();
    
    // Check if user has active entitlements
    // Adjust 'premium' to match your entitlement identifier in RevenueCat
    const hasActiveEntitlement =
      typeof customerInfo.entitlements.active['premium'] !== 'undefined';

    state.isOffline = false;
    return hasActiveEntitlement;
  } catch (error) {
    console.error('[PurchaseService] Failed to check premium status:', error);
    state.isOffline = true;
    // Return false on error, but app should use local cached state
    return false;
  }
};

/**
 * Get current customer info
 * Returns null if offline or error occurs
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    if (!state.isInitialized) {
      console.warn('[PurchaseService] Not initialized, attempting to initialize...');
      await initializePurchases();
    }

    const customerInfo = await Purchases.getCustomerInfo();
    state.isOffline = false;
    return customerInfo;
  } catch (error) {
    console.error('[PurchaseService] Failed to get customer info:', error);
    state.isOffline = true;
    return null;
  }
};

/**
 * Check if service is currently offline
 */
export const isOffline = (): boolean => {
  return state.isOffline;
};

/**
 * Sync premium status with local state
 * Call this periodically to keep local state in sync
 */
export const syncPremiumStatus = async (): Promise<boolean | null> => {
  try {
    const premium = await isPremium();
    return premium;
  } catch (error) {
    console.error('[PurchaseService] Sync failed:', error);
    return null;
  }
};
