import type { ConceptStep } from '../../lib/types';

export const DFS_COLOR = '#818cf8';

export const dfsSteps: ConceptStep[] = [
  {
    id: 'intro',
    label: 'DFS Overview',
    description: 'Understand depth-first search',
    educationalText:
      'Depth-First Search (DFS) explores as far as possible along each branch before backtracking. It uses a stack — either explicit or the call stack via recursion — to track nodes to visit next.',
    deepDiveText:
      "Complexity\n• Time: O(V + E) — every vertex and edge visited once\n• Space: O(V) — stack depth proportional to the longest path\n\nWhere DFS is foundational\n• Cycle detection — spot back edges in the DFS tree\n• Topological sort — post-order DFS gives a valid linearisation\n• Strongly connected components — Tarjan's / Kosaraju's algorithms\n• Maze solving — explore one path fully before backtracking\n\nEdge classification\nDFS labels every edge as tree, back, forward, or cross — the only algorithm that naturally produces this information.",
    icon: 'GitBranch',
  },
  {
    id: 'a',
    label: 'Visit A (Root)',
    description: 'Start DFS at node A, push neighbors to stack',
    educationalText:
      'Begin at node A. Visit it immediately, then push its unvisited neighbors onto the stack. DFS commits to going as deep as possible — so it pushes B and C but immediately dives into whichever is on top.',
    deepDiveText:
      "Stack state\n• Before: [A]\n• After visiting A: [B, C] — B on top\n\nWhy push order matters\n• C is pushed first, B second → B sits on top\n• LIFO (last-in, first-out) means B is processed next\n• B's entire subtree will be exhausted before C is ever touched\n\nStack vs Queue\n• Stack → LIFO → depth-first (DFS)\n• Queue → FIFO → breadth-first (BFS)\nSwapping the data structure transforms one algorithm into the other.",
    icon: 'Box',
  },
  {
    id: 'b',
    label: 'Visit B',
    description: 'Pop B from stack, go deeper',
    educationalText:
      'B is on top of the stack — pop and visit it. Push its unvisited children D and E (E first, then D so D is on top). DFS keeps going deeper before it ever returns to C.',
    deepDiveText:
      "Stack state\n• Before: [B, C] — B on top\n• After visiting B: [D, E, C] — D on top\n\nHow deep the stack has grown\n• DFS is already 2 levels down (A → B) before visiting C\n• C is A's direct child, yet it's buried under B's children in the stack\n\nDFS vs BFS on this choice\n• DFS: visits D (level 2) before C (level 1)\n• BFS: would visit C as the 3rd node, before any level-2 node\n\nThis divergence is the defining contrast between the two algorithms.",
    icon: 'Box',
  },
  {
    id: 'd',
    label: 'Visit D',
    description: 'Deepest point — D is a leaf',
    educationalText:
      'D is popped and visited. It has no children, so nothing is pushed. DFS has reached its deepest point on this path: A → B → D. The stack naturally handles backtracking.',
    deepDiveText:
      'Stack state\n• Before: [D, E, C] — D on top\n• After visiting D: [E, C]\n\nImplicit backtracking\n• D has no children → nothing is pushed → DFS naturally pops the next item\n• No explicit "go back" instruction is needed\n• The stack always holds the nearest unfinished branch\n\nPath so far: A → B → D\nThis is the deepest point on the left branch. DFS now returns to the last fork point (B) by popping E next.',
    icon: 'Box',
  },
  {
    id: 'e',
    label: 'Backtrack to E',
    description: "After D, pop E — B's other child",
    educationalText:
      "Having fully explored D, DFS backtracks and pops E. E is B's other child. It too is a leaf, so after visiting it we backtrack further up toward A.",
    deepDiveText:
      "Stack state\n• Before: [E, C] — E on top\n• After visiting E: [C]\n\nBacktracking — DFS's hallmark\n• Explore one full path to its end\n• Return to the nearest unfinished fork\n• Try the next sibling\n\nOrder so far: A → B → D → E\nB's entire subtree is now complete. Only then does DFS return to A's level to process C — the right subtree.",
    icon: 'RotateCcw',
  },
  {
    id: 'c',
    label: 'Backtrack to C',
    description: "B's subtree done — now explore right subtree",
    educationalText:
      "B's entire subtree is exhausted. DFS backtracks all the way up to A's level and pops C. We've fully committed to the left subtree before touching the right.",
    deepDiveText:
      "Stack state\n• Before: [C] — C on top\n• After visiting C: [F]\n\nDepth-first bias at work\n• C is A's direct child, yet it's visited 5th\n• DFS committed to B's full subtree (nodes 2–4) before touching C\n\nComparison\n• DFS so far: A → B → D → E → C (depth-prioritised)\n• BFS equivalent: A → B → C → D → E (level-prioritised)\n\nC reaches the top of the stack only after B's subtree is fully exhausted.",
    icon: 'RotateCcw',
  },
  {
    id: 'f',
    label: 'Visit F — Complete',
    description: 'DFS finishes — all 6 nodes visited',
    educationalText:
      'F is pushed and popped. All nodes visited. The complete DFS order is: A → B → D → E → C → F. The stack is empty — DFS is done.',
    deepDiveText:
      "Final traversal order\n• DFS: A → B → D → E → C → F\n• BFS: A → B → C → D → E → F\n\nDFS tree edges\nA–B, B–D, B–E, A–C, C–F\n\nComplexity summary\n• Time: O(V + E)\n• Space: O(V) for the stack\n\nDFS went deep left first — F is visited last even though it's only 2 hops from A via C.",
    icon: 'CheckCircle2',
    codeSnippets: {
      python:
        '# Recursive\ndef dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    order = [node]\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            order += dfs(graph, neighbor, visited)\n    return order\n\n# Iterative\ndef dfs_iter(graph, start):\n    visited, stack, order = set(), [start], []\n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            order.append(node)\n            stack.extend(\n                n for n in reversed(graph[node])\n                if n not in visited\n            )\n    return order',
      javascript:
        '// Recursive\nfunction dfs(graph, node, visited = new Set()) {\n  visited.add(node);\n  const order = [node];\n  for (const neighbor of graph[node]) {\n    if (!visited.has(neighbor)) {\n      order.push(...dfs(graph, neighbor, visited));\n    }\n  }\n  return order;\n}\n\n// Iterative\nfunction dfsIter(graph, start) {\n  const visited = new Set();\n  const stack = [start];\n  const order = [];\n  while (stack.length) {\n    const node = stack.pop();\n    if (!visited.has(node)) {\n      visited.add(node);\n      order.push(node);\n      stack.push(\n        ...[...graph[node]].reverse().filter(n => !visited.has(n))\n      );\n    }\n  }\n  return order;\n}',
      java: '// Recursive\nList<Integer> dfs(Map<Integer, List<Integer>> graph,\n                  int node, Set<Integer> visited) {\n    visited.add(node);\n    List<Integer> order = new ArrayList<>(List.of(node));\n    for (int neighbor : graph.get(node)) {\n        if (!visited.contains(neighbor)) {\n            order.addAll(dfs(graph, neighbor, visited));\n        }\n    }\n    return order;\n}\n\n// Iterative\nList<Integer> dfsIter(Map<Integer, List<Integer>> graph, int start) {\n    Set<Integer> visited = new HashSet<>();\n    Deque<Integer> stack = new ArrayDeque<>(List.of(start));\n    List<Integer> order = new ArrayList<>();\n    while (!stack.isEmpty()) {\n        int node = stack.pop();\n        if (!visited.contains(node)) {\n            visited.add(node);\n            order.add(node);\n            List<Integer> nbrs = graph.get(node);\n            for (int i = nbrs.size() - 1; i >= 0; i--)\n                if (!visited.contains(nbrs.get(i)))\n                    stack.push(nbrs.get(i));\n        }\n    }\n    return order;\n}',
    },
  },
  {
    id: 'practice',
    label: 'Most asked interview questions',
    description: 'Reinforce DFS with real interview problems',
    educationalText:
      'Apply DFS to these LeetCode problems — ordered by difficulty:\n\n🟢 Easy\n• #104  Maximum Depth of Binary Tree — Recursion = DFS naturally\n• #100  Same Tree — Compare trees with recursive DFS\n• #226  Invert Binary Tree — Swap children depth-first\n• #112  Path Sum — Explore every root-to-leaf path\n• #543  Diameter of Binary Tree — Track depth at each node\n\n🟡 Medium\n• #200  Number of Islands — DFS flood-fill each island\n• #695  Max Area of Island — DFS to count connected cells\n• #133  Clone Graph — DFS to deep-copy nodes recursively\n• #207  Course Schedule — DFS cycle detection (topological sort)\n• #417  Pacific Atlantic Water Flow — Reverse DFS from both oceans\n• #394  Decode String — DFS on nested bracket structure',
    deepDiveText:
      'Patterns to recognise\n\nTree / graph traversal\n• "Explore every path" → DFS / recursion\n• Flood-fill / connected components → DFS on a grid\n\nDirected graph problems\n• Cycle detection → DFS with 3-colour marking (white / grey / black)\n• Topological sort → DFS + post-order stack (#207 Course Schedule, #210)\n\nStructural problems\n• Nested structures (brackets, parentheses, directories) → DFS with a stack\n• "All possible paths" or "all combinations" → DFS + backtracking',
    icon: 'CheckCircle2',
  },
];
