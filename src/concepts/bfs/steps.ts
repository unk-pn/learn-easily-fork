import type { ConceptStep } from '../../lib/types';

export const BFS_COLOR = '#f59e0b';

export const bfsSteps: ConceptStep[] = [
  {
    id: 'intro',
    label: 'BFS Overview',
    description: 'Understand breadth-first search',
    educationalText:
      'Breadth-First Search (BFS) visits all nodes at the current depth level before moving deeper. It uses a queue (FIFO) to process nodes in the order they were discovered — guaranteeing the shortest path in unweighted graphs.',
    deepDiveText:
      'Complexity\n• Time: O(V + E) — every vertex and edge is visited once\n• Space: O(V) — the queue can hold up to one full level of nodes\n\nKey guarantee\nBFS finds the shortest path (fewest edges) between two nodes in any unweighted graph.\n\nWhere BFS appears in practice\n• Dijkstra\'s algorithm — weighted shortest-path (BFS + priority queue)\n• Bipartite graph detection — colour nodes level by level\n• Multi-source spreading — e.g. "Rotting Oranges" (LeetCode 994)\n• Web crawlers — explore pages breadth-first from a seed URL',
    icon: 'GitBranch',
  },
  {
    id: 'a',
    label: 'Level 0 — Visit A',
    description: 'Enqueue A, dequeue and visit it',
    educationalText:
      'Start by enqueueing A. Dequeue A and visit it. Then enqueue all unvisited neighbors — B and C. Both are at distance 1 from A (Level 1). BFS will process ALL level-1 nodes before going deeper.',
    deepDiveText:
      'Queue state\n• Before: [A]\n• After visiting A: [B, C]\n\nWhy the order matters\n• B and C are both level 1 — enqueued before any level-2 node\n• FIFO ensures all of level 1 is processed before level 2 begins\n\nCore difference from DFS\n• BFS sweeps every node on the current level before going deeper\n• DFS dives as far as possible along one branch before backtracking',
    icon: 'Box',
  },
  {
    id: 'b',
    label: 'Level 1 — Visit B',
    description: 'Dequeue B, enqueue its children D & E',
    educationalText:
      "Dequeue B (first item in queue) and visit it. Enqueue B's unvisited children D and E. BFS then continues to the next item in the queue — C — before going to D or E.",
    deepDiveText:
      'Queue state\n• Before: [B, C] — B at front\n• After visiting B: [C, D, E]\n\nNotice the order\n• C (level 1) sits ahead of D and E (level 2)\n• FIFO preserves the level-by-level guarantee automatically\n\nThe rule\nBFS always finishes every node on a level before starting the next — no configuration needed, the queue enforces it.',
    icon: 'Box',
  },
  {
    id: 'c',
    label: 'Level 1 — Visit C',
    description: 'Dequeue C, enqueue its child F',
    educationalText:
      'Still on level 1 — dequeue C and visit it. Enqueue F. After this, level 1 is fully processed. All remaining queue items (D, E, F) belong to level 2.',
    deepDiveText:
      'Queue state\n• Before: [C, D, E] — C at front\n• After visiting C: [D, E, F]\n\nLevel 1 is now fully exhausted\nProcessing C completes the level-1 sweep. Every remaining node (D, E, F) is level 2.\n\nWhy this structure is useful\n• "Find all nodes at distance k" — BFS naturally groups nodes by level\n• "Shortest path" — the first time BFS reaches a node is always its shortest distance',
    icon: 'Box',
  },
  {
    id: 'd',
    label: 'Level 2 — Visit D',
    description: 'Dequeue D — a leaf node',
    educationalText:
      'Dequeue D and visit it. D has no unvisited children, so nothing is enqueued. D is at the shortest distance of 2 from A: A → B → D.',
    deepDiveText:
      "Queue state\n• Before: [D, E, F] — D at front\n• After visiting D: [E, F]\n\nGuaranteed shortest distance\n• D's shortest path from A = 2 edges: A → B → D\n• Because BFS completes level 1 before level 2, this distance is final\n\nBFS never revisits a node at a shorter distance — the first visit is always optimal in unweighted graphs.",
    icon: 'Box',
  },
  {
    id: 'e',
    label: 'Level 2 — Visit E',
    description: 'Dequeue E — a leaf node',
    educationalText:
      "E is dequeued and visited. Another leaf, nothing enqueued. We've now visited A, B, C, D, E in perfect level-order. Compare to DFS: A → B → D → E → C → F vs BFS: A → B → C → D → E → F.",
    deepDiveText:
      'Queue state\n• Before: [E, F] — E at front\n• After visiting E: [F]\n\nDFS vs BFS on this graph\n• DFS order: A → B → D → E → C → F (dives left branch first)\n• BFS order: A → B → C → D → E → F (sweeps level by level)\n\nSame nodes visited, completely different order:\nBFS reached C as the 3rd node; DFS reached C as the 5th.',
    icon: 'Box',
  },
  {
    id: 'f',
    label: 'Level 2 — Visit F — Complete',
    description: 'BFS finishes — all 6 nodes visited',
    educationalText:
      'F is dequeued and visited. The queue is now empty — BFS is complete. Full order: A → B → C → D → E → F, neatly matching the level-by-level structure of the graph.',
    deepDiveText:
      'Final traversal by level\n• Level 0: A\n• Level 1: B, C\n• Level 2: D, E, F\n\nComplexity summary\n• Time: O(V + E)\n• Space: O(V) for the queue\n\nBFS tree edges: A–B, A–C, B–D, B–E, C–F\nThis level-encoded structure is exactly what makes BFS the go-to algorithm for shortest-path queries.',
    icon: 'CheckCircle2',
    codeSnippets: {
      python:
        'from collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n\n    return order',
      javascript:
        'function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  const order = [];\n\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n  return order;\n}',
      java: 'import java.util.*;\n\nList<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {\n    Set<Integer> visited = new HashSet<>(List.of(start));\n    Queue<Integer> queue = new LinkedList<>(List.of(start));\n    List<Integer> order = new ArrayList<>();\n\n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        order.add(node);\n\n        for (int neighbor : graph.get(node)) {\n            if (!visited.contains(neighbor)) {\n                visited.add(neighbor);\n                queue.offer(neighbor);\n            }\n        }\n    }\n    return order;\n}',
    },
  },
  {
    id: 'practice',
    label: 'LeetCode Practice',
    description: 'Reinforce BFS with real interview problems',
    educationalText:
      'Apply BFS to these LeetCode problems — ordered by difficulty:\n\n🟢 Easy\n• #733  Flood Fill — Explore connected pixels level by level\n• #104  Maximum Depth of Binary Tree — BFS layer count = depth\n• #111  Minimum Depth of Binary Tree — Stop at first leaf level\n• #637  Average of Levels in Binary Tree — Sum each level row\n• #993  Cousins in Binary Tree — Find nodes at same depth\n\n🟡 Medium\n• #102  Binary Tree Level Order Traversal — Classic BFS output\n• #200  Number of Islands — Multi-source BFS on a grid\n• #994  Rotting Oranges — BFS spreading from all rotten cells\n• #542  01 Matrix — BFS distance from nearest 0\n• #1091 Shortest Path in Binary Matrix — Shortest path on grid\n• #752  Open the Lock — BFS on state-space graph',
    deepDiveText:
      'Patterns to recognise\n\nGrid / distance problems\n• Grid + shortest distance → BFS over cells\n• "Minimum steps" → BFS guarantees shortest path in unweighted graphs\n\nStructural patterns\n• "Level by level" processing → classic BFS with a queue\n• Multi-source BFS → add ALL source nodes to the queue before starting\n\nState-space BFS\n• Treat each unique program state as a graph node\n• Example: #752 Open the Lock — each dial combination is a "node"',
    icon: 'CheckCircle2',
  },
];
