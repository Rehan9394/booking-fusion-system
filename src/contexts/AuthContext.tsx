
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  connectionError: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  retryConnection: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();

  // Check if we're in dev mode with bypass
  const isDevBypass = import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true';

  const retryConnection = async (): Promise<boolean> => {
    setIsLoading(true);
    setConnectionError(false);
    
    try {
      const result = await testSupabaseConnection();
      
      if (!result.success) {
        setConnectionError(true);
        return false;
      }
      
      // Re-fetch session after successful connection test
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setConnectionError(true);
        return false;
      }
      
      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
      return true;
    } catch (error) {
      console.error('Error retrying connection:', error);
      setConnectionError(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Get initial session
        if (isDevBypass) {
          console.log('Auth bypass enabled in development mode.');
          setIsLoading(false);
          return;
        }
        
        // Test connection before fetching session
        const connectionTest = await testSupabaseConnection();
        if (!connectionTest.success) {
          console.error('Initial connection test failed:', connectionTest.message || 'Unknown error');
          setConnectionError(true);
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error.message);
          if (error.message === 'Failed to fetch') {
            setConnectionError(true);
          }
        }
        
        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
      } catch (error: any) {
        console.error('Failed to fetch auth session:', error);
        if (error.message === 'Failed to fetch') {
          setConnectionError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Skip auth listener in dev bypass mode
    if (isDevBypass) return;

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [isDevBypass]);

  const signIn = async (email: string, password: string) => {
    setConnectionError(false);
    try {
      // In development mode with bypass enabled, simulate successful auth
      if (isDevBypass) {
        toast({
          title: "Development Mode",
          description: "Auth bypass enabled. Proceeding as if signed in.",
        });
        return;
      }

      // Test connection before attempting sign in
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        setConnectionError(true);
        toast({
          title: "Connection Error",
          description: connectionTest.message || "Could not connect to authentication server. Please check your internet connection or try again later.",
          variant: "destructive",
        });
        throw new Error(connectionTest.message || "Connection failed");
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      // Handle network errors specially
      if (error.message === 'Failed to fetch') {
        setConnectionError(true);
        toast({
          title: "Network Error",
          description: "Could not connect to authentication server. Please check your internet connection or try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setConnectionError(false);
    try {
      // In development mode with bypass enabled, simulate successful auth
      if (isDevBypass) {
        toast({
          title: "Development Mode",
          description: "Auth bypass enabled. Account created successfully.",
        });
        return;
      }
      
      // Test connection before attempting sign up
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        setConnectionError(true);
        toast({
          title: "Connection Error",
          description: connectionTest.message || "Could not connect to authentication server. Please check your internet connection or try again later.",
          variant: "destructive",
        });
        throw new Error(connectionTest.message || "Connection failed");
      }
      
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Check your email for the confirmation link.",
      });
    } catch (error: any) {
      // Handle network errors specially
      if (error.message === 'Failed to fetch') {
        setConnectionError(true);
        toast({
          title: "Network Error",
          description: "Could not connect to authentication server. Please check your internet connection or try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // In development mode with bypass enabled, simulate sign out
      if (isDevBypass) {
        toast({
          title: "Development Mode",
          description: "Auth bypass enabled. Signed out successfully.",
        });
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    isLoading,
    connectionError,
    signIn,
    signUp,
    signOut,
    retryConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
