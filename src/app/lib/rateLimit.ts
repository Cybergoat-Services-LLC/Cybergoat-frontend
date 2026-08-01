import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Fixed-window IP rate limiter backed by Redis, so the limit is actually
// shared across serverless instances instead of each instance keeping its
// own in-memory counter that resets on cold start.
export async function isRateLimited(
  namespace: string,
  ip: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const key = `cybergoat:${namespace}_rate_limit:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }
  return count > maxRequests;
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}
