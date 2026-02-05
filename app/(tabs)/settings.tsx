import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal, Alert, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { SparklesIcon, LockClosedIcon } from 'react-native-heroicons/solid';
import { useAppStore } from '../../store/useAppStore';
import { themes } from '../../lib/themes';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PaywallScreen } from '../../components/PaywallScreen';
import { Theme } from '../../types';
import { formatDate } from '../../utils/dateEngine';
import { 
  APP_NAME, 
  APP_VERSION, 
  DEFAULT_BIRTHDATE_YEAR, 
  DEFAULT_BIRTHDATE_MONTH, 
  DEFAULT_BIRTHDATE_DAY,
  STANDARD_PADDING,
  COLOR_DESTRUCTIVE
} from '../../constants/appConfig';

const THEMES: { id: Theme; name: string; description: string; isPremium?: boolean }[] = [
  { id: 'midnight', name: 'Midnight', description: 'Deep black with indigo accents' },
  { id: 'slate', name: 'Slate', description: 'Cool blue-gray tones' },
  { id: 'indigo', name: 'Indigo', description: 'Rich purple atmosphere' },
  { id: 'emerald', name: 'Emerald', description: 'Dark green serenity' },
  { id: 'pure-white', name: 'Pure White', description: 'Clean minimalist white', isPremium: true },
  { id: 'pure-black', name: 'Pure Black', description: 'True black elegance', isPremium: true },
  { id: 'monochrome', name: 'Monochrome', description: 'Black & white contrast', isPremium: true },
  { id: 'sunset', name: 'Sunset', description: 'Warm pink and rose tones', isPremium: true },
  { id: 'ocean', name: 'Ocean', description: 'Deep blue serenity', isPremium: true },
  { id: 'forest', name: 'Forest', description: 'Natural green harmony', isPremium: true },
];

export default function SettingsScreen() {
  const theme = useAppStore((state) => state.user.theme);
  const birthdate = useAppStore((state) => state.user.birthdate);
  const isPremium = useAppStore((state) => state.user.isPremium);
  const setTheme = useAppStore((state) => state.setTheme);
  const setBirthdate = useAppStore((state) => state.setBirthdate);
  const resetData = useAppStore((state) => state.resetData);
  const colors = themes[theme];

  const [showBirthdateModal, setShowBirthdateModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [tempDate, setTempDate] = useState(
    birthdate || new Date(DEFAULT_BIRTHDATE_YEAR, DEFAULT_BIRTHDATE_MONTH, DEFAULT_BIRTHDATE_DAY)
  );

  const handleSaveBirthdate = () => {
    setBirthdate(tempDate);
    setShowBirthdateModal(false);
  };

  const handleThemePress = (themeOption: typeof THEMES[0]) => {
    if (themeOption.isPremium && !isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setShowPaywall(true);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTheme(themeOption.id);
    }
  };

  const handleResetData = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        resetData();
      }
    } else {
      Alert.alert(
        'Reset All Data',
        'Are you sure you want to reset all data? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: resetData,
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Settings
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Personalize your experience
          </Text>

          {!isPremium && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                PREMIUM
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowPaywall(true);
                }}
              >
                <Card style={styles.premiumCard}>
                  <View style={styles.premiumContent}>
                    <View style={[styles.premiumIcon, { backgroundColor: colors.accent }]}>
                      <SparklesIcon color={colors.background} size={24} />
                    </View>
                    <View style={styles.premiumText}>
                      <Text style={[styles.premiumTitle, { color: colors.text }]}>
                        Upgrade to Premium
                      </Text>
                      <Text style={[styles.premiumDescription, { color: colors.textMuted }]}>
                        Unlock unlimited events, premium themes & more
                      </Text>
                    </View>
                    <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            </>
          )}

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            PERSONAL
          </Text>
          <Card style={styles.sectionCard}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowBirthdateModal(true);
              }}
              style={styles.settingRow}
            >
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Birthdate
                </Text>
                <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                  {birthdate ? formatDate(birthdate) : 'Not set'}
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
            </TouchableOpacity>
          </Card>

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            APPEARANCE
          </Text>
          <View style={styles.themesContainer}>
            {THEMES.map((themeOption) => (
              <TouchableOpacity
                key={themeOption.id}
                onPress={() => handleThemePress(themeOption)}
              >
                <Card
                  style={[
                    styles.themeCard,
                    {
                      borderWidth: theme === themeOption.id ? 2 : 0,
                      borderColor: theme === themeOption.id ? colors.accent : 'transparent',
                      opacity: themeOption.isPremium && !isPremium ? 0.6 : 1,
                    },
                  ]}
                >
                  <View style={styles.themeRow}>
                    <View style={styles.themeInfo}>
                      <View style={styles.themeNameRow}>
                        <Text style={[styles.themeName, { color: colors.text }]}>
                          {themeOption.name}
                        </Text>
                        {themeOption.isPremium && !isPremium && (
                          <LockClosedIcon color={colors.accent} size={16} />
                        )}
                      </View>
                      <Text style={[styles.themeDescription, { color: colors.textMuted }]}>
                        {themeOption.description}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.themePreview,
                        { backgroundColor: themes[themeOption.id].accent },
                      ]}
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            DATA
          </Text>
          <Card>
            <TouchableOpacity onPress={handleResetData}>
              <Text style={styles.resetText}>
                Reset All Data
              </Text>
            </TouchableOpacity>
          </Card>

          <View style={styles.version}>
            <Text style={[styles.versionText, { color: colors.textMuted }]}>
              {APP_NAME} v{APP_VERSION}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showBirthdateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Set Birthdate
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
              <Button
                title="Cancel"
                onPress={() => setShowBirthdateModal(false)}
                variant="secondary"
              />
            </View>
          </Card>
        </View>
      </Modal>

      <Modal visible={showPaywall} animationType="slide" presentationStyle="fullScreen">
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
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: STANDARD_PADDING,
    paddingTop: 32,
    paddingBottom: STANDARD_PADDING,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionCard: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 28,
  },
  premiumCard: {
    marginBottom: 24,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  premiumDescription: {
    fontSize: 14,
  },
  themesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  themeCard: {},
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeInfo: {
    flex: 1,
  },
  themeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeDescription: {
    fontSize: 14,
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  resetText: {
    color: COLOR_DESTRUCTIVE,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  version: {
    marginTop: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
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
