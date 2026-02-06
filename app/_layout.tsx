import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore, loadPersistedState } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { View, ActivityIndicator } from 'react-native';
import { initializePurchases, syncPremiumStatus } from '../services/purchaseService';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const theme = useAppStore((state: any) => state.user?.theme) || 'midnight';
  const colors = themes[theme as keyof typeof themes] || themes.midnight;


  // Global error handler
  useEffect(() => {
    type ErrorHandler = (error: unknown, isFatal: boolean) => void;
    const errorUtils = (globalThis as {
      ErrorUtils?: {
        getGlobalHandler?: () => ErrorHandler | undefined;
        setGlobalHandler?: (handler: ErrorHandler) => void;
      };
    }).ErrorUtils;

    const getGlobalHandler = errorUtils?.getGlobalHandler;
    const setGlobalHandler = errorUtils?.setGlobalHandler;

    if (!getGlobalHandler || !setGlobalHandler) {
      console.warn('[Global Error Handler] ErrorUtils unavailable');
      return;
    }

    const originalHandler = getGlobalHandler();

    setGlobalHandler((error, isFatal) => {
      console.error('[Global Error Handler]', isFatal ? 'FATAL' : 'NON-FATAL', error);

      if (!isFatal) return;

      if (!__DEV__) {
        try {
          console.warn('[Global Error Handler] Attempting recovery...');
          setIsReady(true);
        } catch {
          originalHandler?.(error, isFatal);
        }
      } else {
        originalHandler?.(error, isFatal);
      }
    });

    return () => {
      if (originalHandler) {
        setGlobalHandler(originalHandler);
      }
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load persisted state FIRST
        try {
          const state = await loadPersistedState();

          if (state && typeof state === 'object') {
            useAppStore.setState((currentState: any) => ({

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
          console.error('[App] Failed to load state:', stateError);
        }

        setIsReady(true);

        // Initialize purchases AFTER UI loads
        setTimeout(async () => {
          try {
            await initializePurchases();

            try {
              const premiumStatus = await syncPremiumStatus();
              if (premiumStatus !== null) {
                useAppStore.getState().setPremium(premiumStatus);
              }
            } catch (syncError) {
              console.error('[App] Premium sync failed:', syncError);
            }
          } catch (rcError) {
            console.error('[App] Purchases init failed:', rcError);
          }
        }, 1000);

      } catch (error) {
        console.error('[App] Critical initialization error:', error);
        setIsReady(true);
      }
    };

    initializeApp().catch((error) => {
      console.error('[App] Unhandled initialization error:', error);
      setIsReady(true);
    });

    const syncInterval = setInterval(async () => {
      try {
        const premiumStatus = await syncPremiumStatus();
        if (premiumStatus !== null) {
          useAppStore.getState().setPremium(premiumStatus);
        }
      } catch (error) {
        console.error('[App] Background premium sync failed:', error);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, []);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
