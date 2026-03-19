export interface ReadabilityMetrics {
  letterCount: number;
  wordCount: number;
  sentenceCount: number;
  grade: string;
  index: number;
}

export function computeReadability(text: string): ReadabilityMetrics {
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const wordsArray = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = wordsArray.length;
  const sentenceCount = (text.match(/[.!?]+/g) || []).length || (wordCount > 0 ? 1 : 0);

  if (wordCount === 0) {
    return {
      letterCount: 0,
      wordCount: 0,
      sentenceCount: 0,
      grade: 'Before Grade 1',
      index: 0
    };
  }

  const L = (letters / wordCount) * 100;
  const S = (sentenceCount / wordCount) * 100;
  const rawIndex = 0.0588 * L - 0.296 * S - 15.8;
  const rounded = Math.round(rawIndex);

  let grade: string;
  if (rounded < 1) {
    grade = 'Before Grade 1';
  } else if (rounded >= 16) {
    grade = 'Grade 16+';
  } else {
    grade = `Grade ${rounded}`;
  }

  return {
    letterCount: letters,
    wordCount,
    sentenceCount,
    grade,
    index: Math.round(rawIndex * 100) / 100
  };
}
