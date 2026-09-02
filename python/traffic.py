import math

def relu(x):
    return max(0.0, x)

def softmax(vector):
    max_v = max(vector)
    exps = [math.exp(v - max_v) for v in vector]
    s = sum(exps)
    return [e / s for e in exps]

def convolve_2d(matrix, kernel):
    h, w = len(matrix), len(matrix[0])
    kh, kw = len(kernel), len(kernel[0])
    out_h, out_w = h - kh + 1, w - kw + 1
    output = []
    for y in range(out_h):
        row = []
        for x in range(out_w):
            s = sum(matrix[y + ky][x + kx] * kernel[ky][kx] for ky in range(kh) for kx in range(kw))
            row.append(relu(s))
        output.append(row)
    return output

def max_pool_2d(matrix, pool_size=2):
    h, w = len(matrix), len(matrix[0])
    out_h, out_w = h // pool_size, w // pool_size
    output = []
    for y in range(out_h):
        row = []
        for x in range(out_w):
            m = max(matrix[y * pool_size + py][x * pool_size + px] for py in range(pool_size) for px in range(pool_size))
            row.append(m)
        output.append(row)
    return output
