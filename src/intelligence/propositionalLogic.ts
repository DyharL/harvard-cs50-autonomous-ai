export type Model = Record<string, boolean>;

export interface Sentence {
  evaluate(model: Model): boolean;
  symbols(): Set<string>;
}

export class SymbolSentence implements Sentence {
  constructor(public readonly name: string) {}
  evaluate(model: Model): boolean {
    if (!(this.name in model)) {
      throw new Error(`Symbol '${this.name}' not bound in model`);
    }
    return model[this.name];
  }
  symbols(): Set<string> {
    return new Set([this.name]);
  }
}

export class NotSentence implements Sentence {
  constructor(public readonly operand: Sentence) {}
  evaluate(model: Model): boolean {
    return !this.operand.evaluate(model);
  }
  symbols(): Set<string> {
    return this.operand.symbols();
  }
}

export class AndSentence implements Sentence {
  constructor(public readonly operands: Sentence[]) {}
  evaluate(model: Model): boolean {
    return this.operands.every(op => op.evaluate(model));
  }
  symbols(): Set<string> {
    const s = new Set<string>();
    for (const op of this.operands) {
      for (const sym of op.symbols()) s.add(sym);
    }
    return s;
  }
}

export class OrSentence implements Sentence {
  constructor(public readonly operands: Sentence[]) {}
  evaluate(model: Model): boolean {
    return this.operands.some(op => op.evaluate(model));
  }
  symbols(): Set<string> {
    const s = new Set<string>();
    for (const op of this.operands) {
      for (const sym of op.symbols()) s.add(sym);
    }
    return s;
  }
}

export class ImplicationSentence implements Sentence {
  constructor(public readonly antecedent: Sentence, public readonly consequent: Sentence) {}
  evaluate(model: Model): boolean {
    return !this.antecedent.evaluate(model) || this.consequent.evaluate(model);
  }
  symbols(): Set<string> {
    const s = new Set<string>();
    for (const sym of this.antecedent.symbols()) s.add(sym);
    for (const sym of this.consequent.symbols()) s.add(sym);
    return s;
  }
}

export class BiconditionalSentence implements Sentence {
  constructor(public readonly left: Sentence, public readonly right: Sentence) {}
  evaluate(model: Model): boolean {
    return this.left.evaluate(model) === this.right.evaluate(model);
  }
  symbols(): Set<string> {
    const s = new Set<string>();
    for (const sym of this.left.symbols()) s.add(sym);
    for (const sym of this.right.symbols()) s.add(sym);
    return s;
  }
}

export function modelCheck(knowledgeBase: Sentence, query: Sentence): boolean {
  const allSymbols = new Set<string>();
  for (const s of knowledgeBase.symbols()) allSymbols.add(s);
  for (const s of query.symbols()) allSymbols.add(s);

  const symbolList = Array.from(allSymbols);

  function checkAll(symbols: string[], model: Model): boolean {
    if (symbols.length === 0) {
      if (knowledgeBase.evaluate(model)) {
        return query.evaluate(model);
      }
      return true; // Vacuously true
    }

    const first = symbols[0];
    const rest = symbols.slice(1);

    const modelTrue: Model = { ...model, [first]: true };
    const modelFalse: Model = { ...model, [first]: false };

    return checkAll(rest, modelTrue) && checkAll(rest, modelFalse);
  }

  return checkAll(symbolList, {});
}
