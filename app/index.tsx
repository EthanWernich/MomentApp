import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppStore } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PaywallScreen } from '../components/PaywallScreen';
import { getCurrentYear } from '../utils/dateEngine';
import { APP_NAME, APP_TAGLINE, DEFAULT_BIRTHDATE_YEAR, DEFAULT_BIRTHDATE_MONTH, DEFAULT_BIRTHDATE_DAY } from '../constants/appConfig';

const { width } = Dimensions.get('window');

const ONBOARDING_PAGES = [
  {
    type: 'text' as const,
    title: 'Your life is made of moments.',
    subtitle: 'See where your time really goes.',
  },
  {
    type: 'grid' as const,
    title: 'Some of your life is already behind you.',
    subtitle: 'The rest is unwritten.',
  },
  {
    type: 'text' as const,
    title: 'Don\'t let time pass unnoticed.',
    subtitle: '',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const isPremium = useAppStore((state) => state.user.isPremium);
  const birthdate = useAppStore((state) => state.user.birthdate);
  const setBirthdate = useAppStore((state) => state.setBirthdate);
  const theme = useAppStore((state) => state.user.theme);
  const colors = themes[theme];

  const [currentPage, setCurrentPage] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showBirthdateModal, setShowBirthdateModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(DEFAULT_BIRTHDATE_YEAR, DEFAULT_BIRTHDATE_MONTH, DEFAULT_BIRTHDATE_DAY));

  useEffect(() => {
    if (hasCompletedOnboarding) {
      router.replace('/(tabs)/home');
    }
  }, [hasCompletedOnboarding]);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Show birthdate modal after onboarding
    setShowBirthdateModal(true);
  };

  const handleBirthdateSave = () => {
    setBirthdate(tempDate);
    setShowBirthdateModal(false);
    
    // Show paywall for non-premium users
    if (!isPremium) {
      setShowPaywall(true);
    } else {
      completeOnboarding();
      router.replace('/(tabs)/home');
    }
  };

  const handleBirthdateSkip = () => {
    setShowBirthdateModal(false);
    
    // Show paywall for non-premium users
    if (!isPremium) {
      setShowPaywall(true);
    } else {
      completeOnboarding();
      router.replace('/(tabs)/home');
    }
  };

  const handlePaywallDismiss = () => {
    setShowPaywall(false);
    completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const handlePurchaseSuccess = () => {
    setShowPaywall(false);
    completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextPage = currentPage + 1;
    if (nextPage < ONBOARDING_PAGES.length) {
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <PaywallScreen 
          onDismiss={handlePaywallDismiss}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      </Modal>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {ONBOARDING_PAGES.map((page, index) => (
          <View key={index} style={[styles.page, { width }]}>
            <View style={styles.content}>
              {page.type === 'grid' ? (
                <View style={styles.gridPreview}>
                  {/* Simplified life grid preview - 10 rows x 52 small squares */}
                  {Array.from({ length: 10 }).map((_, rowIndex) => (
                    <View key={rowIndex} style={styles.gridRow}>
                      {Array.from({ length: 52 }).map((_, colIndex) => {
                        const filled = rowIndex * 52 + colIndex < 260; // ~5 years filled
                        return (
                          <View
                            key={colIndex}
                            style={[
                              styles.gridSquare,
                              {
                                backgroundColor: filled ? colors.accent : colors.card,
                              },
                            ]}
                          />
                        );
                      })}
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.textContent} />
              )}

              <Text style={[styles.title, { color: colors.text }]}>
                {page.title}
              </Text>
              {page.subtitle ? (
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                  {page.subtitle}
                </Text>
              ) : null}
            </View>

            <View style={styles.footer}>
              <View style={styles.pagination}>
                {ONBOARDING_PAGES.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: i === index ? colors.accent : colors.separator,
                        width: i === index ? 32 : 8,
                      },
                    ]}
                  />
                ))}
              </View>

              {index === ONBOARDING_PAGES.length - 1 ? (
                <Button title="See My Life" onPress={handleContinue} />
              ) : (
                <Button title="Next" onPress={handleNext} />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Birthdate Modal */}
      <Modal visible={showBirthdateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              When were you born?
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
              This helps us show your life journey
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
              <Button title="Continue" onPress={handleBirthdateSave} />
              <TouchableOpacity onPress={handleBirthdateSkip} style={styles.skipModalButton}>
                <Text style={[styles.skipModalText, { color: colors.textMuted }]}>
                  Skip for now
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    height: 0,
  },
  gridPreview: {
    marginBottom: 60,
    opacity: 0.8,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  gridSquare: {
    width: 4,
    height: 4,
    marginRight: 1.5,
    borderRadius: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 8,
  },
  footer: {
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
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
  skipModalButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipModalText: {
    fontSize: 16,
  },
});
