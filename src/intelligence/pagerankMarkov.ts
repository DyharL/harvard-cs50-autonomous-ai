export type Corpus = Record<string, string[]>;

export function computeTransitionModel(
  corpus: Corpus,
  currentPage: string,
  dampingFactor: number = 0.85
): Record<string, number> {
  const pages = Object.keys(corpus);
  const n = pages.length;
  const probabilities: Record<string, number> = {};

  const outgoing = corpus[currentPage] || [];
  if (outgoing.length === 0) {
    // If a page has no outgoing links, equal probability across all pages
    const equalProb = 1 / n;
    for (const p of pages) probabilities[p] = equalProb;
    return probabilities;
  }

  const randomJumpProb = (1 - dampingFactor) / n;
  for (const p of pages) {
    probabilities[p] = randomJumpProb;
  }

  const linkProb = dampingFactor / outgoing.length;
  for (const target of outgoing) {
    probabilities[target] += linkProb;
  }

  return probabilities;
}

export function samplePageRank(
  corpus: Corpus,
  dampingFactor: number = 0.85,
  samplesCount: number = 10000
): Record<string, number> {
  const pages = Object.keys(corpus);
  const pageVisits: Record<string, number> = {};
  for (const p of pages) pageVisits[p] = 0;

  // First sample chosen at random
  let current = pages[Math.floor(Math.random() * pages.length)];
  pageVisits[current]++;

  for (let i = 1; i < samplesCount; i++) {
    const model = computeTransitionModel(corpus, current, dampingFactor);
    const rand = Math.random();
    let cumulative = 0;
    for (const page of pages) {
      cumulative += model[page];
      if (rand <= cumulative) {
        current = page;
        break;
      }
    }
    pageVisits[current]++;
  }

  const distribution: Record<string, number> = {};
  for (const p of pages) {
    distribution[p] = Math.round((pageVisits[p] / samplesCount) * 10000) / 10000;
  }
  return distribution;
}

export function iteratePageRank(
  corpus: Corpus,
  dampingFactor: number = 0.85,
  tolerance: number = 0.001
): Record<string, number> {
  const pages = Object.keys(corpus);
  const n = pages.length;
  let ranks: Record<string, number> = {};

  for (const p of pages) {
    ranks[p] = 1 / n;
  }

  let converged = false;
  while (!converged) {
    const nextRanks: Record<string, number> = {};
    converged = true;

    for (const p of pages) {
      let incomingSum = 0;
      for (const other of pages) {
        const links = corpus[other] || [];
        if (links.length === 0) {
          // A page with no links links to every page
          incomingSum += ranks[other] / n;
        } else if (links.includes(p)) {
          incomingSum += ranks[other] / links.length;
        }
      }
      nextRanks[p] = ((1 - dampingFactor) / n) + (dampingFactor * incomingSum);

      if (Math.abs(nextRanks[p] - ranks[p]) > tolerance) {
        converged = false;
      }
    }

    ranks = nextRanks;
  }

  // Normalize so probabilities sum to 1
  const sum = Object.values(ranks).reduce((acc, v) => acc + v, 0);
  const normalized: Record<string, number> = {};
  for (const p of pages) {
    normalized[p] = Math.round((ranks[p] / sum) * 10000) / 10000;
  }

  return normalized;
}
