const API_BASE_URL = 'https://api.lemonsqueezy.com/v1';

/**
 * Custom error class for Lemon Squeezy API errors
 */
export class LemonSqueezyError extends Error {
  constructor(status, statusText, errorData) {
    super(`Lemon Squeezy API Error: ${status} ${statusText}`);
    this.name = 'LemonSqueezyError';
    this.status = status;
    this.statusText = statusText;
    this.errorData = errorData;
  }
}

/**
 * Fetches products from Lemon Squeezy API.
 * 
 * @param {number} page - The page number to fetch (default: 1)
 * @param {number} perPage - Number of items per page (default: 10, max: 100)
 * @param {Object} [options] - Optional configuration
 * @param {number} [options.retries=3] - Number of retries for failed requests
 * @param {number} [options.timeout=10000] - Request timeout in milliseconds
 * @returns {Promise<Object>} Promise resolving to the API response containing products
 */
export async function getLemonSqueezyProducts(page = 1, perPage = 10, options = {}) {
  const { retries = 3, timeout = 10000 } = options;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error('Missing LEMONSQUEEZY_API_KEY environment variable');
  }

  // Input validation
  const safePage = Math.max(1, Math.floor(page));
  const safePerPage = Math.min(100, Math.max(1, Math.floor(perPage)));

  const endpoint = `${API_BASE_URL}/products`;
  const queryParams = new URLSearchParams({
    'page[number]': safePage.toString(),
    'page[size]': safePerPage.toString(),
  });
  const url = `${endpoint}?${queryParams.toString()}`;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        // Next.js caching options
        next: { revalidate: 3600 } 
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Don't retry on client errors (4xx), except 429 (Too Many Requests)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = await response.text();
          }
          throw new LemonSqueezyError(response.status, response.statusText, errorData);
        }
        
        // Throw to trigger retry for 5xx or 429
        throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      // If it's a LemonSqueezyError (4xx), don't retry, just throw
      if (error instanceof LemonSqueezyError) {
        throw error;
      }

      // If we have retries left, wait and retry
      if (attempt < retries) {
        // Exponential backoff: 1s, 2s, 4s...
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw new Error(`Failed to fetch Lemon Squeezy products after ${retries} retries: ${lastError.message}`);
}