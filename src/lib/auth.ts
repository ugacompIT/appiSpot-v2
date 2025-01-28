import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from './supabase';
import toast from 'react-hot-toast';

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'host' | 'guest';
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  role: 'host' | 'guest';
}

export const login = async ({ email, password, role }: LoginCredentials): Promise<void> => {
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    // Verify user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (profileError) {
      await supabase.auth.signOut();
      throw new Error('Failed to verify user role');
    }

    if (profile.role !== role) {
      await supabase.auth.signOut();
      throw new Error(`Invalid role. Please sign in as a ${profile.role}.`);
    }

    toast.success('Welcome back!');
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const register = async ({ email, password, fullName, role }: RegisterCredentials): Promise<void> => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) throw error;
    toast.success('Registration successful! Please sign in.');
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};