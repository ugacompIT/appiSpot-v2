import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { withCache } from './cache';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Configure with performance optimizations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
  },
});

// Cache configuration
const CACHE_TTL = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 15, // 15 minutes
  LONG: 1000 * 60 * 60, // 1 hour
};

// Cached query helper
export const cachedQuery = async <T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl = CACHE_TTL.SHORT
): Promise<T> => {
  return withCache(key, queryFn, { ttl });
};