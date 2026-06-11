export type CellCoord = [number, number];

export class LogicalSentence {
  public cells: Set<string>;
  public count: number;

  constructor(cells: Iterable<string>, count: number) {
    this.cells = new Set(cells);
    this.count = count;
  }

  public knownMines(): Set<string> {
    if (this.cells.size === this.count && this.count > 0) {
      return new Set(this.cells);
    }
    return new Set();
  }

  public knownSafes(): Set<string> {
    if (this.count === 0) {
      return new Set(this.cells);
    }
    return new Set();
  }

  public markMine(cell: string): void {
    if (this.cells.has(cell)) {
      this.cells.delete(cell);
      this.count -= 1;
    }
  }

  public markSafe(cell: string): void {
    if (this.cells.has(cell)) {
      this.cells.delete(cell);
    }
  }
}

export class MinesweeperAI {
  public height: number;
  public width: number;
  public movesMade: Set<string> = new Set();
  public mines: Set<string> = new Set();
  public safes: Set<string> = new Set();
  public knowledge: LogicalSentence[] = [];

  constructor(height: number = 8, width: number = 8) {
    this.height = height;
    this.width = width;
  }

  public markMine(cell: string): void {
    this.mines.add(cell);
    for (const sentence of this.knowledge) {
      sentence.markMine(cell);
    }
  }

  public markSafe(cell: string): void {
    this.safes.add(cell);
    for (const sentence of this.knowledge) {
      sentence.markSafe(cell);
    }
  }

  public addKnowledge(cell: CellCoord, count: number): void {
    const cellKey = `${cell[0]},${cell[1]}`;
    this.movesMade.add(cellKey);
    this.markSafe(cellKey);

    const neighbors: string[] = [];
    let adjustedCount = count;

    for (let r = Math.max(0, cell[0] - 1); r <= Math.min(this.height - 1, cell[0] + 1); r++) {
      for (let c = Math.max(0, cell[1] - 1); c <= Math.min(this.width - 1, cell[1] + 1); c++) {
        if (r === cell[0] && c === cell[1]) continue;
        const key = `${r},${c}`;
        if (this.mines.has(key)) {
          adjustedCount -= 1;
        } else if (!this.safes.has(key)) {
          neighbors.push(key);
        }
      }
    }

    if (neighbors.length > 0) {
      this.knowledge.push(new LogicalSentence(neighbors, adjustedCount));
    }

    // Run inference loop
    let changed = true;
    while (changed) {
      changed = false;

      // Clean empty sentences
      this.knowledge = this.knowledge.filter(s => s.cells.size > 0);

      // Extract newly discovered safes & mines
      const newSafes = new Set<string>();
      const newMines = new Set<string>();

      for (const s of this.knowledge) {
        for (const safe of s.knownSafes()) {
          if (!this.safes.has(safe)) newSafes.add(safe);
        }
        for (const mine of s.knownMines()) {
          if (!this.mines.has(mine)) newMines.add(mine);
        }
      }

      if (newSafes.size > 0 || newMines.size > 0) {
        changed = true;
        for (const safe of newSafes) this.markSafe(safe);
        for (const mine of newMines) this.markMine(mine);
      }

      // Subset inference: if s1 is subset of s2
      const newSentences: LogicalSentence[] = [];
      for (let i = 0; i < this.knowledge.length; i++) {
        for (let j = 0; j < this.knowledge.length; j++) {
          if (i === j) continue;
          const s1 = this.knowledge[i];
          const s2 = this.knowledge[j];

          if (s1.cells.size < s2.cells.size && [...s1.cells].every(c => s2.cells.has(c))) {
            const diffCells = [...s2.cells].filter(c => !s1.cells.has(c));
            const diffCount = s2.count - s1.count;
            if (diffCells.length > 0) {
              const candidate = new LogicalSentence(diffCells, diffCount);
              // Avoid duplicates
              const exists = this.knowledge.some(
                k => k.count === candidate.count && k.cells.size === candidate.cells.size && [...k.cells].every(c => candidate.cells.has(c))
              );
              if (!exists) {
                newSentences.push(candidate);
                changed = true;
              }
            }
          }
        }
      }

      if (newSentences.length > 0) {
        this.knowledge.push(...newSentences);
      }
    }
  }

  public makeSafeMove(): CellCoord | null {
    for (const key of this.safes) {
      if (!this.movesMade.has(key)) {
        const [r, c] = key.split(',').map(Number);
        return [r, c];
      }
    }
    return null;
  }

  public makeRandomMove(): CellCoord | null {
    const candidates: CellCoord[] = [];
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        const key = `${r},${c}`;
        if (!this.movesMade.has(key) && !this.mines.has(key)) {
          candidates.push([r, c]);
        }
      }
    }

    if (candidates.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }
}
