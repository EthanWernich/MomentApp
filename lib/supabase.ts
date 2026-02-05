import { createClient } from '@supabase/supabase-js';

// Placeholder Supabase configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database schema for reference:
// 
// Table: users
// - id: uuid (primary key)
// - created_at: timestamp
// - birthdate: date (nullable)
// - theme: text
//
// Table: events
// - id: uuid (primary key)
// - user_id: uuid (foreign key to users)
// - title: text
// - event_date: date
// - color: text (nullable)
// - icon: text (nullable)
// - created_at: timestamp
