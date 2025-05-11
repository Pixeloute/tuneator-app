type RateLimitConfig = { windowMs: number; max: number };

export class RateLimitService {
  private requests: Map<string, { count: number; windowStart: number }> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { windowMs: 60000, max: 100 }) {
    this.config = config;
  }

  check(key: string): boolean {
    const now = Date.now();
    const entry = this.requests.get(key);
    if (!entry || now - entry.windowStart > this.config.windowMs) {
      this.requests.set(key, { count: 1, windowStart: now });
      return true;
    }
    if (entry.count < this.config.max) {
      entry.count++;
      return true;
    }
    return false;
  }
} 