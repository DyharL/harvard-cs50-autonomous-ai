class CrosswordCSP:
    def __init__(self, variables, words):
        self.variables = variables  # list of tuples (id, length)
        self.words = set(w.upper() for w in words)
        self.domains = {v[0]: {w for w in self.words if len(w) == v[1]} for v in variables}

    def solve(self):
        # Backtracking solver
        def backtrack(assignment):
            if len(assignment) == len(self.variables):
                return assignment
            unassigned = [v[0] for v in self.variables if v[0] not in assignment]
            var = min(unassigned, key=lambda v: len(self.domains[v]))

            for word in self.domains[var]:
                if word not in assignment.values():
                    assignment[var] = word
                    res = backtrack(assignment)
                    if res is not None:
                        return res
                    del assignment[var]
            return None

        return backtrack({})
