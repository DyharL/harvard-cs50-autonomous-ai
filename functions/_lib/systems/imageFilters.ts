export interface RGBPixel {
  r: number;
  g: number;
  b: number;
}

export type PixelGrid = RGBPixel[][];

export function applyGrayscale(grid: PixelGrid): PixelGrid {
  return grid.map(row =>
    row.map(pixel => {
      const avg = Math.round((pixel.r + pixel.g + pixel.b) / 3);
      return { r: avg, g: avg, b: avg };
    })
  );
}

export function applySepia(grid: PixelGrid): PixelGrid {
  return grid.map(row =>
    row.map(p => {
      const sepiaR = Math.min(255, Math.round(0.393 * p.r + 0.769 * p.g + 0.189 * p.b));
      const sepiaG = Math.min(255, Math.round(0.349 * p.r + 0.686 * p.g + 0.168 * p.b));
      const sepiaB = Math.min(255, Math.round(0.272 * p.r + 0.534 * p.g + 0.131 * p.b));
      return { r: sepiaR, g: sepiaG, b: sepiaB };
    })
  );
}

export function applyReflect(grid: PixelGrid): PixelGrid {
  return grid.map(row => [...row].reverse());
}

export function applyBlur(grid: PixelGrid): PixelGrid {
  const height = grid.length;
  if (height === 0) return [];
  const width = grid[0].length;
  const output: PixelGrid = Array.from({ length: height }, () => Array(width).fill({ r: 0, g: 0, b: 0 }));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sumR = 0, sumG = 0, sumB = 0, count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            sumR += grid[ny][nx].r;
            sumG += grid[ny][nx].g;
            sumB += grid[ny][nx].b;
            count++;
          }
        }
      }
      output[y][x] = {
        r: Math.round(sumR / count),
        g: Math.round(sumG / count),
        b: Math.round(sumB / count)
      };
    }
  }
  return output;
}

export function applySobel(grid: PixelGrid): PixelGrid {
  const height = grid.length;
  if (height === 0) return [];
  const width = grid[0].length;
  const output: PixelGrid = Array.from({ length: height }, () => Array(width).fill({ r: 0, g: 0, b: 0 }));

  const Gx = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  const Gy = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let gxR = 0, gxG = 0, gxB = 0;
      let gyR = 0, gyG = 0, gyB = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          const weightX = Gx[dy + 1][dx + 1];
          const weightY = Gy[dy + 1][dx + 1];

          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const p = grid[ny][nx];
            gxR += weightX * p.r;
            gxG += weightX * p.g;
            gxB += weightX * p.b;

            gyR += weightY * p.r;
            gyG += weightY * p.g;
            gyB += weightY * p.b;
          }
        }
      }

      const magR = Math.min(255, Math.round(Math.sqrt(gxR * gxR + gyR * gyR)));
      const magG = Math.min(255, Math.round(Math.sqrt(gxG * gxG + gyG * gyG)));
      const magB = Math.min(255, Math.round(Math.sqrt(gxB * gxB + gyB * gyB)));

      output[y][x] = { r: magR, g: magG, b: magB };
    }
  }
  return output;
}
