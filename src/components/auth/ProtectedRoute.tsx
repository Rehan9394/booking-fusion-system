
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function ProtectedRoute() {
  const { user, isLoading, connectionError, retryConnection } = useAuth();
  
  // In development, we'll provide a way to bypass authentication
  const bypassAuth = import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true';
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Handle connection errors
  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="space-y-4">
              <p>Could not connect to authentication server. Please check your internet connection or try again later.</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={async () => {
                  const success = await retryConnection();
                  if (success && !user && !bypassAuth) {
                    // If reconnection is successful but user is not logged in
                    window.location.href = '/login';
                  }
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }
  
  if (!user && !bypassAuth) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}
