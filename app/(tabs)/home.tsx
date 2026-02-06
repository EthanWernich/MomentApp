import React, { useMemo } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { themes } from '../../lib/themes';
import { YearGrid } from '../../components/YearGrid';
import { StatCard } from '../../components/StatCard';
import { getCurrentYear, getDaysInYear, getDaysPassedInYear, getDaysRemainingInYear, getYearProgressPercentage } from '../../utils/dateEngine';
import { STANDARD_PADDING } from '../../constants/appConfig';

export default function HomeScreen() {
  const theme = useAppStore((state) => state.user?.theme || 'midnight');
  const colors = themes[theme] || themes.midnight;

  const stats = useMemo(() => {
    const year = getCurrentYear();
    const total = getDaysInYear(year);
    const passed = getDaysPassedInYear(year);
    const remaining = getDaysRemainingInYear(year);
    const percentage = getYearProgressPercentage(year).toFixed(1);

    return { year, total, passed, remaining, percentage };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {stats.year}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Track your journey through the year
          </Text>
          
          <View style={styles.statsRow}>
            <StatCard label="Passed" value={stats.passed} />
            <View style={styles.statGap} />
            <StatCard label="Left" value={stats.remaining} />
            <View style={styles.statGap} />
            <StatCard label="Done" value={`${stats.percentage}%`} />
          </View>
        </View>

        <YearGrid />
      </View>
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
    paddingHorizontal: STANDARD_PADDING,
    paddingTop: 32,
    paddingBottom: STANDARD_PADDING,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statGap: {
    width: 12,
  },
});
