export type NimState = number[];
export type NimAction = [number, number]; // [pileIndex, countToRemove]

export class NimGame {
  public piles: NimState;
  public player: number; // 0 or 1
  public winner: number | null = null;

  constructor(initialPiles: NimState = [1, 3, 5, 7]) {
    this.piles = [...initialPiles];
    this.player = 0;
  }

  public getAvailableActions(): NimAction[] {
    const actions: NimAction[] = [];
    for (let p = 0; p < this.piles.length; p++) {
      for (let count = 1; count <= this.piles[p]; count++) {
        actions.push([p, count]);
      }
    }
    return actions;
  }

  public move(action: NimAction): void {
    const [p, count] = action;
    if (this.piles[p] < count || count <= 0) {
      throw new Error(`Invalid move on pile ${p} with count ${count}`);
    }
    this.piles[p] -= count;
    this.player = 1 - this.player;

    if (this.piles.every(count => count === 0)) {
      // The player who made the last move wins (or normal play convention)
      this.winner = 1 - this.player;
    }
  }
}

export class QLearningAgent {
  public qTable: Map<string, number> = new Map();
  public alpha: number; // Learning rate
  public epsilon: number; // Exploration rate
  public gamma: number; // Discount factor

  constructor(alpha: number = 0.5, epsilon: number = 0.1, gamma: number = 1.0) {
    this.alpha = alpha;
    this.epsilon = epsilon;
    this.gamma = gamma;
  }

  private stateActionKey(state: NimState, action: NimAction): string {
    return `${state.join(',')}:${action.join(',')}`;
  }

  public getQValue(state: NimState, action: NimAction): number {
    const key = this.stateActionKey(state, action);
    return this.qTable.get(key) ?? 0.0;
  }

  public updateQValue(
    state: NimState,
    action: NimAction,
    reward: number,
    futureMaxQ: number
  ): void {
    const currentQ = this.getQValue(state, action);
    const newQ = currentQ + this.alpha * (reward + this.gamma * futureMaxQ - currentQ);
    this.qTable.set(this.stateActionKey(state, action), newQ);
  }

  public chooseAction(state: NimState, availableActions: NimAction[], epsilonOverride?: number): NimAction {
    const eps = epsilonOverride !== undefined ? epsilonOverride : this.epsilon;

    if (Math.random() < eps) {
      // Explore
      const idx = Math.floor(Math.random() * availableActions.length);
      return availableActions[idx];
    }

    // Exploit: pick best action with highest Q
    let bestVal = -Infinity;
    let bestAction = availableActions[0];

    for (const a of availableActions) {
      const q = this.getQValue(state, a);
      if (q > bestVal) {
        bestVal = q;
        bestAction = a;
      }
    }
    return bestAction;
  }

  public train(episodes: number = 2000): void {
    for (let ep = 0; ep < episodes; ep++) {
      const game = new NimGame([1, 3, 5]);
      const history: Array<{ player: number; state: NimState; action: NimAction }> = [];

      while (game.winner === null) {
        const state = [...game.piles];
        const actions = game.getAvailableActions();
        const action = this.chooseAction(state, actions);

        history.push({ player: game.player, state, action });
        game.move(action);
      }

      // Backpropagate rewards
      const winner = game.winner;
      for (let i = history.length - 1; i >= 0; i--) {
        const step = history[i];
        const reward = step.player === winner ? 1 : -1;
        this.updateQValue(step.state, step.action, reward, 0);
      }
    }
  }
}
