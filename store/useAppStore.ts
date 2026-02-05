import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Event, Theme } from '../types';
import { STORAGE_KEY_APP_STATE, DEFAULT_THEME } from '../constants/appConfig';

const STORAGE_KEY = STORAGE_KEY_APP_STATE;

const defaultState = {
  user: {
    theme: DEFAULT_THEME as Theme,
    isGuest: true,
    isPremium: false,
  },
  events: [],
  hasCompletedOnboarding: false,
};

// Helper to persist state
const persistState = async (state: Partial<AppState>) => {
  try {
    const jsonValue = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save state', e);
  }
};

// Helper to load state
export const loadPersistedState = async (): Promise<Partial<AppState> | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!jsonValue) {
      return null;
    }
    
    const parsed = JSON.parse(jsonValue);
    
    // Validate and sanitize the parsed data
    if (parsed && typeof parsed === 'object') {
      // Safely convert date strings back to Date objects
      if (parsed.user?.birthdate) {
        try {
          const date = new Date(parsed.user.birthdate);
          // Validate date is valid
          if (!isNaN(date.getTime())) {
            parsed.user.birthdate = date;
          } else {
            delete parsed.user.birthdate;
          }
        } catch {
          delete parsed.user.birthdate;
        }
      }
      
      // Safely convert event dates
      if (parsed.events && Array.isArray(parsed.events)) {
        parsed.events = parsed.events
          .map((event: any) => {
            try {
              return {
                ...event,
                eventDate: new Date(event.eventDate),
                createdAt: new Date(event.createdAt),
              };
            } catch {
              return null;
            }
          })
          .filter((event: any) => event !== null && !isNaN(event.eventDate?.getTime()));
      } else {
        parsed.events = [];
      }
      
      return parsed;
    }
  } catch (e) {
    console.error('[Store] Failed to load state:', e);
  }
  return null;
};

export const useAppStore = create<AppState>((set, get) => ({
  ...defaultState,

  setUser: (user) => {
    set((state) => {
      const newState = { ...state, user: { ...state.user, ...user } };
      persistState(newState);
      return newState;
    });
  },

  setBirthdate: (date) => {
    set((state) => {
      const newState = {
        ...state,
        user: { ...state.user, birthdate: date },
      };
      persistState(newState);
      return newState;
    });
  },

  setTheme: (theme) => {
    set((state) => {
      const newState = {
        ...state,
        user: { ...state.user, theme },
      };
      persistState(newState);
      return newState;
    });
  },

  setPremium: (isPremium) => {
    set((state) => {
      const newState = {
        ...state,
        user: { ...state.user, isPremium },
      };
      persistState(newState);
      return newState;
    });
  },

  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    set((state) => {
      const newState = {
        ...state,
        events: [...state.events, newEvent].sort(
          (a, b) => a.eventDate.getTime() - b.eventDate.getTime()
        ),
      };
      persistState(newState);
      return newState;
    });
  },

  deleteEvent: (id) => {
    set((state) => {
      const newState = {
        ...state,
        events: state.events.filter((e) => e.id !== id),
      };
      persistState(newState);
      return newState;
    });
  },

  updateEvent: (id, eventData) => {
    set((state) => {
      const newState = {
        ...state,
        events: state.events.map((e) =>
          e.id === id ? { ...e, ...eventData } : e
        ),
      };
      persistState(newState);
      return newState;
    });
  },

  completeOnboarding: () => {
    set((state) => {
      const newState = { ...state, hasCompletedOnboarding: true };
      persistState(newState);
      return newState;
    });
  },

  resetData: () => {
    set(defaultState);
    persistState(defaultState);
  },
}));
