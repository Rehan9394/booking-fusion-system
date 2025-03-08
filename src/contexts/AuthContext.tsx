
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  email: string;
};

type Session = {
  user: User;
};

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
      // Simulate successful connection
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return true;
    } catch (error) {
      console.error('Error retrying connection:', error);
      setConnectionError(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Simulate loading
        setTimeout(() => {
          // Create a mock user for development
          if (isDevBypass || true) { // Always use mock user
            const mockUser = {
              id: 'mock-user-id',
              email: 'user@example.com',
            };
            
            const mockSession = {
              user: mockUser
            };
            
            setUser(mockUser);
            setSession(mockSession);
            console.log('Using mock user in development mode');
          }
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch auth session:', error);
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [isDevBypass]);

  const signIn = async (email: string, password: string) => {
    setConnectionError(false);
    setIsLoading(true);
    
    try {
      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 'mock-user-id',
        email: email,
      };
      
      const mockSession = {
        user: mockUser
      };
      
      setUser(mockUser);
      setSession(mockSession);
      
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setConnectionError(false);
    setIsLoading(true);
    
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Account created successfully.",
      });
      
      // Auto sign in after registration
      const mockUser = {
        id: 'mock-user-id',
        email: email,
      };
      
      const mockSession = {
        user: mockUser
      };
      
      setUser(mockUser);
      setSession(mockSession);
      
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      // Simulate sign out process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
