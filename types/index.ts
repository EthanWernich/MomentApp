export interface Event {
  id: string;
  title: string;
  eventDate: Date;
  color?: string;
  icon?: string;
  createdAt: Date;
}

export interface User {
  id?: string;
  birthdate?: Date;
  theme: Theme;
  isGuest: boolean;
  isPremium: boolean;
}

export type Theme = 
  | 'midnight' 
  | 'slate' 
  | 'indigo' 
  | 'emerald'
  | 'pure-white'      // Premium
  | 'pure-black'      // Premium
  | 'monochrome'      // Premium (black & white)
  | 'sunset'          // Premium
  | 'ocean'           // Premium
  | 'forest';         // Premium

export interface AppState {
  user: User;
  events: Event[];
  hasCompletedOnboarding: boolean;
  
  // Actions
  setUser: (user: Partial<User>) => void;
  setBirthdate: (date: Date) => void;
  setTheme: (theme: Theme) => void;
  setPremium: (isPremium: boolean) => void;
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  completeOnboarding: () => void;
  resetData: () => void;
}
