export interface SyntaxTreeNode {
  label: string;
  children: Array<SyntaxTreeNode | string>;
}

export class SimpleGrammarParser {
  private lexicon: Record<string, string[]> = {
    D: ['the', 'a', 'an'],
    N: ['she', 'he', 'cat', 'dog', 'tree', 'telescope', 'park', 'algorithms', 'robot'],
    V: ['saw', 'chased', 'loved', 'built', 'observed', 'solved'],
    P: ['in', 'on', 'with', 'under', 'at'],
    Adj: ['quick', 'brown', 'lazy', 'clever', 'autonomous']
  };

  public tokenize(sentence: string): string[] {
    return sentence
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);
  }

  // Parses a simple sentence following S -> NP VP
  public parse(sentence: string): SyntaxTreeNode | null {
    const tokens = this.tokenize(sentence);
    if (tokens.length === 0) return null;

    // Identify main verb split
    let verbIdx = -1;
    for (let i = 0; i < tokens.length; i++) {
      if (this.lexicon.V.includes(tokens[i])) {
        verbIdx = i;
        break;
      }
    }

    if (verbIdx <= 0 || verbIdx >= tokens.length) {
      return null;
    }

    const subjectTokens = tokens.slice(0, verbIdx);
    const predicateTokens = tokens.slice(verbIdx);

    const subjectNP = this.parseNP(subjectTokens);
    const predicateVP = this.parseVP(predicateTokens);

    if (!subjectNP || !predicateVP) return null;

    return {
      label: 'S',
      children: [subjectNP, predicateVP]
    };
  }

  private parseNP(tokens: string[]): SyntaxTreeNode | null {
    if (tokens.length === 0) return null;

    // Single noun/pronoun
    if (tokens.length === 1 && this.lexicon.N.includes(tokens[0])) {
      return {
        label: 'NP',
        children: [{ label: 'N', children: [tokens[0]] }]
      };
    }

    // Determiner + Noun
    if (tokens.length === 2 && this.lexicon.D.includes(tokens[0]) && this.lexicon.N.includes(tokens[1])) {
      return {
        label: 'NP',
        children: [
          { label: 'D', children: [tokens[0]] },
          { label: 'N', children: [tokens[1]] }
        ]
      };
    }

    // Determiner + Adjective + Noun
    if (
      tokens.length === 3 &&
      this.lexicon.D.includes(tokens[0]) &&
      this.lexicon.Adj.includes(tokens[1]) &&
      this.lexicon.N.includes(tokens[2])
    ) {
      return {
        label: 'NP',
        children: [
          { label: 'D', children: [tokens[0]] },
          { label: 'Adj', children: [tokens[1]] },
          { label: 'N', children: [tokens[2]] }
        ]
      };
    }

    return null;
  }

  private parseVP(tokens: string[]): SyntaxTreeNode | null {
    if (tokens.length === 0) return null;
    const verb = tokens[0];
    if (!this.lexicon.V.includes(verb)) return null;

    const vNode: SyntaxTreeNode = { label: 'V', children: [verb] };
    const rest = tokens.slice(1);

    if (rest.length === 0) {
      return { label: 'VP', children: [vNode] };
    }

    // Check if rest starts with preposition
    if (this.lexicon.P.includes(rest[0])) {
      const prepNode: SyntaxTreeNode = { label: 'P', children: [rest[0]] };
      const objNP = this.parseNP(rest.slice(1));
      if (!objNP) return null;
      const ppNode: SyntaxTreeNode = { label: 'PP', children: [prepNode, objNP] };
      return { label: 'VP', children: [vNode, ppNode] };
    }

    // Direct object NP
    const directObj = this.parseNP(rest);
    if (directObj) {
      return { label: 'VP', children: [vNode, directObj] };
    }

    return null;
  }

  public extractNounPhrases(node: SyntaxTreeNode): string[] {
    const results: string[] = [];

    const traverse = (n: SyntaxTreeNode | string): void => {
      if (typeof n === 'string') return;
      if (n.label === 'NP') {
        const text = this.flattenLeaves(n);
        results.push(text);
      } else {
        for (const child of n.children) {
          traverse(child);
        }
      }
    };

    traverse(node);
    return results;
  }

  private flattenLeaves(node: SyntaxTreeNode): string {
    const words: string[] = [];
    const collect = (n: SyntaxTreeNode | string): void => {
      if (typeof n === 'string') {
        words.push(n);
      } else {
        for (const c of n.children) collect(c);
      }
    };
    collect(node);
    return words.join(' ');
  }
}
