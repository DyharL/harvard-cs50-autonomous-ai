import math

def softmax_row(row):
    max_v = max(row)
    exps = [math.exp(x - max_v) for x in row]
    s = sum(exps)
    return [e / s for e in exps]

def scaled_dot_product_attention(Q, K, V, d_k):
    seq_len = len(Q)
    d_v = len(V[0])
    scale = math.sqrt(d_k)

    scores = []
    for i in range(seq_len):
        row = []
        for j in range(seq_len):
            dot = sum(Q[i][d] * K[j][d] for d in range(d_k))
            row.append(dot / scale)
        scores.append(softmax_row(row))

    context = []
    for i in range(seq_len):
        ctx_row = []
        for v in range(d_v):
            val = sum(scores[i][j] * V[j][v] for j in range(seq_len))
            ctx_row.append(round(val, 4))
        context.append(ctx_row)

    return {"weights": scores, "context": context}
