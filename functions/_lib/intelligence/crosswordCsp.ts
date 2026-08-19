export interface Variable {
  id: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
  length: number;
}

export type Overlap = [number, number] | null; // [indexInVar1, indexInVar2]

export class CrosswordCSP {
  public variables: Variable[];
  public words: Set<string>;
  public domains: Map<string, Set<string>>;
  public overlaps: Map<string, Overlap>; // key: `${var1.id}:${var2.id}`

  constructor(variables: Variable[], words: string[]) {
    this.variables = variables;
    this.words = new Set(words.map(w => w.toUpperCase()));
    this.domains = new Map();
    this.overlaps = new Map();

    // Initialize domains
    for (const v of this.variables) {
      const validWords = new Set<string>();
      for (const w of this.words) {
        if (w.length === v.length) {
          validWords.add(w);
        }
      }
      this.domains.set(v.id, validWords);
    }

    // Compute overlaps
    for (const v1 of this.variables) {
      for (const v2 of this.variables) {
        if (v1.id === v2.id) continue;
        const overlap = this.computeOverlap(v1, v2);
        this.overlaps.set(`${v1.id}:${v2.id}`, overlap);
      }
    }
  }

  private computeOverlap(v1: Variable, v2: Variable): Overlap {
    if (v1.direction === v2.direction) return null;

    // One is across, one is down
    const across = v1.direction === 'across' ? v1 : v2;
    const down = v1.direction === 'down' ? v1 : v2;

    const acrossCols = [across.col, across.col + across.length - 1];
    const downRows = [down.row, down.row + down.length - 1];

    if (
      down.col >= acrossCols[0] &&
      down.col <= acrossCols[1] &&
      across.row >= downRows[0] &&
      across.row <= downRows[1]
    ) {
      const idxAcross = down.col - across.col;
      const idxDown = across.row - down.row;
      return v1.direction === 'across' ? [idxAcross, idxDown] : [idxDown, idxAcross];
    }

    return null;
  }

  public revise(xId: string, yId: string): boolean {
    let revised = false;
    const overlap = this.overlaps.get(`${xId}:${yId}`);
    if (!overlap) return false;

    const [idxX, idxY] = overlap;
    const xDomain = this.domains.get(xId)!;
    const yDomain = this.domains.get(yId)!;

    const toRemove: string[] = [];
    for (const xWord of xDomain) {
      const hasMatch = Array.from(yDomain).some(yWord => yWord.charAt(idxY) === xWord.charAt(idxX));
      if (!hasMatch) {
        toRemove.push(xWord);
        revised = true;
      }
    }

    for (const word of toRemove) {
      xDomain.delete(word);
    }
    return revised;
  }

  public ac3(): boolean {
    const queue: Array<[string, string]> = [];
    for (const v1 of this.variables) {
      for (const v2 of this.variables) {
        if (v1.id !== v2.id && this.overlaps.get(`${v1.id}:${v2.id}`)) {
          queue.push([v1.id, v2.id]);
        }
      }
    }

    while (queue.length > 0) {
      const [xId, yId] = queue.shift()!;
      if (this.revise(xId, yId)) {
        if (this.domains.get(xId)!.size === 0) {
          return false;
        }
        for (const z of this.variables) {
          if (z.id !== xId && z.id !== yId && this.overlaps.get(`${z.id}:${xId}`)) {
            queue.push([z.id, xId]);
          }
        }
      }
    }

    return true;
  }

  public solve(): Map<string, string> | null {
    if (!this.ac3()) return null;
    return this.backtrack(new Map());
  }

  private backtrack(assignment: Map<string, string>): Map<string, string> | null {
    if (assignment.size === this.variables.length) {
      return assignment;
    }

    // Minimum Remaining Values (MRV)
    let selectedVar: Variable | null = null;
    let minDomainSize = Infinity;

    for (const v of this.variables) {
      if (!assignment.has(v.id)) {
        const domainSize = this.domains.get(v.id)!.size;
        if (domainSize < minDomainSize) {
          minDomainSize = domainSize;
          selectedVar = v;
        }
      }
    }

    if (!selectedVar) return null;

    const domain = this.domains.get(selectedVar.id)!;
    for (const val of domain) {
      // Check distinct word requirement
      if (Array.from(assignment.values()).includes(val)) continue;

      let consistent = true;
      for (const [otherId, otherVal] of assignment.entries()) {
        const overlap = this.overlaps.get(`${selectedVar.id}:${otherId}`);
        if (overlap) {
          const [idxSel, idxOther] = overlap;
          if (val.charAt(idxSel) !== otherVal.charAt(idxOther)) {
            consistent = false;
            break;
          }
        }
      }

      if (consistent) {
        assignment.set(selectedVar.id, val);
        const result = this.backtrack(assignment);
        if (result !== null) return result;
        assignment.delete(selectedVar.id);
      }
    }

    return null;
  }
}
