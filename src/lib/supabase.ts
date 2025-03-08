
import { createClient } from '@supabase/supabase-js';

// Check if there are credentials stored in localStorage (for development)
const getLocalStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error accessing localStorage for ${key}:`, error);
    return null;
  }
};

// Use local storage values first (for development), then environment variables, then defaults
const localSupabaseUrl = getLocalStorageItem('supabase_url');
const localSupabaseKey = getLocalStorageItem('supabase_key');

const supabaseUrl = localSupabaseUrl || import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = localSupabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Only log missing credentials in development
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  if (localSupabaseUrl && localSupabaseKey) {
    console.log('Using Supabase credentials from local storage.');
  } else {
    console.warn('Missing Supabase credentials. Using placeholder values for development. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }
}

// Create Supabase client with improved error handling and connection options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, { 
        ...options, 
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });
    },
  },
});

// Function to validate that the Supabase URL is properly formatted
export const isValidSupabaseUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.includes('supabase.co');
  } catch (e) {
    return false;
  }
};

// Simple function to test the Supabase connection with improved error reporting
export const testSupabaseConnection = async () => {
  try {
    // First check if we have valid URL
    if (!isValidSupabaseUrl(supabaseUrl)) {
      return { 
        success: false, 
        error: new Error('Invalid Supabase URL format. Please provide a valid URL (https://your-project.supabase.co)') 
      };
    }
    
    // Then attempt to connect
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection test failed with error:', error.message);
      return { 
        success: false, 
        error,
        message: error.message === 'Failed to fetch' 
          ? 'Network error: Cannot connect to Supabase. Please check your internet connection and Supabase credentials.'
          : error.message
      };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Supabase connection test failed with exception:', error);
    return { 
      success: false, 
      error,
      message: error.message === 'Failed to fetch' 
        ? 'Network error: Cannot connect to Supabase. Please check your internet connection and Supabase credentials.'
        : error.message 
    };
  }
};
