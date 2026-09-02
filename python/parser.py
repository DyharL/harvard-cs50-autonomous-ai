import re

class GrammarParser:
    def __init__(self):
        self.determiners = {"the", "a", "an"}
        self.nouns = {"robot", "algorithms", "computer", "scientist", "ai"}
        self.verbs = {"solved", "built", "designed", "ran"}

    def extract_noun_phrases(self, sentence: str):
        words = re.findall(r"\b\w+\b", sentence.lower())
        chunks = []
        i = 0
        while i < len(words):
            if words[i] in self.determiners and i + 1 < len(words) and words[i + 1] in self.nouns:
                chunks.append(f"{words[i]} {words[i+1]}")
                i += 2
            elif words[i] in self.nouns:
                chunks.append(words[i])
                i += 1
            else:
                i += 1
        return chunks
