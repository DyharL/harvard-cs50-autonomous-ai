#include <stdio.h>
#include <string.h>
#include <ctype.h>

void caesar_encrypt(char *dest, const char *src, int key) {
    int shift = ((key % 26) + 26) % 26;
    int len = strlen(src);
    for (int i = 0; i < len; i++) {
        if (isupper(src[i])) {
            dest[i] = 'A' + (src[i] - 'A' + shift) % 26;
        } else if (islower(src[i])) {
            dest[i] = 'a' + (src[i] - 'a' + shift) % 26;
        } else {
            dest[i] = src[i];
        }
    }
    dest[len] = '\0';
}

int main(void) {
    char out[128];
    caesar_encrypt(out, "Hello, World!", 13);
    printf("Ciphertext: %s\n", out);
    return 0;
}
