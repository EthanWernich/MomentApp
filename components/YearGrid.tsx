import React, { useMemo, useState } from 'react';
import { View, Dimensions, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { Card } from './Card';
import { getCurrentYear, getDaysInYear, getDayOfYear, getCurrentDate, getDaysUntil } from '../utils/dateEngine';
import { YEAR_GRID_CIRCLES_PER_ROW, YEAR_GRID_HORIZONTAL_PADDING, YEAR_GRID_CIRCLE_MARGIN, STANDARD_PADDING } from '../constants/appConfig';
import { Event } from '../types';
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

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = Math.floor((width - YEAR_GRID_HORIZONTAL_PADDING) / YEAR_GRID_CIRCLES_PER_ROW);
const CIRCLE_MARGIN = YEAR_GRID_CIRCLE_MARGIN;

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

export const YearGrid: React.FC = () => {
  const theme = useAppStore((state) => state.user.theme);
  const events = useAppStore((state) => state.events);
  const colors = themes[theme];
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const { daysInYear, daysPassed, today, currentYear } = useMemo(() => {
    const now = getCurrentDate();
    const year = getCurrentYear();
    const total = getDaysInYear(year);
    const passed = getDayOfYear(now);
    return {
      daysInYear: total,
      daysPassed: passed,
      today: passed,
      currentYear: year,
    };
  }, []);

  // Create a map of day of year to events
  const eventsByDay = useMemo(() => {
    const map = new Map();
    
    events.forEach((event) => {
      const eventDate = new Date(event.eventDate);
      const eventYear = eventDate.getFullYear();
      
      // Only show events for the current year
      if (eventYear === currentYear) {
        const dayOfYear = getDayOfYear(eventDate);
        if (!map.has(dayOfYear)) {
          map.set(dayOfYear, []);
        }
        map.get(dayOfYear).push(event);
      }
    });
    
    return map;
  }, [events, currentYear]);

  const handleEventPress = (event: Event) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEvent(event);
    setShowTooltip(true);
  };

  const handleCloseTooltip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTooltip(false);
    setTimeout(() => setSelectedEvent(null), 200);
  };

  const rows = useMemo(() => {
    const result = [];
    let day = 1;
    
    while (day <= daysInYear) {
      const row = [];
      for (let i = 0; i < YEAR_GRID_CIRCLES_PER_ROW && day <= daysInYear; i++) {
        row.push(day);
        day++;
      }
      result.push(row);
    }
    return result;
  }, [daysInYear]);

  const daysUntilEvent = selectedEvent ? getDaysUntil(selectedEvent.eventDate) : 0;

  return (
    <>
      <View style={{ paddingHorizontal: STANDARD_PADDING }}>
        {rows.map((row, rowIndex) => (
          <View
          key={rowIndex}
          style={{ flexDirection: 'row', marginBottom: CIRCLE_MARGIN * 2 }}
        >
          {row.map((day) => {
            const isPassed = day < daysPassed;
            const isToday = day === today;
            const dayEvents = eventsByDay.get(day) || [];
            const hasEvent = dayEvents.length > 0;
            const firstEvent = dayEvents[0];
            
            // Get icon component if there's an event
            const IconComponent = hasEvent ? getIconComponent(firstEvent.icon) : null;

            const circleContent = (
              <View
                style={{
                  width: CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                  borderRadius: CIRCLE_SIZE / 2,
                  backgroundColor: isPassed ? colors.accent : colors.card,
                  marginRight: CIRCLE_MARGIN,
                  marginBottom: CIRCLE_MARGIN,
                  borderWidth: isToday ? 2 : 0,
                  borderColor: isToday ? colors.accent : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {hasEvent && IconComponent && (
                  <IconComponent 
                    color={firstEvent.color || colors.text} 
                    size={Math.floor(CIRCLE_SIZE * 0.5)} 
                  />
                )}
              </View>
            );

            return hasEvent ? (
              <TouchableOpacity
                key={day}
                onPress={() => handleEventPress(firstEvent)}
                activeOpacity={0.7}
              >
                {circleContent}
              </TouchableOpacity>
            ) : (
              <View key={day}>{circleContent}</View>
            );
          })}
          </View>
        ))}
      </View>

      {/* Event Tooltip Modal */}
      <Modal
        visible={showTooltip}
        transparent
        animationType="fade"
        onRequestClose={handleCloseTooltip}
      >
        <TouchableOpacity
          style={styles.tooltipOverlay}
          activeOpacity={1}
          onPress={handleCloseTooltip}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Card style={styles.tooltipCard}>
              {selectedEvent && (
                <>
                  <View style={styles.tooltipHeader}>
                    <View style={[styles.tooltipIcon, { backgroundColor: selectedEvent.color }]}>
                      {(() => {
                        const Icon = getIconComponent(selectedEvent.icon);
                        return Icon ? <Icon color="#000" size={20} /> : null;
                      })()}
                    </View>
                    <Text style={[styles.tooltipTitle, { color: colors.text }]}>
                      {selectedEvent.title}
                    </Text>
                  </View>
                  
                  <View style={styles.tooltipContent}>
                    <Text style={[styles.tooltipDate, { color: colors.textMuted }]}>
                      {new Date(selectedEvent.eventDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                    
                    <View style={[styles.tooltipBadge, { backgroundColor: colors.card }]}>
                      <Text style={[styles.tooltipDays, { color: colors.accent }]}>
                        {daysUntilEvent === 0 
                          ? 'Today!' 
                          : daysUntilEvent > 0 
                            ? `${daysUntilEvent} day${daysUntilEvent === 1 ? '' : 's'} away`
                            : `${Math.abs(daysUntilEvent)} day${Math.abs(daysUntilEvent) === 1 ? '' : 's'} ago`
                        }
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </Card>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  tooltipOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 32,
  },
  tooltipCard: {
    minWidth: 280,
    maxWidth: 320,
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tooltipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
  },
  tooltipContent: {
    gap: 12,
  },
  tooltipDate: {
    fontSize: 16,
  },
  tooltipBadge: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  tooltipDays: {
    fontSize: 18,
    fontWeight: '600',
  },
});
