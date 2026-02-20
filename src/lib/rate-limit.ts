// Simple in-memory rate limiter
const rateLimitMap = new Map<string, number>();

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 5;

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_SIZE_IN_SECONDS * 1000;

  // Clean up old entries
  // (In a real app, use Redis or similar with TTL)

  const requestTimestamps = rateLimitMap.get(ip) || 0;

  if (requestTimestamps > now) {
      return false;
  }

  // Set next allowed time
  rateLimitMap.set(ip, now + (1000 * 2)); // 2 seconds cooldown minimum between posts

  return true;
}
