import { Event } from '../types';

/**
 * Mock events for testing
 * Uncomment and use these in development to test the Events screen
 */
export const mockEvents: Omit<Event, 'id' | 'createdAt'>[] = [
  {
    title: 'Birthday',
    eventDate: new Date(2026, 5, 15), // June 15, 2026
    icon: '🎂',
    color: '#ec4899',
  },
  {
    title: 'Vacation to Hawaii',
    eventDate: new Date(2026, 6, 1), // July 1, 2026
    icon: '✈️',
    color: '#3b82f6',
  },
  {
    title: 'Project Launch',
    eventDate: new Date(2026, 2, 30), // March 30, 2026
    icon: '🚀',
    color: '#6366f1',
  },
  {
    title: 'Anniversary',
    eventDate: new Date(2026, 8, 10), // September 10, 2026
    icon: '💍',
    color: '#f59e0b',
  },
];

/**
 * To use mock data:
 * 
 * 1. Import in your app:
 *    import { mockEvents } from './lib/mockData';
 * 
 * 2. Add to store on first load:
 *    mockEvents.forEach(event => addEvent(event));
 */
