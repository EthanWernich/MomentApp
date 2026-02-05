# Moment

**See your life clearly.**

A minimal, premium time-tracking app built with React Native and Expo.

## Features

- **Year View**: Visualize your current year as a beautiful grid of 365 days
- **Life in Weeks**: See your entire life (90 years) mapped out week by week
- **Events Tracker**: Track important moments and milestones
- **4 Premium Themes**: Midnight, Slate, Indigo, and Emerald
- **Guest Mode First**: No signup required, all data stored locally
- **Smooth Performance**: Optimized grids with animations

## Tech Stack

- **Expo** (~51.0.0) - React Native framework
- **TypeScript** - Type safety
- **Expo Router** - File-based navigation
- **Zustand** - Global state management
- **AsyncStorage** - Local data persistence
- **NativeWind** - Tailwind CSS for React Native
- **React Native Reanimated** - Smooth animations
- **Supabase** (Ready for future sync)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (installed globally or via npx)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npx expo start
```

3. Run on your device or emulator:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
moment/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── home.tsx       # Year view
│   │   ├── life.tsx       # Life in weeks
│   │   ├── events.tsx     # Events tracker
│   │   └── settings.tsx   # Settings
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Onboarding
├── components/            # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── EventCard.tsx
│   ├── LifeGrid.tsx
│   ├── StatCard.tsx
│   └── YearGrid.tsx
├── store/                 # Zustand state management
│   └── useAppStore.ts
├── lib/                   # Utilities and config
│   ├── supabase.ts
│   ├── themes.ts
│   └── utils.ts
├── types/                 # TypeScript definitions
│   └── index.ts
└── assets/               # Images and icons

```

## Adding Supabase (Optional)

The app works completely offline by default. To add cloud sync:

1. Create a Supabase project at https://supabase.com

2. Run these SQL commands in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  birthdate DATE,
  theme TEXT DEFAULT 'midnight'
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

3. Copy `.env.example` to `.env` and add your credentials:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Implement sync logic in `store/useAppStore.ts` (currently guest-only)

## Design Philosophy

- **Ultra Minimal**: No clutter, only essential features
- **Dark First**: Premium dark themes for comfortable viewing
- **Smooth**: Optimized grids and animations
- **Emotional**: Make time tracking meaningful, not corporate

## Performance Notes

- Year and Life grids are memoized for smooth scrolling
- Animations use React Native Reanimated for 60fps
- AsyncStorage persists data instantly
- No unnecessary re-renders

## Roadmap (Not Implemented Yet)

- [ ] Supabase authentication and sync
- [ ] Push notifications for events
- [ ] Widget support
- [ ] Export data
- [ ] Social features

## License

Private project - All rights reserved

---

Built with ❤️ using Expo
