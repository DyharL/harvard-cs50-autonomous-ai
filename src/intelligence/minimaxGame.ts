export type Player = 'X' | 'O';
export type BoardCell = Player | null;
export type BoardState = BoardCell[]; // 9 elements: indices 0..8

export interface Move {
  index: number;
  score: number;
}

export function getPlayerTurn(board: BoardState): Player {
  const xCount = board.filter(c => c === 'X').length;
  const oCount = board.filter(c => c === 'O').length;
  return xCount <= oCount ? 'X' : 'O';
}

export function getAvailableActions(board: BoardState): number[] {
  const actions: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      actions.push(i);
    }
  }
  return actions;
}

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function getWinner(board: BoardState): Player | null {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function isTerminal(board: BoardState): boolean {
  if (getWinner(board) !== null) return true;
  return board.every(c => c !== null);
}

export function evaluateUtility(board: BoardState): number {
  const winner = getWinner(board);
  if (winner === 'X') return 1;
  if (winner === 'O') return -1;
  return 0;
}

export function minimax(
  board: BoardState,
  alpha: number = -Infinity,
  beta: number = +Infinity
): Move {
  if (isTerminal(board)) {
    return { index: -1, score: evaluateUtility(board) };
  }

  const turn = getPlayerTurn(board);
  const actions = getAvailableActions(board);

  if (turn === 'X') {
    let bestScore = -Infinity;
    let bestMove = actions[0];

    for (const action of actions) {
      const nextBoard = [...board];
      nextBoard[action] = 'X';
      const result = minimax(nextBoard, alpha, beta);
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = action;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break; // Beta cut-off
    }
    return { index: bestMove, score: bestScore };
  } else {
    let bestScore = +Infinity;
    let bestMove = actions[0];

    for (const action of actions) {
      const nextBoard = [...board];
      nextBoard[action] = 'O';
      const result = minimax(nextBoard, alpha, beta);
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = action;
      }
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break; // Alpha cut-off
    }
    return { index: bestMove, score: bestScore };
  }
}
