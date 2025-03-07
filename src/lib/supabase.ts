
import { createClient } from '@supabase/supabase-js';

// Check if there are credentials stored in localStorage (for development)
const localSupabaseUrl = localStorage.getItem('supabase_url');
const localSupabaseKey = localStorage.getItem('supabase_key');

// Use local storage values first (for development), then environment variables, then defaults
const supabaseUrl = localSupabaseUrl || import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = localSupabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Only log missing credentials in development
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  if (localSupabaseUrl && localSupabaseKey) {
    console.log('Using Supabase credentials from local storage.');
  } else {
    console.warn('Missing Supabase credentials. Using placeholder values for development. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
