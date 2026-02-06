import { View, Text, SafeAreaView, ScrollView, Modal, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { 
  PlusIcon, 
  CakeIcon, 
  PaperAirplaneIcon, 
  AcademicCapIcon, 
  HeartIcon, 
  HomeIcon, 
  FlagIcon, 
  StarIcon, 
  RocketLaunchIcon,
  PaintBrushIcon,
  BookOpenIcon,
  TrophyIcon
} from 'react-native-heroicons/solid';
import * as HeroIconsSolid from 'react-native-heroicons/solid';
import { useAppStore } from '../../store/useAppStore';
import { themes } from '../../lib/themes';
import { EventCard } from '../../components/EventCard';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { IconSearchModal } from '../../components/IconSearchModal';
import { PaywallScreen } from '../../components/PaywallScreen';
import { 
  EVENT_ICON_NAMES, 
  EVENT_COLOR_OPTIONS, 
  DEFAULT_EVENT_ICON, 
  DEFAULT_EVENT_COLOR,
  EVENT_MODAL_ICON_BUTTON_SIZE,
  EVENT_MODAL_COLOR_BUTTON_SIZE,
  EVENT_MODAL_ICON_GRID_GAP,
  AllIconName,
} from '../../constants/eventConfig';
import { STANDARD_PADDING, STANDARD_BORDER_RADIUS } from '../../constants/appConfig';
import { canCreateMoreEvents, getFeatureGateMessage } from '../../services/featureGate';

const ICON_NAMES = [...EVENT_ICON_NAMES];
const COLOR_OPTIONS = [...EVENT_COLOR_OPTIONS];

const getIconComponent = (name: string) => {
  // Handle basic free icons first
  switch (name) {
    case 'cake': return CakeIcon;
    case 'airplane': return PaperAirplaneIcon;
    case 'academic': return AcademicCapIcon;
    case 'heart': return HeartIcon;
    case 'home': return HomeIcon;
    case 'flag': return FlagIcon;
    case 'star': return StarIcon;
    case 'rocket': return RocketLaunchIcon;
    case 'paint': return PaintBrushIcon;
    case 'book': return BookOpenIcon;
    case 'trophy': return TrophyIcon;
    case 'plus': return PlusIcon;
  }
  
  // Handle premium icons dynamically
  const componentName = name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Icon';
  
  const IconComponent = (HeroIconsSolid as any)[componentName];
  return IconComponent || CakeIcon;
};

export default function EventsScreen() {
  const theme = useAppStore((state) => state.user?.theme || 'midnight');
  const events = useAppStore((state) => state.events || []);
  const addEvent = useAppStore((state) => state.addEvent);
  const deleteEvent = useAppStore((state) => state.deleteEvent);
  const isPremium = useAppStore((state) => state.user?.isPremium || false);
  const colors = themes[theme] || themes.midnight;

  const [showModal, setShowModal] = useState(false);
  const [showIconSearch, setShowIconSearch] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedIcon, setSelectedIcon] = useState<string>(DEFAULT_EVENT_ICON);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_EVENT_COLOR);

  const handleAddEvent = () => {
    if (title.trim()) {
      addEvent({
        title: title.trim(),
        eventDate: selectedDate,
        icon: selectedIcon,
        color: selectedColor,
      });
      setTitle('');
      setSelectedDate(new Date());
      setSelectedIcon(DEFAULT_EVENT_ICON);
      setSelectedColor(DEFAULT_EVENT_COLOR);
      setShowModal(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Events
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Track important moments
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (canCreateMoreEvents(events.length, isPremium)) {
                setShowModal(true);
              } else {
                // Trigger paywall for 4th event
                setShowPaywall(true);
              }
            }}
            style={[styles.addButton, { backgroundColor: colors.accent }]}
          >
            <PlusIcon color={colors.text} size={28} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No events yet.{'\n'}Tap + to create your first event.
              </Text>
            </View>
          ) : (
            events.map((event) => (
              <EventCard key={event.id} event={event} onDelete={() => deleteEvent(event.id)} />
            ))
          )}
        </ScrollView>
      </View>

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.separator }]}>
            <TouchableOpacity 
              onPress={() => setShowModal(false)}
              style={styles.cancelButton}
            >
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              New Event
            </Text>
            <View style={styles.cancelButton} />
          </View>

          <ScrollView 
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              <Text style={[styles.label, { color: colors.textMuted }]}>
                Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Event title"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.card,
                    borderColor: colors.separator,
                  },
                ]}
                autoFocus
              />

              <Text style={[styles.label, { color: colors.textMuted }]}>
                Date
              </Text>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => date && setSelectedDate(date)}
                textColor={colors.text}
                themeVariant="dark"
              />

              <Text style={[styles.label, { color: colors.textMuted }]}>
                Icon
              </Text>
              <View style={styles.iconGrid}>
                {ICON_NAMES.map((name) => {
                  const Icon = getIconComponent(name);
                  return (
                    <TouchableOpacity
                      key={name}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedIcon(name);
                      }}
                      style={[
                        styles.iconButton,
                        {
                          backgroundColor:
                            selectedIcon === name ? colors.accent : colors.card,
                        },
                      ]}
                    >
                      <Icon color={colors.text} size={24} />
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setShowIconSearch(true);
                  }}
                  style={[
                    styles.iconButton,
                    styles.moreIconButton,
                    { backgroundColor: colors.card, borderColor: colors.accent },
                  ]}
                >
                  <PlusIcon color={colors.accent} size={24} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: colors.textMuted }]}>
                Color
              </Text>
              <View style={styles.colorGrid}>
                {COLOR_OPTIONS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedColor(color);
                    }}
                    style={[
                      styles.colorButton,
                      {
                        backgroundColor: color,
                        borderWidth: selectedColor === color ? 3 : 0,
                        borderColor: colors.text,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.modalButtons}>
                <Button title="Add Event" onPress={handleAddEvent} disabled={!title.trim()} />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <IconSearchModal
        visible={showIconSearch}
        onClose={() => setShowIconSearch(false)}
        onSelectIcon={(iconName) => setSelectedIcon(iconName)}
        currentIcon={selectedIcon}
      />

      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <PaywallScreen 
          onDismiss={() => setShowPaywall(false)}
          onPurchaseSuccess={() => {
            setShowPaywall(false);
            setShowModal(true); // Open event modal after purchase
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: STANDARD_PADDING,
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 32,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: STANDARD_PADDING,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: STANDARD_PADDING,
    paddingVertical: 16,
    borderBottomWidth: 1,
    // Note: borderBottomColor should use theme colors, but StyleSheet doesn't have access to theme
    // This is set dynamically in the component via inline style
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cancelButton: {
    width: 60,
  },
  cancelText: {
    fontSize: 16,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 40,
  },
  modalContent: {
    paddingHorizontal: STANDARD_PADDING,
    paddingTop: STANDARD_PADDING,
  },
  input: {
    borderWidth: 1,
    borderRadius: STANDARD_BORDER_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: STANDARD_PADDING,
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: EVENT_MODAL_ICON_GRID_GAP,
    marginBottom: 16,
  },
  iconButton: {
    width: EVENT_MODAL_ICON_BUTTON_SIZE,
    height: EVENT_MODAL_ICON_BUTTON_SIZE,
    borderRadius: STANDARD_BORDER_RADIUS - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreIconButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  colorGrid: {
    flexDirection: 'row',
    gap: EVENT_MODAL_ICON_GRID_GAP,
    marginBottom: STANDARD_PADDING,
  },
  colorButton: {
    width: EVENT_MODAL_COLOR_BUTTON_SIZE,
    height: EVENT_MODAL_COLOR_BUTTON_SIZE,
    borderRadius: STANDARD_BORDER_RADIUS - 4,
  },
  modalButtons: {
    marginTop: 32,
  },
});
