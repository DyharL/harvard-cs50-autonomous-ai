export interface AttentionOutput {
  weights: number[][]; // [seqLen][seqLen] attention matrix
  contextVectors: number[][]; // [seqLen][dModel]
}

export class ScaledDotProductAttention {
  private readonly dKey: number;

  constructor(dKey: number = 4) {
    this.dKey = dKey;
  }

  // Softmax on 1D vector
  private softmax(vector: number[]): number[] {
    const maxVal = Math.max(...vector);
    const exps = vector.map(x => Math.exp(x - maxVal));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / (sum || 1));
  }

  // Q: [seqLen][dKey], K: [seqLen][dKey], V: [seqLen][dValue]
  public compute(Q: number[][], K: number[][], V: number[][]): AttentionOutput {
    const seqLen = Q.length;
    const dVal = V[0].length;
    const scale = Math.sqrt(this.dKey);

    // Compute raw scores = Q * K^T / sqrt(d_k)
    const rawScores: number[][] = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
    for (let i = 0; i < seqLen; i++) {
      for (let j = 0; j < seqLen; j++) {
        let dot = 0;
        for (let d = 0; d < this.dKey; d++) {
          dot += Q[i][d] * K[j][d];
        }
        rawScores[i][j] = dot / scale;
      }
    }

    // Apply softmax row-wise to get attention weights
    const weights: number[][] = rawScores.map(row => this.softmax(row));

    // Compute context = weights * V
    const contextVectors: number[][] = Array.from({ length: seqLen }, () => Array(dVal).fill(0));
    for (let i = 0; i < seqLen; i++) {
      for (let v = 0; v < dVal; v++) {
        let sum = 0;
        for (let j = 0; j < seqLen; j++) {
          sum += weights[i][j] * V[j][v];
        }
        contextVectors[i][v] = Math.round(sum * 1000) / 1000;
      }
    }

    return {
      weights: weights.map(row => row.map(w => Math.round(w * 1000) / 1000)),
      contextVectors
    };
  }
}

export function predictMaskedToken(
  tokens: string[],
  maskIndex: number,
  candidateVocabulary: Record<string, number>
): Array<{ token: string; probability: number }> {
  const candidates = Object.entries(candidateVocabulary);
  const totalWeight = candidates.reduce((acc, [, w]) => acc + w, 0);

  const predictions = candidates.map(([token, weight]) => ({
    token,
    probability: Math.round((weight / (totalWeight || 1)) * 1000) / 1000
  }));

  predictions.sort((a, b) => b.probability - a.probability);
  return predictions;
}
