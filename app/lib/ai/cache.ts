import { createHash } from "crypto";

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class AICache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private inFlightMap = new Map<string, Promise<unknown>>();
  private maxEntries: number;
  private defaultTTLMs: number;
  public hits = 0;
  public misses = 0;

  constructor(maxEntries = 1000, defaultTTLMinutes = 120) {
    this.maxEntries = maxEntries;
    this.defaultTTLMs = defaultTTLMinutes * 60 * 1000;
  }

  /**
   * Generates a deterministic SHA-256 hash
   */
  public hash(payload: unknown): string {
    const serialized = typeof payload === "string" ? payload : JSON.stringify(payload);
    return createHash("sha256").update(serialized).digest("hex");
  }

  public generateKey(prefix: string, payload: unknown): string {
    return `${prefix}:${this.hash(payload)}`;
  }

  public buildSimulateKey(userId: string, code: string, language: string, input: string, model: string): string {
    return [
      "sim_v1",
      userId,
      this.hash(code.trim()),
      language.toLowerCase(),
      this.hash((input || "").trim()),
      model,
    ].join(":");
  }

  public buildAssessKey(userId: string, code: string, language: string, problemId: number | string, model: string): string {
    return [
      "assess_v1",
      userId,
      this.hash(code.trim()),
      language.toLowerCase(),
      String(problemId),
      model,
    ].join(":");
  }

  public buildMentorKey(userId: string, code: string, language: string, assessmentSummary: string, model: string): string {
    return [
      "mentor_v1",
      userId,
      this.hash(code.trim()),
      language.toLowerCase(),
      this.hash((assessmentSummary || "").trim()),
      model,
    ].join(":");
  }

  /**
   * Deduplicates simultaneous identical requests from rapid clicking
   */
  public async deduplicate<T>(key: string, factory: () => Promise<T>): Promise<T> {
    if (this.inFlightMap.has(key)) {
      return (await this.inFlightMap.get(key)) as T;
    }

    const promise = factory().finally(() => {
      this.inFlightMap.delete(key);
    });

    this.inFlightMap.set(key, promise as Promise<unknown>);
    return await promise;
  }

  /**
   * Retrieves item from Cache if valid
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return entry.data as T;
  }

  /**
   * Stores item in LRU Cache with TTL
   */
  public set<T>(key: string, data: T, ttlMs = this.defaultTTLMs): void {
    if (this.cache.size >= this.maxEntries) {
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

  public purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const aiCache = new AICache();
