import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loading: true,

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ isAuthenticated: !!session, loading: false });
    } catch (error) {
      console.error('Error checking auth status:', error);
      set({ isAuthenticated: false, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ isAuthenticated: true });
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error('Invalid credentials');
      console.error('Error logging in:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ isAuthenticated: false });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      console.error('Error logging out:', error);
    }
  },
}));