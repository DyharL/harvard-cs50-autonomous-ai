import random

def transition_model(corpus, current_page, damping_factor=0.85):
    pages = list(corpus.keys())
    n = len(pages)
    links = corpus.get(current_page, [])

    if not links:
        return {p: 1.0 / n for p in pages}

    random_prob = (1.0 - damping_factor) / n
    link_prob = damping_factor / len(links)
    return {p: random_prob + (link_prob if p in links else 0.0) for p in pages}

def iterate_pagerank(corpus, damping_factor=0.85, tol=0.001):
    pages = list(corpus.keys())
    n = len(pages)
    ranks = {p: 1.0 / n for p in pages}

    converged = False
    while not converged:
        next_ranks = {}
        converged = True
        for p in pages:
            inc_sum = 0.0
            for other, links in corpus.items():
                if not links:
                    inc_sum += ranks[other] / n
                elif p in links:
                    inc_sum += ranks[other] / len(links)
            next_ranks[p] = ((1.0 - damping_factor) / n) + (damping_factor * inc_sum)
            if abs(next_ranks[p] - ranks[p]) > tol:
                converged = False
        ranks = next_ranks

    total = sum(ranks.values())
    return {p: round(r / total, 4) for p, r in ranks.items()}
