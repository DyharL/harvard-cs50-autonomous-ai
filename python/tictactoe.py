import math

X = "X"
O = "O"
EMPTY = None

def initial_state():
    return [[EMPTY, EMPTY, EMPTY] for _ in range(3)]

def player(board):
    x_count = sum(row.count(X) for row in board)
    o_count = sum(row.count(O) for row in board)
    return X if x_count <= o_count else O

def actions(board):
    return {(i, j) for i in range(3) for j in range(3) if board[i][j] == EMPTY}

def result(board, action):
    i, j = action
    if board[i][j] != EMPTY:
        raise ValueError("Invalid move")
    new_board = [row[:] for row in board]
    new_board[i][j] = player(board)
    return new_board

def winner(board):
    for i in range(3):
        if board[i][0] and board[i][0] == board[i][1] == board[i][2]:
            return board[i][0]
        if board[0][i] and board[0][i] == board[1][i] == board[2][i]:
            return board[0][i]
    if board[0][0] and board[0][0] == board[1][1] == board[2][2]:
        return board[0][0]
    if board[0][2] and board[0][2] == board[1][1] == board[2][0]:
        return board[0][2]
    return None

def terminal(board):
    if winner(board) is not None:
        return True
    return all(cell is not EMPTY for row in board for cell in row)

def utility(board):
    win = winner(board)
    if win == X:
        return 1
    elif win == O:
        return -1
    return 0

def minimax(board):
    if terminal(board):
        return None

    current_player = player(board)

    def max_value(s, alpha, beta):
        if terminal(s):
            return utility(s), None
        v = -math.inf
        best_act = None
        for a in actions(s):
            min_v, _ = min_value(result(s, a), alpha, beta)
            if min_v > v:
                v = min_v
                best_act = a
            alpha = max(alpha, v)
            if beta <= alpha:
                break
        return v, best_act

    def min_value(s, alpha, beta):
        if terminal(s):
            return utility(s), None
        v = math.inf
        best_act = None
        for a in actions(s):
            max_v, _ = max_value(result(s, a), alpha, beta)
            if max_v < v:
                v = max_v
                best_act = a
            beta = min(beta, v)
            if beta <= alpha:
                break
        return v, best_act

    if current_player == X:
        _, move = max_value(board, -math.inf, math.inf)
    else:
        _, move = min_value(board, -math.inf, math.inf)
    return move
