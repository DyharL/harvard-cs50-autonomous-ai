class Sentence:
    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count

    def known_mines(self):
        if len(self.cells) == self.count and self.count > 0:
            return set(self.cells)
        return set()

    def known_safes(self):
        if self.count == 0:
            return set(self.cells)
        return set()

    def mark_mine(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            self.count -= 1

    def mark_safe(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)

class MinesweeperAI:
    def __init__(self, height=8, width=8):
        self.height = height
        self.width = width
        self.moves_made = set()
        self.mines = set()
        self.safes = set()
        self.knowledge = []

    def mark_mine(self, cell):
        self.mines.add(cell)
        for s in self.knowledge:
            s.mark_mine(cell)

    def mark_safe(self, cell):
        self.safes.add(cell)
        for s in self.knowledge:
            s.mark_safe(cell)

    def add_knowledge(self, cell, count):
        self.moves_made.add(cell)
        self.mark_safe(cell)

        neighbors = set()
        adjusted_count = count

        for r in range(max(0, cell[0] - 1), min(self.height, cell[0] + 2)):
            for c in range(max(0, cell[1] - 1), min(self.width, cell[1] + 2)):
                if (r, c) == cell:
                    continue
                if (r, c) in self.mines:
                    adjusted_count -= 1
                elif (r, c) not in self.safes:
                    neighbors.add((r, c))

        if neighbors:
            self.knowledge.append(Sentence(neighbors, adjusted_count))

        changed = True
        while changed:
            changed = False
            self.knowledge = [s for s in self.knowledge if s.cells]

            new_safes = set()
            new_mines = set()
            for s in self.knowledge:
                new_safes.update(s.known_safes() - self.safes)
                new_mines.update(s.known_mines() - self.mines)

            if new_safes or new_mines:
                changed = True
                for s in new_safes:
                    self.mark_safe(s)
                for m in new_mines:
                    self.mark_mine(m)

            for s1 in self.knowledge:
                for s2 in self.knowledge:
                    if s1 != s2 and s1.cells.issubset(s2.cells):
                        diff_cells = s2.cells - s1.cells
                        diff_count = s2.count - s1.count
                        if diff_cells:
                            new_sent = Sentence(diff_cells, diff_count)
                            if not any(k.cells == new_sent.cells and k.count == new_sent.count for k in self.knowledge):
                                self.knowledge.append(new_sent)
                                changed = True
