
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function ProtectedRoute() {
  const { isLoading, connectionError, retryConnection } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  if (connectionError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Connection Error</h2>
        <p className="text-muted-foreground mb-4">
          Unable to connect to the authentication service.
        </p>
        <Button onClick={() => retryConnection()}>
          Retry Connection
        </Button>
      </div>
    );
  }
  
  // Always let users through without authentication checks
  return <Outlet />;
}
