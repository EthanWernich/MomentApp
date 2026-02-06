import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Haptics from 'expo-haptics';
import { ShareIcon } from 'react-native-heroicons/outline';
import { useAppStore } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { Card } from './Card';
import { getWeeksLived, getWeeksRemaining, getLifePercentage } from '../utils/dateEngine';
import { DEFAULT_LIFE_EXPECTANCY_YEARS, APP_NAME, STANDARD_PADDING } from '../constants/appConfig';

interface LifeSnapshotProps {
  birthdate?: Date;
  onTriggerPaywall?: () => void;
}

export const LifeSnapshot: React.FC<LifeSnapshotProps> = ({ birthdate, onTriggerPaywall }) => {
  const theme = useAppStore((state) => state.user?.theme || 'midnight');
  const isPremium = useAppStore((state) => state.user?.isPremium || false);
  const colors = themes[theme] || themes.midnight;
  const viewRef = useRef<View>(null);

  const stats = React.useMemo(() => {
    if (!birthdate) {
      return { lived: 0, remaining: 0, percentage: '0.0' };
    }
    return {
      lived: getWeeksLived(birthdate),
      remaining: getWeeksRemaining(birthdate, DEFAULT_LIFE_EXPECTANCY_YEARS),
      percentage: getLifePercentage(birthdate, DEFAULT_LIFE_EXPECTANCY_YEARS).toFixed(1),
    };
  }, [birthdate]);

  const handleShare = async () => {
    if (!birthdate) {
      Alert.alert('Set Birthdate', 'Please set your birthdate first to share your life snapshot.');
      return;
    }

    // Check premium status - gate share feature
    if (!isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      if (onTriggerPaywall) {
        onTriggerPaywall();
      } else {
        Alert.alert('Premium Feature', 'Upgrade to Premium to share your life snapshot.');
      }
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Capture the snapshot
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1.0,
      });

      // Share the image
      await Share.share({
        message: `My life in numbers - ${APP_NAME}`,
        url: Platform.OS === 'ios' ? uri : `file://${uri}`,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error sharing snapshot:', error);
      Alert.alert('Share Failed', 'Could not create shareable image. Please try again.');
    }
  };

  if (!birthdate) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View 
        ref={viewRef} 
        collapsable={false}
        style={[styles.snapshotCard, { backgroundColor: colors.card }]}
      >
        <View style={styles.brandingRow}>
          <View style={[styles.brandingDot, { backgroundColor: colors.accent }]} />
          <Text style={[styles.brandingText, { color: colors.textMuted }]}>
            {APP_NAME}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.lived.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Weeks Lived
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statRow}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.remaining.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Weeks Remaining
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statRow}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {stats.percentage}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Life Complete
            </Text>
          </View>
        </View>

        <View style={[styles.progressBar, { backgroundColor: colors.separator }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: colors.accent,
                width: `${stats.percentage}%`
              }
            ]} 
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleShare}
        style={[styles.shareButton, { backgroundColor: colors.accent }]}
      >
        <ShareIcon color={colors.text} size={20} />
        <Text style={[styles.shareButtonText, { color: colors.text }]}>
          Share Life Snapshot
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: STANDARD_PADDING,
    paddingTop: 8,
  },
  snapshotCard: {
    borderRadius: 20,
    padding: 32,
    marginBottom: 16,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  brandingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  brandingText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statsContainer: {
    gap: 24,
    marginBottom: 32,
  },
  statRow: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
