import React, { useMemo } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { getWeeksLived } from '../utils/dateEngine';
import { 
  DEFAULT_LIFE_EXPECTANCY_YEARS, 
  LIFE_WEEKS_PER_ROW, 
  LIFE_WEEKS_HORIZONTAL_PADDING, 
  LIFE_WEEKS_SQUARE_MARGIN,
  LIFE_WEEKS_YEAR_LABEL_WIDTH
} from '../constants/appConfig';

const { width } = Dimensions.get('window');
const SQUARE_SIZE = Math.floor((width - LIFE_WEEKS_HORIZONTAL_PADDING) / LIFE_WEEKS_PER_ROW);
const SQUARE_MARGIN = LIFE_WEEKS_SQUARE_MARGIN;

interface LifeWeeksGridProps {
  birthdate?: Date;
}

export const LifeWeeksGrid: React.FC<LifeWeeksGridProps> = React.memo(({ birthdate }) => {
  const theme = useAppStore((state) => state.user.theme);
  const colors = themes[theme];

  const { totalWeeks, weeksLived, currentWeekIndex } = useMemo(() => {
    if (!birthdate) {
      return { 
        totalWeeks: DEFAULT_LIFE_EXPECTANCY_YEARS * LIFE_WEEKS_PER_ROW, 
        weeksLived: 0,
        currentWeekIndex: -1
      };
    }
    const lived = getWeeksLived(birthdate);
    return {
      totalWeeks: DEFAULT_LIFE_EXPECTANCY_YEARS * LIFE_WEEKS_PER_ROW,
      weeksLived: lived,
      currentWeekIndex: lived, // Current week is the next week to live
    };
  }, [birthdate]);

  const rows = useMemo(() => {
    const result = [];
    for (let year = 0; year < DEFAULT_LIFE_EXPECTANCY_YEARS; year++) {
      const weeks = [];
      for (let week = 0; week < LIFE_WEEKS_PER_ROW; week++) {
        const weekNumber = year * LIFE_WEEKS_PER_ROW + week;
        weeks.push(weekNumber);
      }
      result.push({ year, weeks });
    }
    return result;
  }, []);

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View>
        {rows.map(({ year, weeks }) => (
          <View key={year} style={{ flexDirection: 'row', marginBottom: 6 }}>
            <View style={{ width: LIFE_WEEKS_YEAR_LABEL_WIDTH, justifyContent: 'center', marginRight: 8 }}>
              <Text style={{ color: colors.textMuted, fontSize: 10, textAlign: 'right' }}>
                {year}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {weeks.map((weekNumber) => {
                const isLived = birthdate && weekNumber < weeksLived;
                const isCurrent = birthdate && weekNumber === currentWeekIndex;

                return (
                  <View
                    key={weekNumber}
                    style={{
                      width: SQUARE_SIZE,
                      height: SQUARE_SIZE,
                      backgroundColor: isLived ? colors.accent : colors.card,
                      marginRight: SQUARE_MARGIN,
                      marginBottom: SQUARE_MARGIN,
                      borderRadius: 2,
                      // Outline for current week
                      borderWidth: isCurrent ? 2 : 0,
                      borderColor: isCurrent ? colors.accent : 'transparent',
                    }}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

LifeWeeksGrid.displayName = 'LifeWeeksGrid';
