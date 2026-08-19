export interface HashBucketNode {
  word: string;
  next: HashBucketNode | null;
}

export class HashDictionary {
  private readonly numBuckets: number;
  private table: Array<HashBucketNode | null>;
  private totalWords: number = 0;

  constructor(numBuckets: number = 65536) {
    this.numBuckets = numBuckets;
    this.table = Array(numBuckets).fill(null);
  }

  // djb2 hash function
  private hash(word: string): number {
    let hash = 5381;
    const lower = word.toLowerCase();
    for (let i = 0; i < lower.length; i++) {
      hash = ((hash << 5) + hash) + lower.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % this.numBuckets;
  }

  public load(words: string[]): boolean {
    for (const w of words) {
      const clean = w.trim().toLowerCase();
      if (!clean) continue;
      const index = this.hash(clean);

      const node: HashBucketNode = {
        word: clean,
        next: this.table[index]
      };
      this.table[index] = node;
      this.totalWords++;
    }
    return true;
  }

  public check(word: string): boolean {
    const clean = word.trim().toLowerCase();
    if (!clean) return false;
    const index = this.hash(clean);

    let cursor = this.table[index];
    while (cursor !== null) {
      if (cursor.word === clean) {
        return true;
      }
      cursor = cursor.next;
    }
    return false;
  }

  public size(): number {
    return this.totalWords;
  }

  public unload(): boolean {
    this.table = Array(this.numBuckets).fill(null);
    this.totalWords = 0;
    return true;
  }

  public getMetrics(): { totalWords: number; filledBuckets: number; maxChainLength: number; loadFactor: number } {
    let filled = 0;
    let maxChain = 0;
    for (let i = 0; i < this.numBuckets; i++) {
      let chainLen = 0;
      let cursor = this.table[i];
      while (cursor !== null) {
        chainLen++;
        cursor = cursor.next;
      }
      if (chainLen > 0) filled++;
      if (chainLen > maxChain) maxChain = chainLen;
    }

    return {
      totalWords: this.totalWords,
      filledBuckets: filled,
      maxChainLength: maxChain,
      loadFactor: this.totalWords / this.numBuckets
    };
  }
}
