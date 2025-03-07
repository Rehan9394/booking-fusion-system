
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Info, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devMode, setDevMode] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [editingCredentials, setEditingCredentials] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [credentialStatus, setCredentialStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [testingConnection, setTestingConnection] = useState(false);

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

  const testSupabaseConnection = async () => {
    setTestingConnection(true);
    try {
      // Create a temporary Supabase client with the entered credentials
      const tempSupabase = await import('@supabase/supabase-js')
        .then(module => module.createClient(supabaseUrl, supabaseKey));

      // Try to fetch something simple to test the connection
      const { error } = await tempSupabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      setCredentialStatus('success');
      
      // Store the values in local storage so they can be used on refresh
      localStorage.setItem('supabase_url', supabaseUrl);
      localStorage.setItem('supabase_key', supabaseKey);
      
      // Refresh the page to apply the new credentials
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      setCredentialStatus('error');
    } finally {
      setTestingConnection(false);
    }
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2" 
                      onClick={() => setEditingCredentials(true)}
                    >
                      Configure Supabase Credentials
                    </Button>
                  </div>
                ) : (
                  <p>Using Supabase URL: {import.meta.env.VITE_SUPABASE_URL.substring(0, 20)}...</p>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {editingCredentials ? (
            <div className="space-y-4 border rounded-md p-4 bg-slate-50">
              <h3 className="font-medium">Configure Supabase Credentials</h3>
              <div className="space-y-2">
                <Label htmlFor="supabaseUrl">Supabase URL</Label>
                <Input 
                  id="supabaseUrl" 
                  type="text" 
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
                <Input 
                  id="supabaseKey" 
                  type="text" 
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="your-anon-key"
                />
              </div>
              
              <div className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingCredentials(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  onClick={testSupabaseConnection}
                  disabled={!supabaseUrl || !supabaseKey || testingConnection}
                  className="flex-1"
                >
                  {testingConnection ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : credentialStatus === 'success' ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Connected!
                    </>
                  ) : (
                    'Test & Save'
                  )}
                </Button>
              </div>
              
              {credentialStatus === 'error' && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to connect to Supabase. Please check your credentials.
                  </AlertDescription>
                </Alert>
              )}
              
              {credentialStatus === 'success' && (
                <Alert variant="default" className="mt-2 bg-green-50 border-green-200 text-green-800">
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Successfully connected to Supabase! Reloading page...
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-xs text-muted-foreground">
                Note: These credentials will be stored in your browser's local storage for development purposes.
              </p>
            </div>
          ) : (
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
          )}
          
          {isMissingCredentials && !editingCredentials && (
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
