import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore, loadPersistedState } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { View, ActivityIndicator } from 'react-native';
import { initializePurchases, syncPremiumStatus } from '../services/purchaseService';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const theme = useAppStore((state) => state.user.theme);
  const colors = themes[theme];

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load persisted state FIRST (critical for app to work)
        const state = await loadPersistedState();
        if (state) {
          useAppStore.setState(state);
        }

        // Initialize RevenueCat (non-critical, wrapped in try-catch)
        try {
          await initializePurchases();
          
          // Sync premium status with RevenueCat (optional)
          const premiumStatus = await syncPremiumStatus();
          if (premiumStatus !== null) {
            useAppStore.getState().setPremium(premiumStatus);
          }
        } catch (error) {
          console.error('[App] Failed to initialize purchases:', error);
          // App continues with cached premium state - this is fine
        }
      } catch (error) {
        console.error('[App] Critical initialization error:', error);
        // Even if state loading fails, continue with default state
      } finally {
        // ALWAYS set ready to true, even if errors occur
        setIsReady(true);
      }
    };

    initializeApp().catch((error) => {
      // Ultimate safety net - catch any unhandled promise rejections
      console.error('[App] Unhandled initialization error:', error);
      setIsReady(true);
    });

    // Sync premium status periodically (every 5 minutes)
    // Only start interval sync if app is initialized successfully
    const syncInterval = setInterval(async () => {
      try {
        const premiumStatus = await syncPremiumStatus();
        if (premiumStatus !== null) {
          useAppStore.getState().setPremium(premiumStatus);
        }
      } catch (error) {
        // Silently fail - don't crash the app during background sync
        console.error('[App] Failed to sync premium status:', error);
      }
    }, 5 * 60 * 1000);

    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}
