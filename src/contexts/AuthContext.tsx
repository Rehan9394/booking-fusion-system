
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error.message);
          // Don't throw here, just handle gracefully
        }
        
        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
      } catch (error) {
        console.error('Failed to fetch auth session:', error);
        // Still mark as not loading even if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      // If we're in development and VITE_BYPASS_AUTH is true, show success even on error
      if (error) {
        if (import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true') {
          toast({
            title: "Development Mode",
            description: "Auth bypass enabled. Proceeding as if signed in.",
          });
          return;
        }
        throw error;
      }
      
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      // Handle network errors specially
      if (error.message === 'Failed to fetch') {
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
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      
      // If we're in development and VITE_BYPASS_AUTH is true, show success even on error
      if (error) {
        if (import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true') {
          toast({
            title: "Development Mode",
            description: "Auth bypass enabled. Account created successfully.",
          });
          return;
        }
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Check your email for the confirmation link.",
      });
    } catch (error: any) {
      // Handle network errors specially
      if (error.message === 'Failed to fetch') {
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
    signIn,
    signUp,
    signOut,
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
