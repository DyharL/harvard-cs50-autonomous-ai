export interface DataPoint {
  features: number[];
  label: number; // 0 or 1
}

export interface ClassificationMetrics {
  accuracy: number;
  sensitivity: number; // True Positive Rate
  specificity: number; // True Negative Rate
}

export class KNNClassifier {
  private trainingData: DataPoint[] = [];
  private k: number;

  constructor(k: number = 3) {
    this.k = k;
  }

  public train(data: DataPoint[]): void {
    this.trainingData = data;
  }

  private distance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const diff = a[i] - b[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  public predict(features: number[]): number {
    if (this.trainingData.length === 0) {
      throw new Error('Model has not been trained');
    }

    const distances = this.trainingData.map(point => ({
      label: point.label,
      dist: this.distance(features, point.features)
    }));

    distances.sort((a, b) => a.dist - b.dist);
    const neighbors = distances.slice(0, this.k);

    const vote1 = neighbors.filter(n => n.label === 1).length;
    const vote0 = neighbors.length - vote1;

    return vote1 > vote0 ? 1 : 0;
  }

  public evaluate(testData: DataPoint[]): ClassificationMetrics {
    let tp = 0;
    let tn = 0;
    let fp = 0;
    let fn = 0;

    for (const item of testData) {
      const pred = this.predict(item.features);
      if (item.label === 1 && pred === 1) tp++;
      else if (item.label === 0 && pred === 0) tn++;
      else if (item.label === 0 && pred === 1) fp++;
      else if (item.label === 1 && pred === 0) fn++;
    }

    const total = testData.length;
    const actualPositives = tp + fn;
    const actualNegatives = tn + fp;

    return {
      accuracy: total > 0 ? Math.round(((tp + tn) / total) * 1000) / 1000 : 0,
      sensitivity: actualPositives > 0 ? Math.round((tp / actualPositives) * 1000) / 1000 : 0,
      specificity: actualNegatives > 0 ? Math.round((tn / actualNegatives) * 1000) / 1000 : 0
    };
  }
}
