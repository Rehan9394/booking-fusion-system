
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devMode, setDevMode] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Check if in development mode with bypass enabled
  useEffect(() => {
    setDevMode(import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true');
  }, []);

  // If user is already logged in or we're in dev mode, redirect to home
  useEffect(() => {
    if (user || devMode) {
      navigate('/');
    }
  }, [user, devMode, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      // Don't set an error if it's a network error - the toast will handle it
      if (err.message !== 'Failed to fetch') {
        setError(err.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show dev mode bypass option
  const handleDevBypass = () => {
    navigate('/');
  };

  const isMissingCredentials = import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-card animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Hotel Management System</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {import.meta.env.DEV && (
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertTitle>Development Mode</AlertTitle>
              <AlertDescription>
                {isMissingCredentials ? (
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Missing Supabase credentials.</span> Please configure:
                    </p>
                    <ul className="list-disc pl-5 text-xs space-y-1">
                      <li>VITE_SUPABASE_URL</li>
                      <li>VITE_SUPABASE_ANON_KEY</li>
                    </ul>
                    <p className="text-xs pt-1">
                      Or enable auth bypass by setting <span className="font-mono bg-blue-100 px-1 rounded">VITE_BYPASS_AUTH=true</span>
                    </p>
                  </div>
                ) : (
                  <p>Using Supabase URL: {import.meta.env.VITE_SUPABASE_URL.substring(0, 20)}...</p>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          {isMissingCredentials && (
            <div className="pt-2">
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Network Error</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Cannot connect to authentication server.</p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                    onClick={handleDevBypass}
                    size="lg"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Bypass Authentication (Dev Mode)
                  </Button>
                  <p className="text-xs text-amber-700 text-center">
                    For development only. This will simulate being logged in.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
