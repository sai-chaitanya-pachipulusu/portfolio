// Improve cache with TTL and compression
export class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 24 * 60 * 60 * 1000; // 24 hours
    this.maxSize = 1000; // Maximum cache entries
    
    // Cleanup expired entries every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  set(key, value, ttl = null) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, {
      data: value,
      expiry: expiry,
      created: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired entries`);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, item]) => ({
        key,
        created: new Date(item.created),
        expiry: new Date(item.expiry),
        size: JSON.stringify(item.data).length
      }))
    };
  }
}

let cacheInstance = null;

export function getCacheService() {
  if (!cacheInstance) {
    cacheInstance = new CacheService();
  }
  return cacheInstance;
}

// Simple cache object for backward compatibility
const cache = {};

/**
 * Get cached response for a question
 * @param {string} question - The user's question
 * @returns {Object|null} - Cached response object with text and sources, or null if not found
 */
export function getCachedResponse(question) {
  const normalizedQuestion = question.toLowerCase().trim();
  
  // Check if we have a cached response
  if (cache[normalizedQuestion]) {
    console.log("Cache hit for:", normalizedQuestion);
    return cache[normalizedQuestion];
  }
  return null;
}

/**
 * Cache a response for future use
 * @param {string} question - The user's question
 * @param {Object} response - Response object with text and sources
 */
export function setCachedResponse(question, response) {
  const normalizedQuestion = question.toLowerCase().trim();
  cache[normalizedQuestion] = response;
  
  // Trim cache if it gets too large (simple LRU implementation)
  const MAX_CACHE_SIZE = 100;
  const keys = Object.keys(cache);
  
  if (keys.length > MAX_CACHE_SIZE) {
    // Remove oldest entries
    const oldestKeys = keys.slice(0, keys.length - MAX_CACHE_SIZE);
    for (const key of oldestKeys) {
      delete cache[key];
    }
  }
}

/**
 * Clear the response cache
 */
export function clearCache() {
  for (const key in cache) {
    delete cache[key];
  }
}

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
export function getCacheStats() {
  return {
    size: Object.keys(cache).length,
    keys: Object.keys(cache)
  };
}

export default getCacheService();