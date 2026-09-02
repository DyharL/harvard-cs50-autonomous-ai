import random

class Nim:
    def __init__(self, initial=[1, 3, 5, 7]):
        self.piles = list(initial)
        self.player = 0

    @classmethod
    def available_actions(cls, piles):
        actions = set()
        for i, pile in enumerate(piles):
            for count in range(1, pile + 1):
                actions.add((i, count))
        return actions

class QLearningAgent:
    def __init__(self, alpha=0.5, epsilon=0.1):
        self.q = {}
        self.alpha = alpha
        self.epsilon = epsilon

    def get_q(self, state, action):
        return self.q.get((tuple(state), action), 0.0)

    def update_q(self, state, action, reward, future_max_q):
        old_q = self.get_q(state, action)
        self.q[(tuple(state), action)] = old_q + self.alpha * (reward + future_max_q - old_q)

    def choose_action(self, state, actions):
        if not actions:
            return None
        if random.random() < self.epsilon:
            return random.choice(list(actions))
        best_val = -float("inf")
        best_act = None
        for a in actions:
            val = self.get_q(state, a)
            if val > best_val:
                best_val = val
                best_act = a
        return best_act if best_act is not None else random.choice(list(actions))
