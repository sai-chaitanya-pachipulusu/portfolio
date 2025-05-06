// Simple in-memory cache for faster responses
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