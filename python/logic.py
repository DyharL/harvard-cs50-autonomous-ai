class Sentence:
    def evaluate(self, model):
        raise NotImplementedError

    def symbols(self):
        raise NotImplementedError

class Symbol(Sentence):
    def __init__(self, name):
        self.name = name

    def evaluate(self, model):
        return bool(model.get(self.name))

    def symbols(self):
        return {self.name}

class And(Sentence):
    def __init__(self, *conjuncts):
        self.conjuncts = conjuncts

    def evaluate(self, model):
        return all(c.evaluate(model) for c in self.conjuncts)

    def symbols(self):
        return set.union(*[c.symbols() for c in self.conjuncts])

class Or(Sentence):
    def __init__(self, *disjuncts):
        self.disjuncts = disjuncts

    def evaluate(self, model):
        return any(d.evaluate(model) for d in self.disjuncts)

    def symbols(self):
        return set.union(*[d.symbols() for d in self.disjuncts])

class Not(Sentence):
    def __init__(self, operand):
        self.operand = operand

    def evaluate(self, model):
        return not self.operand.evaluate(model)

    def symbols(self):
        return self.operand.symbols()

class Implication(Sentence):
    def __init__(self, antecedent, consequent):
        self.antecedent = antecedent
        self.consequent = consequent

    def evaluate(self, model):
        return (not self.antecedent.evaluate(model)) or self.consequent.evaluate(model)

    def symbols(self):
        return self.antecedent.symbols().union(self.consequent.symbols())

def model_check(knowledge, query):
    symbols = list(knowledge.symbols().union(query.symbols()))

    def check_all(syms, model):
        if not syms:
            if knowledge.evaluate(model):
                return query.evaluate(model)
            return True
        first, rest = syms[0], syms[1:]
        m_true = {**model, first: True}
        m_false = {**model, first: False}
        return check_all(rest, m_true) and check_all(rest, m_false)

    return check_all(symbols, {})
