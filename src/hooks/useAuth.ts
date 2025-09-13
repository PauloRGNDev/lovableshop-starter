// Deleza Joias - Authentication Hook
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, TABLES } from '@/lib/supabase';
import { UserProfile, AuthState } from '@/types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAdmin: false,
        });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAdmin: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from(TABLES.PROFILES)
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading user profile:', error);
      }

      const userProfile: UserProfile = profile || {
        id: user.id,
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setAuthState({
        user: userProfile,
        isLoading: false,
        isAdmin: userProfile.is_admin,
      });
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      setAuthState({
        user: {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
          is_admin: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        isLoading: false,
        isAdmin: false,
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    ...authState,
    signOut,
  };
};