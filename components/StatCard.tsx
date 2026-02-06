import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { useAppStore } from '../store/useAppStore';
import { themes } from '../lib/themes';

interface StatCardProps {
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  const theme = useAppStore((state) => state.user?.theme || 'midnight');
  const colors = themes[theme] || themes.midnight;

  return (
    <Card style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: colors.text }]}>
        {value}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
});
