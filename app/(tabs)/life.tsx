import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, Modal, Platform, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/outline';
import { useAppStore } from '../../store/useAppStore';
import { themes } from '../../lib/themes';
import { LifeWeeksGrid } from '../../components/LifeWeeksGrid';
import { LifeSnapshot } from '../../components/LifeSnapshot';
import { PaywallScreen } from '../../components/PaywallScreen';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { getWeeksLived, getWeeksRemaining, getLifePercentage, getTotalWeeksInLife } from '../../utils/dateEngine';
import { DEFAULT_LIFE_EXPECTANCY_YEARS, DEFAULT_BIRTHDATE_YEAR, DEFAULT_BIRTHDATE_MONTH, DEFAULT_BIRTHDATE_DAY, STANDARD_PADDING } from '../../constants/appConfig';

export default function LifeScreen() {
  const theme = useAppStore((state) => state.user.theme);
  const birthdate = useAppStore((state) => state.user.birthdate);
  const setBirthdate = useAppStore((state) => state.setBirthdate);
  const colors = themes[theme];

  const [showModal, setShowModal] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [tempDate, setTempDate] = useState(birthdate || new Date(DEFAULT_BIRTHDATE_YEAR, DEFAULT_BIRTHDATE_MONTH, DEFAULT_BIRTHDATE_DAY));

  const stats = useMemo(() => {
    if (!birthdate) {
      const totalWeeks = getTotalWeeksInLife(DEFAULT_LIFE_EXPECTANCY_YEARS);
      return { lived: 0, remaining: totalWeeks, percentage: '0.0' };
    }
    return {
      lived: getWeeksLived(birthdate),
      remaining: getWeeksRemaining(birthdate, DEFAULT_LIFE_EXPECTANCY_YEARS),
      percentage: getLifePercentage(birthdate, DEFAULT_LIFE_EXPECTANCY_YEARS).toFixed(1),
    };
  }, [birthdate]);

  const handleSaveBirthdate = () => {
    setBirthdate(tempDate);
    setShowModal(false);
  };

  if (!birthdate) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyContent}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Life in Weeks
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Enter your birthdate to visualize your life journey
            </Text>
            <Button title="Set Birthdate" onPress={() => setShowModal(true)} />
          </View>

          <Modal visible={showModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <Card style={styles.modalCard}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Your Birthdate
                </Text>
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => date && setTempDate(date)}
                    maximumDate={new Date()}
                    textColor={colors.text}
                    themeVariant="dark"
                    style={styles.datePicker}
                  />
                </View>
                <View style={styles.modalButtons}>
                  <Button title="Save" onPress={handleSaveBirthdate} />
                  <View style={styles.buttonGap} />
                  <Button title="Cancel" onPress={() => setShowModal(false)} variant="secondary" />
                </View>
              </Card>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleGrid = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowGrid(!showGrid);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Life in Weeks
          </Text>
        </View>

        <LifeSnapshot birthdate={birthdate} onTriggerPaywall={() => setShowPaywall(true)} />

        <View style={styles.detailsSection}>
          <TouchableOpacity
            onPress={handleToggleGrid}
            style={[styles.detailsButton, { backgroundColor: colors.card }]}
          >
            <View style={styles.detailsButtonContent}>
              <Text style={[styles.detailsButtonText, { color: colors.text }]}>
                {showGrid ? 'Hide Details' : 'View Details'}
              </Text>
              <Text style={[styles.detailsButtonSubtext, { color: colors.textMuted }]}>
                See your life visualized week by week
              </Text>
            </View>
            {showGrid ? (
              <ChevronUpIcon color={colors.textMuted} size={24} />
            ) : (
              <ChevronDownIcon color={colors.textMuted} size={24} />
            )}
          </TouchableOpacity>

          {showGrid && (
            <View style={styles.gridContainer}>
              <View style={styles.gridHeader}>
                <Text style={[styles.gridHeaderText, { color: colors.textMuted }]}>
                  Each row is one year • 52 weeks • 90 years total
                </Text>
              </View>
              <LifeWeeksGrid birthdate={birthdate} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Paywall Modal */}
      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <PaywallScreen 
          onDismiss={() => setShowPaywall(false)}
          onPurchaseSuccess={() => setShowPaywall(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  header: {
    paddingHorizontal: STANDARD_PADDING,
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
  },
  detailsSection: {
    paddingHorizontal: STANDARD_PADDING,
    paddingBottom: STANDARD_PADDING,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 16,
  },
  detailsButtonContent: {
    flex: 1,
  },
  detailsButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsButtonSubtext: {
    fontSize: 14,
  },
  gridContainer: {
    marginTop: 16,
  },
  gridHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  gridHeaderText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalCard: {
    width: '80%',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  datePickerContainer: {
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  datePicker: {
    width: '100%',
  },
  modalButtons: {
    marginTop: 24,
    gap: 12,
  },
  buttonGap: {
    height: 12,
  },
});
