export interface VotingPair {
  winner: number;
  loser: number;
  strength: number;
}

export interface TidemanResult {
  winner: string;
  lockedGraph: boolean[][];
  sortedPairs: Array<{ winner: string; loser: string; strength: number }>;
}

export function runTidemanElection(candidates: string[], ballots: string[][]): TidemanResult {
  const n = candidates.length;
  const candidateIndex = new Map<string, number>();
  candidates.forEach((c, idx) => candidateIndex.set(c, idx));

  // preferences[i][j] is the number of voters who prefer i over j
  const preferences: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (const ballot of ballots) {
    for (let i = 0; i < ballot.length; i++) {
      const idxI = candidateIndex.get(ballot[i]);
      if (idxI === undefined) continue;
      for (let j = i + 1; j < ballot.length; j++) {
        const idxJ = candidateIndex.get(ballot[j]);
        if (idxJ === undefined) continue;
        preferences[idxI][idxJ]++;
      }
    }
  }

  const pairs: VotingPair[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (preferences[i][j] > preferences[j][i]) {
        pairs.push({
          winner: i,
          loser: j,
          strength: preferences[i][j] - preferences[j][i]
        });
      }
    }
  }

  // Sort pairs in descending order of victory strength
  pairs.sort((a, b) => b.strength - a.strength);

  const locked: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

  function hasCycle(current: number, target: number): boolean {
    if (current === target) return true;
    for (let next = 0; next < n; next++) {
      if (locked[current][next]) {
        if (hasCycle(next, target)) return true;
      }
    }
    return false;
  }

  for (const pair of pairs) {
    // If locking this pair does not create a cycle back from loser to winner
    if (!hasCycle(pair.loser, pair.winner)) {
      locked[pair.winner][pair.loser] = true;
    }
  }

  // Source of the graph has no incoming true edges
  let winnerIndex = -1;
  for (let col = 0; col < n; col++) {
    let hasIncoming = false;
    for (let row = 0; row < n; row++) {
      if (locked[row][col]) {
        hasIncoming = true;
        break;
      }
    }
    if (!hasIncoming) {
      winnerIndex = col;
      break;
    }
  }

  if (winnerIndex === -1 && candidates.length > 0) {
    winnerIndex = 0;
  }

  return {
    winner: candidates[winnerIndex],
    lockedGraph: locked,
    sortedPairs: pairs.map(p => ({
      winner: candidates[p.winner],
      loser: candidates[p.loser],
      strength: p.strength
    }))
  };
}
