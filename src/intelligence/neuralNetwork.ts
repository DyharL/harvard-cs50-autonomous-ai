export type Matrix2D = number[][];

export function relu(x: number): number {
  return Math.max(0, x);
}

export function softmax(vector: number[]): number[] {
  const maxVal = Math.max(...vector);
  const exps = vector.map(x => Math.exp(x - maxVal));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sumExps);
}

export function convolve2D(input: Matrix2D, kernel: Matrix2D): Matrix2D {
  const inH = input.length;
  const inW = input[0].length;
  const kH = kernel.length;
  const kW = kernel[0].length;

  const outH = inH - kH + 1;
  const outW = inW - kW + 1;
  const output: Matrix2D = Array.from({ length: outH }, () => Array(outW).fill(0));

  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      let sum = 0;
      for (let ky = 0; ky < kH; ky++) {
        for (let kx = 0; kx < kW; kx++) {
          sum += input[y + ky][x + kx] * kernel[ky][kx];
        }
      }
      output[y][x] = relu(sum);
    }
  }

  return output;
}

export function maxPool2D(input: Matrix2D, poolSize: number = 2): Matrix2D {
  const inH = input.length;
  const inW = input[0].length;
  const outH = Math.floor(inH / poolSize);
  const outW = Math.floor(inW / poolSize);

  const output: Matrix2D = Array.from({ length: outH }, () => Array(outW).fill(0));

  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      let maxVal = -Infinity;
      for (let py = 0; py < poolSize; py++) {
        for (let px = 0; px < poolSize; px++) {
          const val = input[y * poolSize + py][x * poolSize + px];
          if (val > maxVal) maxVal = val;
        }
      }
      output[y][x] = maxVal;
    }
  }

  return output;
}

export function denseLayer(input: number[], weights: Matrix2D, biases: number[]): number[] {
  // weights has shape [outputDim][inputDim]
  const output: number[] = [];
  for (let o = 0; o < weights.length; o++) {
    let sum = biases[o];
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * weights[o][i];
    }
    output.push(sum);
  }
  return softmax(output);
}
