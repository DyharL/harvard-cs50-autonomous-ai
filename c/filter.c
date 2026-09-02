#include <stdio.h>
#include <stdint.h>
#include <math.h>

typedef struct {
    uint8_t r;
    uint8_t g;
    uint8_t b;
} RGBPIXEL;

void grayscale(int height, int width, RGBPIXEL image[height][width]) {
    for (int i = 0; i < height; i++) {
        for (int j = 0; j < width; j++) {
            uint8_t avg = (uint8_t)round((image[i][j].r + image[i][j].g + image[i][j].b) / 3.0);
            image[i][j].r = avg;
            image[i][j].g = avg;
            image[i][j].b = avg;
        }
    }
}

void sobel_edges(int height, int width, RGBPIXEL image[height][width], RGBPIXEL output[height][width]) {
    int Gx[3][3] = {{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}};
    int Gy[3][3] = {{-1, -2, -1}, {0, 0, 0}, {1, 2, 1}};

    for (int i = 0; i < height; i++) {
        for (int j = 0; j < width; j++) {
            float gx_r = 0, gx_g = 0, gx_b = 0;
            float gy_r = 0, gy_g = 0, gy_b = 0;

            for (int di = -1; di <= 1; di++) {
                for (int dj = -1; dj <= 1; dj++) {
                    int ni = i + di;
                    int nj = j + dj;
                    if (ni >= 0 && ni < height && nj >= 0 && nj < width) {
                        int wx = Gx[di + 1][dj + 1];
                        int wy = Gy[di + 1][dj + 1];
                        gx_r += wx * image[ni][nj].r;
                        gx_g += wx * image[ni][nj].g;
                        gx_b += wx * image[ni][nj].b;
                        gy_r += wy * image[ni][nj].r;
                        gy_g += wy * image[ni][nj].g;
                        gy_b += wy * image[ni][nj].b;
                    }
                }
            }
            int r = (int)round(sqrt(gx_r * gx_r + gy_r * gy_r));
            int g = (int)round(sqrt(gx_g * gx_g + gy_g * gy_g));
            int b = (int)round(sqrt(gx_b * gx_b + gy_b * gy_b));
            output[i][j].r = r > 255 ? 255 : r;
            output[i][j].g = g > 255 ? 255 : g;
            output[i][j].b = b > 255 ? 255 : b;
        }
    }
}

int main(void) {
    RGBPIXEL img[2][2] = {{{100, 150, 200}, {50, 50, 50}}, {{255, 0, 0}, {0, 255, 0}}};
    RGBPIXEL out[2][2];
    sobel_edges(2, 2, img, out);
    printf("Sobel filtered pixel (0,0): %d\n", out[0][0].r);
    return 0;
}
