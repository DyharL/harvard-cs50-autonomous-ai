#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

#define BLOCK_SIZE 512

typedef uint8_t BYTE;

bool is_jpeg_header(BYTE buffer[BLOCK_SIZE]) {
    return buffer[0] == 0xff &&
           buffer[1] == 0xd8 &&
           buffer[2] == 0xff &&
           (buffer[3] & 0xf0) == 0xe0;
}

int main(void) {
    BYTE block[BLOCK_SIZE] = {0xff, 0xd8, 0xff, 0xe0};
    if (is_jpeg_header(block)) {
        printf("Detected valid JPEG signature in 512-byte sector.\n");
    }
    return 0;
}
