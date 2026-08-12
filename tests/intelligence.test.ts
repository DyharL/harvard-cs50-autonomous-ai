import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { findShortestPathBfs, GraphAdjacency } from '../src/intelligence/shortestPathBfs.js';
import { minimax, BoardState } from '../src/intelligence/minimaxGame.js';
import { SymbolSentence, AndSentence, ImplicationSentence, modelCheck } from '../src/intelligence/propositionalLogic.js';
import { MinesweeperAI } from '../src/intelligence/minesweeperAgent.js';
import { samplePageRank, iteratePageRank } from '../src/intelligence/pagerankMarkov.js';
import { computeJointProbability, PersonData } from '../src/intelligence/bayesianHeredity.js';
import { CrosswordCSP, Variable } from '../src/intelligence/crosswordCsp.js';
import { KNNClassifier } from '../src/intelligence/nearestNeighbors.js';
import { NimGame, QLearningAgent } from '../src/intelligence/reinforcementNim.js';
import { convolve2D, maxPool2D, denseLayer } from '../src/intelligence/neuralNetwork.js';
import { SimpleGrammarParser } from '../src/intelligence/grammarParser.js';
import { ScaledDotProductAttention, predictMaskedToken } from '../src/intelligence/transformerAttention.js';

describe('Artificial Intelligence Systems (Modules 10 - 21)', () => {
  it('10. Shortest Path BFS: traverses graph finding optimal path', () => {
    const graph: GraphAdjacency = new Map();
    graph.set('A', [{ target: 'B', relation: 'Edge1' }]);
    graph.set('B', [{ target: 'C', relation: 'Edge2' }]);
    graph.set('C', []);

    const path = findShortestPathBfs(graph, 'A', 'C');
    assert.ok(path !== null);
    assert.equal(path.length, 3);
    assert.equal(path[0].node, 'A');
    assert.equal(path[2].node, 'C');
  });

  it('11. Minimax Alpha-Beta: blocks opponent winning move in Tic-Tac-Toe', () => {
    // Board where X has 2 in a row and O must block at index 2
    // [ 'X', 'X', null,
    //   'O', null, null,
    //   null, null, null ]
    const board: BoardState = [
      'X', 'X', null,
      'O', null, null,
      null, null, null
    ];
    // O's turn
    const move = minimax(board);
    assert.equal(move.index, 2);
  });

  it('12. Propositional Logic: model checks logical entailment', () => {
    const A = new SymbolSentence('A');
    const B = new SymbolSentence('B');
    // KB: A and (A -> B)
    const kb = new AndSentence([A, new ImplicationSentence(A, B)]);
    // Query: B
    const entails = modelCheck(kb, B);
    assert.equal(entails, true);
  });

  it('13. Minesweeper AI: infers safe cells and mines logically', () => {
    const ai = new MinesweeperAI(4, 4);
    // Move at (0, 0) with count 0 -> all adjacent cells must be safe
    ai.addKnowledge([0, 0], 0);
    assert.ok(ai.safes.has('0,1'));
    assert.ok(ai.safes.has('1,0'));
    assert.ok(ai.safes.has('1,1'));

    const safeMove = ai.makeSafeMove();
    assert.ok(safeMove !== null);
  });

  it('14. PageRank: converges iteratively and via random sampling', () => {
    const corpus = {
      '1': ['2'],
      '2': ['1', '3'],
      '3': ['1']
    };
    const iterated = iteratePageRank(corpus);
    assert.ok(iterated['1'] > 0);
    assert.ok(iterated['2'] > 0);
    assert.ok(iterated['3'] > 0);

    const sampled = samplePageRank(corpus, 0.85, 2000);
    assert.ok(sampled['1'] > 0.2);
  });

  it('15. Bayesian Heredity: computes joint probability distribution', () => {
    const people: Record<string, PersonData> = {
      Harry: { name: 'Harry', mother: 'Lily', father: 'James', trait: null },
      James: { name: 'James', mother: null, father: null, trait: true },
      Lily: { name: 'Lily', mother: null, father: null, trait: false }
    };
    const oneGene = new Set(['Harry']);
    const twoGenes = new Set(['James']);
    const haveTrait = new Set(['James']);

    const prob = computeJointProbability(people, oneGene, twoGenes, haveTrait);
    assert.ok(prob > 0 && prob < 1);
  });

  it('16. Crossword CSP: solves grid satisfaction with AC-3 and backtracking', () => {
    const variables: Variable[] = [
      { id: 'V1', row: 0, col: 0, direction: 'across', length: 3 },
      { id: 'V2', row: 0, col: 0, direction: 'down', length: 3 }
    ];
    const words = ['CAT', 'CAR', 'COW'];
    const csp = new CrosswordCSP(variables, words);
    const solution = csp.solve();
    assert.ok(solution !== null);
    assert.equal(solution.get('V1')?.[0], solution.get('V2')?.[0]);
  });

  it('17. k-NN Classifier: evaluates purchase intent metrics', () => {
    const classifier = new KNNClassifier(3);
    classifier.train([
      { features: [1, 2], label: 0 },
      { features: [2, 3], label: 0 },
      { features: [8, 9], label: 1 },
      { features: [9, 10], label: 1 }
    ]);
    const pred = classifier.predict([8.5, 9.5]);
    assert.equal(pred, 1);

    const metrics = classifier.evaluate([
      { features: [1.5, 2.5], label: 0 },
      { features: [8.2, 9.1], label: 1 }
    ]);
    assert.equal(metrics.accuracy, 1);
  });

  it('18. Nim Q-Learning: trains reinforcement agent with value updates', () => {
    const agent = new QLearningAgent();
    agent.train(50);
    assert.ok(agent.qTable.size > 0);

    const game = new NimGame([1, 2]);
    const action = agent.chooseAction([1, 2], game.getAvailableActions(), 0);
    assert.ok(action.length === 2);
  });

  it('19. Neural Network: performs 2D convolution, pooling, and dense forward pass', () => {
    const input = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const kernel = [
      [1, 0],
      [0, 1]
    ];
    const conv = convolve2D(input, kernel);
    assert.equal(conv.length, 2);
    assert.equal(conv[0].length, 2);

    const pooled = maxPool2D(conv, 2);
    assert.equal(pooled.length, 1);

    const dense = denseLayer([1, 2], [[0.5, -0.5], [-0.5, 0.5]], [0, 0]);
    assert.equal(dense.length, 2);
    assert.ok(Math.abs(dense[0] + dense[1] - 1.0) < 0.001);
  });

  it('20. Grammar Parser: extracts syntax tree and noun phrase chunks', () => {
    const parser = new SimpleGrammarParser();
    const tree = parser.parse('the clever robot solved algorithms');
    assert.ok(tree !== null);
    assert.equal(tree.label, 'S');

    const nounPhrases = parser.extractNounPhrases(tree);
    assert.ok(nounPhrases.includes('the clever robot'));
  });

  it('21. Transformer Attention: computes scaled dot-product attention weights', () => {
    const attention = new ScaledDotProductAttention(2);
    const Q = [[1, 0], [0, 1]];
    const K = [[1, 0], [0, 1]];
    const V = [[1, 2], [3, 4]];

    const result = attention.compute(Q, K, V);
    assert.equal(result.weights.length, 2);
    assert.equal(result.contextVectors.length, 2);

    const predictions = predictMaskedToken(['the', 'mask', 'sat'], 1, { cat: 10, dog: 5 });
    assert.equal(predictions[0].token, 'cat');
  });
});
