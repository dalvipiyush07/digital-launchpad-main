/**
 * Base URL for the admin API / file uploads.
 *
 * Resolution order:
 *   1. VITE_API_URL env variable (set in AWS Amplify Console, Vercel, etc.)
 *   2. Empty string when running in production (API is proxied by the CDN / Amplify rewrites)
 *   3. http://localhost:8081 when running locally without the env variable
 */
export const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? '' : 'http://localhost:8081');
