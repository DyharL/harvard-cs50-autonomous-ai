import unittest
from dna import match_dna
from degrees import shortest_path_bfs
from tictactoe import minimax, initial_state
from logic import Symbol, And, Implication, model_check
from minesweeper import MinesweeperAI
from pagerank import iterate_pagerank
from heredity import joint_probability
from crossword import CrosswordCSP
from shopping import KNNClassifier
from nim import Nim, QLearningAgent
from traffic import convolve_2d, max_pool_2d
from parser import GrammarParser
from attention import scaled_dot_product_attention

class TestAppliedAI(unittest.TestCase):
    def test_dna(self):
        db = [{"name": "Alice", "AGATC": 2}]
        self.assertEqual(match_dna("AGATCAGATC", db), "Alice")

    def test_degrees(self):
        graph = {"A": [("B", "E1")], "B": [("C", "E2")]}
        path = shortest_path_bfs(graph, "A", "C")
        self.assertIsNotNone(path)
        self.assertEqual(len(path), 3)

    def test_minimax(self):
        b = initial_state()
        move = minimax(b)
        self.assertIsNotNone(move)

    def test_logic(self):
        a, b = Symbol("A"), Symbol("B")
        kb = And(a, Implication(a, b))
        self.assertTrue(model_check(kb, b))

    def test_minesweeper(self):
        ai = MinesweeperAI(4, 4)
        ai.add_knowledge((0, 0), 0)
        self.assertIn((0, 1), ai.safes)

    def test_pagerank(self):
        c = {"1": ["2"], "2": ["1"]}
        r = iterate_pagerank(c)
        self.assertAlmostEqual(r["1"], 0.5, places=2)

    def test_heredity(self):
        people = {"Alice": {"mother": None, "father": None}}
        p = joint_probability(people, set(), set(), set())
        self.assertTrue(0 < p < 1)

    def test_crossword(self):
        csp = CrosswordCSP([("V1", 3)], ["CAT", "DOGS"])
        sol = csp.solve()
        self.assertEqual(sol.get("V1"), "CAT")

    def test_knn(self):
        knn = KNNClassifier(1)
        knn.fit([[1, 1], [9, 9]], [0, 1])
        self.assertEqual(knn.predict_one([1.1, 1.2]), 0)

    def test_nim(self):
        agent = QLearningAgent()
        agent.update_q([1, 2], (0, 1), 1.0, 0.0)
        self.assertGreater(agent.get_q([1, 2], (0, 1)), 0.0)

    def test_traffic(self):
        m = [[1, 2], [3, 4]]
        k = [[1, 0], [0, 1]]
        conv = convolve_2d(m, k)
        self.assertEqual(len(conv), 1)

    def test_parser(self):
        p = GrammarParser()
        chunks = p.extract_noun_phrases("the robot solved algorithms")
        self.assertIn("the robot", chunks)

    def test_attention(self):
        Q = [[1.0, 0.0], [0.0, 1.0]]
        K = [[1.0, 0.0], [0.0, 1.0]]
        V = [[1.0, 2.0], [3.0, 4.0]]
        res = scaled_dot_product_attention(Q, K, V, 2)
        self.assertEqual(len(res["weights"]), 2)

if __name__ == "__main__":
    unittest.main()
