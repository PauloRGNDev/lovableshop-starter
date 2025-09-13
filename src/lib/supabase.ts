// Deleza Joias - Supabase Configuration
// TODO: Replace with actual Supabase credentials in .env.local

import { createClient } from '@supabase/supabase-js';

// Placeholder URLs - replace with actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'COLOQUE_AQUI';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'COLOQUE_AQUI';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return supabaseUrl !== 'COLOQUE_AQUI' && supabaseAnonKey !== 'COLOQUE_AQUI';
};

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  SHOPPING_CART: 'shopping_cart',
} as const;