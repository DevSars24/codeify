import { createHash } from "crypto";

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class AICache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxEntries: number;
  private defaultTTLMs: number;

  constructor(maxEntries = 500, defaultTTLMinutes = 60) {
    this.maxEntries = maxEntries;
    this.defaultTTLMs = defaultTTLMinutes * 60 * 1000;
  }

  /**
   * Generates a deterministic SHA-256 hash for AI inputs
   */
  public generateKey(prefix: string, payload: any): string {
    const serialized = typeof payload === "string" ? payload : JSON.stringify(payload);
    const hash = createHash("sha256").update(serialized).digest("hex");
    return `${prefix}:${hash}`;
  }

  /**
   * Retrieves item from LRU Cache if valid and non-expired
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data as T;
  }

  /**
   * Stores item in LRU Cache with TTL
   */
  public set<T>(key: string, data: T, ttlMs = this.defaultTTLMs): void {
    if (this.cache.size >= this.maxEntries) {
      // Evict oldest entry (LRU)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }

  /**
   * Clears expired entries manually
   */
  public purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Cache Stats for performance metrics
   */
  public size(): number {
    return this.cache.size;
  }
}

// Global Singleton Instance across requests
export const aiCache = new AICache(500, 60);
