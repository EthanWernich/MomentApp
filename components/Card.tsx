import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { themes } from '../lib/themes';
import { CARD_BORDER_RADIUS } from '../constants/appConfig';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const theme = useAppStore((state) => state.user?.theme || 'midnight');
  const colors = themes[theme] || themes.midnight;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: CARD_BORDER_RADIUS,
    padding: 20,
  },
});
