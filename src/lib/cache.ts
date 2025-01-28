import { LRUCache } from 'lru-cache';

// Configure cache options
const options = {
  // Maximum number of items to store in cache
  max: 500,

  // Maximum age of items in cache (in milliseconds)
  // 15 minutes by default for better performance
  ttl: 1000 * 60 * 15,

  // Function to calculate size of items
  sizeCalculation: (value: any, key: string) => {
    return 1;
  },

  // Maximum cache size in custom units
  maxSize: 5000,

  // Enable stale-while-revalidate behavior
  allowStale: true,
  updateAgeOnGet: true,
  updateAgeOnHas: true,

  // Cache fetch function
  fetchMethod: async (
    key: string,
    staleValue: any,
    { signal, options }: any
  ) => {
    try {
      return await options.fetchMethod();
    } catch (error) {
      if (staleValue) return staleValue;
      throw error;
    }
  }
};

// Create cache instance
const cache = new LRUCache(options);

export interface CacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  fetchMethod?: () => Promise<any>;
}

export const cacheGet = async <T>(key: string): Promise<T | undefined> => {
  return cache.get(key) as T;
};

export const cacheSet = async <T>(
  key: string,
  value: T,
  options?: CacheOptions
): Promise<void> => {
  cache.set(key, value, { 
    ttl: options?.ttl,
    fetchMethod: options?.fetchMethod
  });
};

export const cacheDelete = async (key: string): Promise<void> => {
  cache.delete(key);
};

export const cacheClear = async (): Promise<void> => {
  cache.clear();
};

// Enhanced withCache function with stale-while-revalidate
export const withCache = async <T>(
  key: string,
  queryFn: () => Promise<T>,
  options?: CacheOptions
): Promise<T> => {
  const cached = await cacheGet<T>(key);

  // If we have a cached value and staleWhileRevalidate is enabled
  if (cached !== undefined && options?.staleWhileRevalidate) {
    // Return cached value immediately
    // And trigger background refresh
    cacheSet(key, queryFn(), {
      ttl: options?.ttl,
      fetchMethod: queryFn
    });
    return cached;
  }

  // If not in cache or staleWhileRevalidate is disabled
  if (cached === undefined) {
    const result = await queryFn();
    await cacheSet(key, result, {
      ttl: options?.ttl,
      fetchMethod: queryFn
    });
    return result;
  }

  return cached;
};