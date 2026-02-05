import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { CalendarIcon, SparklesIcon, ListBulletIcon, Cog6ToothIcon } from 'react-native-heroicons/outline';
import { useAppStore } from '../../store/useAppStore';
import { themes } from '../../lib/themes';

export default function TabsLayout() {
  const theme = useAppStore((state) => state.user.theme);
  const colors = themes[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.separator,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Year',
          tabBarIcon: ({ color }) => <CalendarIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="life"
        options={{
          title: 'Life',
          tabBarIcon: ({ color }) => <SparklesIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <ListBulletIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Cog6ToothIcon color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
