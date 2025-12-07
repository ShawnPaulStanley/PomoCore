import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { supabase, signInWithGoogle, signOut } from '../services/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Button } from './Button';

export const Auth: React.FC = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      console.error('Error signing in:', error.message);
      alert('Failed to sign in. Please try again.');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata.full_name || 'User'} 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User size={16} className="text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            {user.user_metadata?.full_name || 'User'}
          </span>
        </div>
        <Button 
          onClick={handleSignOut} 
          variant="ghost" 
          size="sm"
          className="text-gray-500 hover:text-red-500"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleSignIn} 
      size="sm"
      className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <LogIn size={16} />
      Sign in with Google
    </Button>
  );
};
