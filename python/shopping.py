import math

class KNNClassifier:
    def __init__(self, k=3):
        self.k = k
        self.train_data = []

    def fit(self, X, y):
        self.train_data = list(zip(X, y))

    def predict_one(self, features):
        distances = []
        for x, label in self.train_data:
            dist = math.sqrt(sum((a - b) ** 2 for a, b in zip(features, x)))
            distances.append((dist, label))
        distances.sort(key=lambda d: d[0])
        votes = [d[1] for d in distances[:self.k]]
        return 1 if votes.count(1) > votes.count(0) else 0

    def evaluate(self, X_test, y_test):
        tp = sum(1 for x, y in zip(X_test, y_test) if y == 1 and self.predict_one(x) == 1)
        fn = sum(1 for x, y in zip(X_test, y_test) if y == 1 and self.predict_one(x) == 0)
        tn = sum(1 for x, y in zip(X_test, y_test) if y == 0 and self.predict_one(x) == 0)
        fp = sum(1 for x, y in zip(X_test, y_test) if y == 0 and self.predict_one(x) == 1)
        sens = tp / (tp + fn) if (tp + fn) > 0 else 0
        spec = tn / (tn + fp) if (tn + fp) > 0 else 0
        return {"sensitivity": round(sens, 4), "specificity": round(spec, 4)}
