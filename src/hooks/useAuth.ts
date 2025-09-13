// Deleza Joias - Authentication Hook
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
      // First check if profile exists
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // If profile doesn't exist, create it
      if (profileError && profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          })
          .select()
          .single();

        if (createError) throw createError;
        profile = newProfile;
      } else if (profileError) {
        throw profileError;
      }

      const userProfile: UserProfile = {
        id: profile.id,
        full_name: profile.full_name,
        email: user.email || '',
        is_admin: false, // For now, all users are regular users
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      };

      setAuthState({
        user: userProfile,
        isLoading: false,
        isAdmin: userProfile.is_admin,
      });
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      // Fallback to basic user data
      setAuthState({
        user: {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
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