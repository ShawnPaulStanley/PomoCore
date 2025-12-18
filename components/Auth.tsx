import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, User, Edit2, Check, X, Eye, EyeOff } from 'lucide-react';
import { supabase, signInWithGoogle, signOut } from '../services/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Button } from './Button';

export const Auth: React.FC = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [showName, setShowName] = useState(true);

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

    // Load preferences
    const savedShowName = localStorage.getItem('showDisplayName');
    if (savedShowName !== null) {
      setShowName(savedShowName === 'true');
    }

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const savedName = localStorage.getItem(`displayName_${user.id}`);
      setDisplayName(savedName || user.user_metadata?.full_name || 'User');
    }
  }, [user]);

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

  const handleSaveDisplayName = () => {
    if (user && displayName.trim()) {
      localStorage.setItem(`displayName_${user.id}`, displayName.trim());
      setIsEditingName(false);
    }
  };

  const toggleShowName = () => {
    const newValue = !showName;
    setShowName(newValue);
    localStorage.setItem('showDisplayName', String(newValue));
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
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt={displayName} 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User size={16} className="text-gray-400" />
          )}
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-32 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-pastel-peach"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveDisplayName();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
              />
              <button onClick={handleSaveDisplayName} className="p-1 hover:text-green-500">
                <Check size={14} />
              </button>
              <button onClick={() => setIsEditingName(false)} className="p-1 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {showName && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {displayName}
                </span>
              )}
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 text-gray-400 hover:text-pastel-peach transition-colors"
                title="Edit display name"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={toggleShowName}
                className="p-1 text-gray-400 hover:text-pastel-peach transition-colors"
                title={showName ? 'Hide name' : 'Show name'}
              >
                {showName ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          )}
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
