import { Theme } from '../types';

export interface ThemeColors {
  background: string;
  card: string;
  cardHover: string;
  text: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
  separator: string;
}

export const themes: Record<Theme, ThemeColors> = {
  midnight: {
    background: '#0a0a0a',
    card: '#151515',
    cardHover: '#1a1a1a',
    text: '#ffffff',
    textMuted: '#888888',
    accent: '#6366f1',
    accentGlow: '#818cf8',
    separator: '#2a2a2a',
  },
  slate: {
    background: '#0f172a',
    card: '#1e293b',
    cardHover: '#334155',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    accent: '#3b82f6',
    accentGlow: '#60a5fa',
    separator: '#334155',
  },
  indigo: {
    background: '#1e1b4b',
    card: '#312e81',
    cardHover: '#3730a3',
    text: '#e0e7ff',
    textMuted: '#a5b4fc',
    accent: '#818cf8',
    accentGlow: '#a5b4fc',
    separator: '#4338ca',
  },
  emerald: {
    background: '#022c22',
    card: '#064e3b',
    cardHover: '#065f46',
    text: '#d1fae5',
    textMuted: '#6ee7b7',
    accent: '#10b981',
    accentGlow: '#34d399',
    separator: '#047857',
  },
  // Premium themes
  'pure-white': {
    background: '#ffffff',
    card: '#f8f9fa',
    cardHover: '#f1f3f5',
    text: '#000000',
    textMuted: '#6c757d',
    accent: '#6366f1',
    accentGlow: '#818cf8',
    separator: '#e9ecef',
  },
  'pure-black': {
    background: '#000000',
    card: '#0d0d0d',
    cardHover: '#1a1a1a',
    text: '#ffffff',
    textMuted: '#999999',
    accent: '#ffffff',
    accentGlow: '#cccccc',
    separator: '#1a1a1a',
  },
  monochrome: {
    background: '#fafafa',
    card: '#ffffff',
    cardHover: '#f5f5f5',
    text: '#000000',
    textMuted: '#666666',
    accent: '#000000',
    accentGlow: '#333333',
    separator: '#e0e0e0',
  },
  sunset: {
    background: '#1a0a0f',
    card: '#2d1319',
    cardHover: '#3d1a23',
    text: '#ffe4e6',
    textMuted: '#fda4af',
    accent: '#fb7185',
    accentGlow: '#fda4af',
    separator: '#3d1a23',
  },
  ocean: {
    background: '#0a1929',
    card: '#1e3a5f',
    cardHover: '#2a4a6f',
    text: '#e3f2fd',
    textMuted: '#90caf9',
    accent: '#42a5f5',
    accentGlow: '#64b5f6',
    separator: '#2a4a6f',
  },
  forest: {
    background: '#0d1f0d',
    card: '#1a3b1a',
    cardHover: '#244524',
    text: '#e7f5e7',
    textMuted: '#81c784',
    accent: '#66bb6a',
    accentGlow: '#81c784',
    separator: '#244524',
  },
};
