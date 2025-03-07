
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devMode, setDevMode] = useState(false);
  const { signUp, user } = useAuth();
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
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await signUp(email, password);
      
      // In real scenario, Supabase might send a confirmation email
      // For now, redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      console.error('Registration error:', err);
      // Don't set an error if it's a network error - the toast will handle it
      if (err.message !== 'Failed to fetch') {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show dev mode bypass option
  const handleDevBypass = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-card animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
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
            <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <AlertDescription className="text-xs">
                <strong>Development Mode</strong>: 
                {import.meta.env.VITE_SUPABASE_URL ? 
                  " Using Supabase URL: " + import.meta.env.VITE_SUPABASE_URL.substring(0, 20) + "..." :
                  " No Supabase URL configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
                }
                {import.meta.env.VITE_BYPASS_AUTH === 'true' && 
                  " Auth bypass is ENABLED."
                }
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
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
          
          {import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true' && (
            <Button 
              variant="outline" 
              className="w-full mt-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
              onClick={handleDevBypass}
            >
              Bypass Authentication (Dev Mode)
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
