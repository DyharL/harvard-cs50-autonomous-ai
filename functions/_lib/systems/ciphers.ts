export function caesarEncrypt(plaintext: string, shift: number): string {
  const normalizedShift = ((shift % 26) + 26) % 26;
  return plaintext.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + normalizedShift) % 26) + 65);
    }
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + normalizedShift) % 26) + 97);
    }
    return char;
  }).join('');
}

export function substitutionEncrypt(plaintext: string, key: string): string {
  if (key.length !== 26) {
    throw new Error('Substitution key must contain exactly 26 alphabetical characters');
  }
  const cleanKey = key.toUpperCase();
  const seen = new Set<string>();
  for (const c of cleanKey) {
    if (c < 'A' || c > 'Z' || seen.has(c)) {
      throw new Error('Substitution key must have 26 unique alphabetical characters');
    }
    seen.add(c);
  }

  return plaintext.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return cleanKey.charAt(code - 65);
    }
    if (code >= 97 && code <= 122) {
      return cleanKey.charAt(code - 97).toLowerCase();
    }
    return char;
  }).join('');
}
