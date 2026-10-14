# Harvard CS50x & CS50AI Algorithms Suite

Implementations of the 21 computer science algorithms and autonomous artificial intelligence decision systems from Harvard's CS50x and CS50AI curricula.

Contains canonical source implementations in **C** (`c/`), **Python** (`python/`), and an edge interactive playground.

Live Interactive Showcase: [https://applied-ai-algorithms.pages.dev](https://applied-ai-algorithms.pages.dev)

---

## 🏛️ System Architecture & Catalog

### Section 1: Foundational Systems & Memory Architecture (Modules 01–09)

| # | Module | Core Mechanism | Mathematical Focus | Time Complexity |
|---|---|---|---|---|
| 01 | **Luhn Validator** | Checksum verification | Card number validity modulo 10 & IIN range detection | $O(N)$ |
| 02 | **Readability Analyzer** | Coleman-Liau metric | $CLI = 0.0588 L - 0.296 S - 15.8$ reading grade formula | $O(N)$ |
| 03 | **Symmetric Ciphers** | Cryptographic shifts | Caesar modulo 26 shift & substitution bijective mapping | $O(N)$ |
| 04 | **Tideman Voting** | Ranked pairs resolution | Directed acyclic graph (DAG) cycle prevention | $O(V^2 + E)$ |
| 05 | **Image Convolution Filters** | 2D spatial kernels | Sobel gradient edge detection ($\sqrt{G_x^2 + G_y^2}$) & box blur | $O(W \times H \times K^2)$ |
| 06 | **Forensic JPEG Carver** | Binary signature search | 512-byte sector memory dump reconstruction | $O(N)$ |
| 07 | **High-Speed Hash Dictionary** | Key-value store | `djb2` hash distribution with separate chaining | $O(1)$ average |
| 08 | **DNA Profiler** | Forensic genetics | Short Tandem Repeat (STR) maximum consecutive frequency | $O(N \times M)$ |
| 09 | **Finance Ledger** | Stock portfolio tracking | Real-time equity valuation, order execution & PnL reporting | $O(1)$ |

---

### Section 2: Autonomous AI & Machine Learning Systems (Modules 10–21)

| # | Module | Algorithmic Mechanism | Domain | Convergence / Bound |
|---|---|---|---|---|
| 10 | **Degrees Shortest Path** | Breadth-First Search (BFS) | Graph Search | Optimal shortest path |
| 11 | **Minimax Game Engine** | Alpha-Beta Pruning | Adversarial Search | Optimal Nash equilibrium |
| 12 | **Propositional Logic Engine** | Model checking algorithm | Knowledge & Logic | Truth-table entailment |
| 13 | **Minesweeper Agent** | Subset sentence inference | Knowledge & Logic | Deterministic deduction |
| 14 | **PageRank Markov Engine** | Random surfer & algebraic iteration | Markov Decision Process | Stationary distribution |
| 15 | **Bayesian Heredity** | Joint probability distribution | Bayesian Networks | Exact joint probability |
| 16 | **Crossword CSP** | AC-3 Arc Consistency & MRV Backtracking | Constraint Satisfaction | Domain reduction & backtrack |
| 17 | **k-Nearest Neighbors** | Euclidean metric distance | Classification | Sensitivity & Specificity |
| 18 | **Nim Q-Learning** | Bellman temporal difference update | Reinforcement Learning | $Q(s,a) \to Q^*(s,a)$ |
| 19 | **Convolutional Neural Network** | 2D Convolution, Max-Pool & Softmax | Deep Learning | Forward feedforward pass |
| 20 | **Grammar Parser** | Context-Free Grammar syntax parser | NLP | Noun phrase chunk extraction |
| 21 | **Transformer Self-Attention** | Scaled Dot-Product Attention | Transformers | $\text{Softmax}(QK^T / \sqrt{d_k})V$ |

---

## 🚀 Quick Start

### 1. Requirements
- Node.js >= 22.0.0
- npm >= 10.0.0

### 2. Installation
```bash
git clone https://github.com/DyharL/applied-ai-algorithms.git
cd applied-ai-algorithms
npm install
```

### 3. Running Unit Tests
All 21 modules are verified through Node.js's native test runner (`node:test` and `node:assert/strict`) via `tsx`:
```bash
npm test
```

### 4. Running the Local Server & Playground
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the interactive developer playground.

---

## 🧪 Test Execution Summary

```
▶ Artificial Intelligence Systems (Modules 10 - 21)
  ✔ 10. Shortest Path BFS: traverses graph finding optimal path
  ✔ 11. Minimax Alpha-Beta: blocks opponent winning move in Tic-Tac-Toe
  ✔ 12. Propositional Logic: model checks logical entailment
  ✔ 13. Minesweeper AI: infers safe cells and mines logically
  ✔ 14. PageRank: converges iteratively and via random sampling
  ✔ 15. Bayesian Heredity: computes joint probability distribution
  ✔ 16. Crossword CSP: solves grid satisfaction with AC-3 and backtracking
  ✔ 17. k-NN Classifier: evaluates purchase intent metrics
  ✔ 18. Nim Q-Learning: trains reinforcement agent with value updates
  ✔ 19. Neural Network: performs 2D convolution, pooling, and dense forward pass
  ✔ 20. Grammar Parser: extracts syntax tree and noun phrase chunks
  ✔ 21. Transformer Attention: computes scaled dot-product attention weights
▶ Systems Algorithms (Modules 01 - 09)
  ✔ 01. Luhn Validator: validates Visa, Amex, Mastercard and rejects invalid cards
  ✔ 02. Readability Analyzer: computes Coleman-Liau grade levels accurately
  ✔ 03. Ciphers: executes Caesar shift and substitution mappings
  ✔ 04. Tideman Voting: resolves Condorcet winner without cycles
  ✔ 05. Image Filters: applies grayscale, sepia, reflect, blur and Sobel kernels
  ✔ 06. JPEG Carver: recovers contiguous images from raw 512-byte blocks
  ✔ 07. Hash Dictionary: loads words, checks containment and calculates load factor
  ✔ 08. DNA Profiler: computes maximum consecutive STR count and matches profile
  ✔ 09. Finance Ledger: handles equity balance, orders and portfolio valuation

ℹ tests 21
ℹ suites 2
ℹ pass 21
ℹ fail 0
```

---

## 📄 License
Licensed under the [MIT License](LICENSE). Copyright (c) 2025-2026 DyharL.
