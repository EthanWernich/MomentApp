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
      // Load persisted state
      const state = await loadPersistedState();
      if (state) {
        useAppStore.setState(state);
      }

      // Initialize RevenueCat
      try {
        await initializePurchases();
        
        // Sync premium status with RevenueCat
        const premiumStatus = await syncPremiumStatus();
        if (premiumStatus !== null) {
          useAppStore.getState().setPremium(premiumStatus);
        }
      } catch (error) {
        console.error('[App] Failed to initialize purchases:', error);
        // Continue anyway - app will work offline with cached state
      }

      setIsReady(true);
    };

    initializeApp();

    // Sync premium status periodically (every 5 minutes)
    const syncInterval = setInterval(async () => {
      try {
        const premiumStatus = await syncPremiumStatus();
        if (premiumStatus !== null) {
          useAppStore.getState().setPremium(premiumStatus);
        }
      } catch (error) {
        console.error('[App] Failed to sync premium status:', error);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(syncInterval);
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
