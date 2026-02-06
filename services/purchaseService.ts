/**
 * RevenueCat Purchase Service
 * Production-safe version
 */

import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';

import { Platform } from 'react-native';

// 🔥 API Keys
const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_tRqCeTnLhYPSYVkTsokafYskJwS',
  android: '', // put your Android key later
});

interface PurchaseServiceState {
  isInitialized: boolean;
  isOffline: boolean;
}

const state: PurchaseServiceState = {
  isInitialized: false,
  isOffline: false,
};

/**
 * Initialize RevenueCat
 *
 * IMPORTANT:
 * Call AFTER app UI renders.
 * Do NOT block startup.
 */
export const initializePurchases = async (): Promise<void> => {
  if (state.isInitialized) return;

  try {
    if (!REVENUECAT_API_KEY) {
      console.warn('[PurchaseService] Missing RevenueCat API key');
      return;
    }

    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
    });

    state.isInitialized = true;
    state.isOffline = false;

    console.log('[PurchaseService] ✅ Initialized');
  } catch (error) {
    console.error('[PurchaseService] Initialization failed:', error);
    state.isOffline = true;
  }
};

/**
 * Get Offerings
 */
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    if (!state.isInitialized) {
      await initializePurchases();
    }

    const offerings = await Purchases.getOfferings();

    if (!offerings?.current) {
      console.warn('[PurchaseService] No current offering');
      return null;
    }

    state.isOffline = false;
    return offerings.current;
  } catch (error) {
    console.error('[PurchaseService] Failed to get offerings:', error);
    state.isOffline = true;
    return null;
  }
};

/**
 * Purchase Lifetime
 */
export const purchaseLifetime = async (
  pkg?: PurchasesPackage
): Promise<CustomerInfo | null> => {
  try {
    if (!state.isInitialized) {
      await initializePurchases();
    }

    let purchasePackage = pkg;

    if (!purchasePackage) {
      const offering = await getOfferings();

      if (!offering?.availablePackages?.length) {
        console.error('[PurchaseService] No packages available');
        return null;
      }

      purchasePackage = offering.availablePackages[0];
    }

    const { customerInfo } =
      await Purchases.purchasePackage(purchasePackage);

    state.isOffline = false;

    console.log('[PurchaseService] ✅ Purchase successful');

    return customerInfo;
  } catch (error: any) {
    if (error?.userCancelled) {
      console.log('[PurchaseService] User cancelled purchase');
      return null;
    }

    console.error('[PurchaseService] Purchase failed:', error);
    state.isOffline = true;

    return null;
  }
};

/**
 * Restore Purchases
 */
export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  try {
    if (!state.isInitialized) {
      await initializePurchases();
    }

    const customerInfo = await Purchases.restorePurchases();

    state.isOffline = false;

    console.log('[PurchaseService] ✅ Restored');

    return customerInfo;
  } catch (error) {
    console.error('[PurchaseService] Restore failed:', error);
    state.isOffline = true;
    return null;
  }
};

/**
 * Check Premium
 *
 * ⚠️ Make sure entitlement id matches RevenueCat dashboard.
 */
export const isPremium = async (): Promise<boolean> => {
  try {
    if (!state.isInitialized) {
      await initializePurchases();
    }

    const customerInfo = await Purchases.getCustomerInfo();

    const hasPremium =
      customerInfo.entitlements.active['premium'] !== undefined;

    state.isOffline = false;

    return hasPremium;
  } catch (error) {
    console.error('[PurchaseService] Premium check failed:', error);
    state.isOffline = true;

    return false;
  }
};

/**
 * Get Customer Info
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    if (!state.isInitialized) {
      await initializePurchases();
    }

    const info = await Purchases.getCustomerInfo();

    state.isOffline = false;

    return info;
  } catch (error) {
    console.error('[PurchaseService] Customer info failed:', error);
    state.isOffline = true;
    return null;
  }
};

/**
 * Sync Premium
 */
export const syncPremiumStatus = async (): Promise<boolean | null> => {
  try {
    return await isPremium();
  } catch {
    return null;
  }
};

/**
 * Offline State
 */
export const isOffline = (): boolean => state.isOffline;
