import React, { useMemo } from 'react';
import { View, ScrollView, Dimensions, Text } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { getMonthsLived } from '../utils/dateEngine';
import { 
  DEFAULT_LIFE_EXPECTANCY_YEARS, 
  LIFE_GRID_MONTHS_PER_ROW, 
  LIFE_GRID_HORIZONTAL_PADDING, 
  LIFE_GRID_SQUARE_MARGIN,
  LIFE_GRID_YEAR_LABEL_WIDTH
} from '../constants/appConfig';

const { width } = Dimensions.get('window');
const SQUARE_SIZE = Math.floor((width - LIFE_GRID_HORIZONTAL_PADDING) / LIFE_GRID_MONTHS_PER_ROW);
const SQUARE_MARGIN = LIFE_GRID_SQUARE_MARGIN;

interface LifeGridProps {
  birthdate?: Date;
}

export const LifeGrid: React.FC<LifeGridProps> = ({ birthdate }) => {
  const theme = useAppStore((state) => state.user?.theme || 'midnight');
  const colors = themes[theme] || themes.midnight;

  const { totalMonths, monthsLived } = useMemo(() => {
    if (!birthdate) {
      return { 
        totalMonths: DEFAULT_LIFE_EXPECTANCY_YEARS * LIFE_GRID_MONTHS_PER_ROW, 
        monthsLived: 0 
      };
    }
    return {
      totalMonths: DEFAULT_LIFE_EXPECTANCY_YEARS * LIFE_GRID_MONTHS_PER_ROW,
      monthsLived: getMonthsLived(birthdate),
    };
  }, [birthdate]);

  const rows = useMemo(() => {
    const result = [];
    for (let year = 0; year < DEFAULT_LIFE_EXPECTANCY_YEARS; year++) {
      const months = [];
      for (let month = 0; month < LIFE_GRID_MONTHS_PER_ROW; month++) {
        const monthNumber = year * LIFE_GRID_MONTHS_PER_ROW + month;
        months.push(monthNumber);
      }
      result.push({ year, months });
    }
    return result;
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 16 }}
    >
      <View>
        {rows.map(({ year, months }) => (
          <View key={year} style={{ flexDirection: 'row', marginBottom: 8 }}>
            <View style={{ width: LIFE_GRID_YEAR_LABEL_WIDTH, justifyContent: 'center', marginRight: 8 }}>
              <Text style={{ color: colors.textMuted, fontSize: 10, textAlign: 'right' }}>
                {year}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {months.map((monthNumber) => {
                const isLived = birthdate && monthNumber < monthsLived;

                return (
                  <View
                    key={monthNumber}
                    style={{
                      width: SQUARE_SIZE,
                      height: SQUARE_SIZE,
                      backgroundColor: isLived ? colors.accent : colors.card,
                      marginRight: SQUARE_MARGIN,
                      marginBottom: SQUARE_MARGIN,
                      borderRadius: 3,
                    }}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
