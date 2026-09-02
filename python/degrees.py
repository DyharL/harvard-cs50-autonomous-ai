from collections import deque

def shortest_path_bfs(graph: dict[str, list[tuple[str, str]]], source: str, target: str):
    if source == target:
        return [(source, None)]

    queue = deque([(source, [(source, None)])])
    visited = {source}

    while queue:
        current, path = queue.popleft()
        for neighbor, edge_id in graph.get(current, []):
            if neighbor == target:
                return path + [(neighbor, edge_id)]
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [(neighbor, edge_id)]))

    return None
