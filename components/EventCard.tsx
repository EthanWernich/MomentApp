import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { 
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
  TrophyIcon,
  PlusIcon
} from 'react-native-heroicons/solid';
import * as HeroIconsSolid from 'react-native-heroicons/solid';
import { Card } from './Card';
import { useAppStore } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { Event } from '../types';
import { getDaysUntil, formatDate, calculateEventProgress } from '../utils/dateEngine';
import { EVENT_CARD_ICON_SIZE, EVENT_CARD_MARGIN_BOTTOM, EVENT_CARD_PROGRESS_BAR_HEIGHT, EVENT_CARD_PROGRESS_BAR_RADIUS } from '../constants/eventConfig';

const getIconComponent = (name?: string) => {
  if (!name) return null;
  
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
  return IconComponent || null;
};

interface EventCardProps {
  event: Event;
  onDelete: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onDelete }) => {
  const theme = useAppStore((state) => state.user?.theme || 'midnight');
  const colors = themes[theme] || themes.midnight;

  const daysRemaining = getDaysUntil(event.eventDate);
  const progress = calculateEventProgress(event.createdAt, event.eventDate);
  const isPast = daysRemaining < 0;

  const Icon = getIconComponent(event.icon);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {Icon && (
            <View style={styles.iconContainer}>
              <Icon color={event.color || colors.accent} size={EVENT_CARD_ICON_SIZE} />
            </View>
          )}
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              {event.title}
            </Text>
            <Text style={[styles.date, { color: colors.textMuted }]}>
              {formatDate(event.eventDate)}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDelete();
          }} 
          style={styles.deleteButton}
        >
          <XMarkIcon color={colors.textMuted} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.daysText, { color: colors.textMuted }]}>
          {isPast
            ? `${Math.abs(daysRemaining)} days ago`
            : daysRemaining === 0
            ? 'Today!'
            : `${daysRemaining} days remaining`}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: colors.separator }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: event.color || colors.accent,
              },
            ]}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: EVENT_CARD_MARGIN_BOTTOM,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 28,
  },
  footer: {
    marginBottom: 8,
  },
  daysText: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: EVENT_CARD_PROGRESS_BAR_HEIGHT,
    borderRadius: EVENT_CARD_PROGRESS_BAR_RADIUS,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: EVENT_CARD_PROGRESS_BAR_RADIUS,
  },
});
