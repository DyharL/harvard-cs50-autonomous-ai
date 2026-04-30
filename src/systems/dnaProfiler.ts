export interface STRProfile {
  name: string;
  counts: Record<string, number>;
}

export function findMaxConsecutiveSTR(dnaSequence: string, subsequence: string): number {
  let maxCount = 0;
  const subLen = subsequence.length;
  const seqLen = dnaSequence.length;

  for (let i = 0; i <= seqLen - subLen; i++) {
    let count = 0;
    while (dnaSequence.substring(i + count * subLen, i + (count + 1) * subLen) === subsequence) {
      count++;
    }
    if (count > maxCount) {
      maxCount = count;
    }
  }

  return maxCount;
}

export function matchDnaProfile(dnaSequence: string, database: STRProfile[]): string {
  if (database.length === 0) return 'No match';
  const strKeys = Object.keys(database[0].counts);

  const sampleProfile: Record<string, number> = {};
  for (const str of strKeys) {
    sampleProfile[str] = findMaxConsecutiveSTR(dnaSequence, str);
  }

  for (const person of database) {
    let matchesAll = true;
    for (const str of strKeys) {
      if (person.counts[str] !== sampleProfile[str]) {
        matchesAll = false;
        break;
      }
    }
    if (matchesAll) {
      return person.name;
    }
  }

  return 'No match';
}
