import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { 
  CheckIcon,
  ArrowPathIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { themes } from '../lib/themes';
import { useAppStore } from '../store/useAppStore';
import { Button } from './Button';
import {
  getOfferings,
  purchaseLifetime,
  restorePurchases,
  initializePurchases,
} from '../services/purchaseService';
import { PREMIUM_PRICE_DISPLAY } from '../constants/appConfig';

interface PaywallScreenProps {
  onDismiss?: () => void;
  onPurchaseSuccess?: () => void;
}

const FEATURES = [
  'Unlimited events',
  'Share life snapshots',
  'Premium themes',
  '50+ exclusive icons',
  'Lifetime access',
  'No subscriptions',
];

export function PaywallScreen({ onDismiss, onPurchaseSuccess }: PaywallScreenProps) {
  const theme = useAppStore((state) => state.user.theme);
  const setPremium = useAppStore((state) => state.setPremium);
  const colors = themes[theme];
  
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [price, setPrice] = useState(PREMIUM_PRICE_DISPLAY);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      await initializePurchases();
      const offering = await getOfferings();
      
      if (offering && offering.availablePackages.length > 0) {
        const packagePrice = offering.availablePackages[0].product.priceString;
        setPrice(packagePrice);
      }
    } catch (error) {
      console.error('[Paywall] Failed to load offerings:', error);
    }
  };

  const handlePurchase = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const customerInfo = await purchaseLifetime();
      
      if (customerInfo) {
        // Check if user has active entitlement
        const hasActiveEntitlement =
          typeof customerInfo.entitlements.active['premium'] !== 'undefined';

        if (hasActiveEntitlement) {
          setPremium(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          Alert.alert(
            'Welcome to Premium!',
            'You now have lifetime access to all premium features.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  onPurchaseSuccess?.();
                  onDismiss?.();
                },
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('[Paywall] Purchase error:', error);
      Alert.alert(
        'Purchase Failed',
        'Something went wrong. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRestoring(true);

    try {
      const customerInfo = await restorePurchases();
      
      if (customerInfo) {
        const hasActiveEntitlement =
          typeof customerInfo.entitlements.active['premium'] !== 'undefined';

        if (hasActiveEntitlement) {
          setPremium(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          Alert.alert(
            'Purchases Restored',
            'Your premium access has been restored.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  onPurchaseSuccess?.();
                  onDismiss?.();
                },
              },
            ]
          );
        } else {
          Alert.alert(
            'No Purchases Found',
            'We couldn\'t find any previous purchases to restore.',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'Restore Failed',
          'Unable to restore purchases. Please check your connection.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('[Paywall] Restore error:', error);
      Alert.alert(
        'Restore Failed',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setRestoring(false);
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {onDismiss && (
        <TouchableOpacity
          onPress={handleClose}
          style={[styles.closeButton, { backgroundColor: colors.card }]}
        >
          <XMarkIcon color={colors.textMuted} size={24} />
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.headline, { color: colors.text }]}>
            Unlock Premium
          </Text>
          
          <Text style={[styles.tagline, { color: colors.textMuted }]}>
            Pay once. Own Moment forever.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={[styles.checkCircle, { backgroundColor: colors.accent }]}>
                <CheckIcon color={colors.background} size={16} strokeWidth={3} />
              </View>
              <Text style={[styles.featureText, { color: colors.text }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.priceCard, { backgroundColor: colors.card }]}>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textMuted }]}>
              Lifetime Access
            </Text>
            <View style={[styles.lifetimeBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.badgeText, { color: colors.background }]}>
                ONE-TIME
              </Text>
            </View>
          </View>
          <Text style={[styles.priceAmount, { color: colors.text }]}>
            {price}
          </Text>
          <Text style={[styles.priceSubtext, { color: colors.textMuted }]}>
            No subscriptions. No recurring fees.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title={loading ? 'Processing...' : 'Get Premium'}
            onPress={handlePurchase}
            disabled={loading || restoring}
          />

          <TouchableOpacity
            onPress={handleRestore}
            disabled={loading || restoring}
            style={styles.restoreButton}
          >
            {restoring ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <>
                <ArrowPathIcon color={colors.textMuted} size={18} />
                <Text style={[styles.restoreText, { color: colors.textMuted }]}>
                  Restore Purchases
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 18,
    fontWeight: '500',
  },
  priceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  lifetimeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  priceSubtext: {
    fontSize: 14,
  },
  actions: {
    gap: 16,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  restoreText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
