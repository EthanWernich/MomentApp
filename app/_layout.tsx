import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore, loadPersistedState } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { View, ActivityIndicator, Platform } from 'react-native';
import { initializePurchases, syncPremiumStatus } from '../services/purchaseService';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ErrorUtils } from 'react-native';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const theme = useAppStore((state) => state.user?.theme) || 'midnight';
  // Fallback to midnight theme if theme is invalid
  const colors = themes[theme] || themes.midnight;

  // Global error handler for unhandled JS exceptions
  useEffect(() => {
    const originalHandler = ErrorUtils.getGlobalHandler();
    
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.error('[Global Error Handler]', isFatal ? 'FATAL' : 'NON-FATAL', error);
      
      // For non-fatal errors, just log and continue
      if (!isFatal) {
        return;
      }
      
      // For fatal errors in production, try to recover
      if (!__DEV__) {
        try {
          // Reset to default state and try to continue
          console.warn('[Global Error Handler] Attempting recovery...');
          setIsReady(true);
        } catch (recoveryError) {
          // If recovery fails, call original handler
          if (originalHandler) {
            originalHandler(error, isFatal);
          }
        }
      } else {
        // In dev, use original handler (shows red screen)
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      }
    });

    return () => {
      if (originalHandler) {
        ErrorUtils.setGlobalHandler(originalHandler);
      }
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load persisted state FIRST (critical for app to work)
        try {
          const state = await loadPersistedState();
          if (state && typeof state === 'object') {
            // MERGE with existing defaults, don't replace
            useAppStore.setState((currentState) => ({
              ...currentState,
              ...state,
              user: {
                ...currentState.user,
                ...(state.user || {}),
              },
              events: state.events || currentState.events,
            }));
          }
        } catch (stateError) {
          console.error('[App] Failed to load state, using defaults:', stateError);
          // Continue with default state
        }

        // Set ready immediately after state loads
        setIsReady(true);

        // Initialize RevenueCat AFTER UI is ready (deferred, non-blocking)
        // This prevents crashes from blocking the app startup
        setTimeout(async () => {
          try {
            await initializePurchases();
            
            // Sync premium status with RevenueCat (optional)
            try {
              const premiumStatus = await syncPremiumStatus();
              if (premiumStatus !== null) {
                useAppStore.getState().setPremium(premiumStatus);
              }
            } catch (syncError) {
              console.error('[App] Failed to sync premium status:', syncError);
            }
          } catch (rcError) {
            console.error('[App] Failed to initialize purchases:', rcError);
            // App continues with cached premium state - this is fine
          }
        }, 1000); // Delay RevenueCat init by 1 second
        
      } catch (error) {
        console.error('[App] Critical initialization error:', error);
        // Even if everything fails, show the app
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
    <ErrorBoundary>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </ErrorBoundary>
  );
}
