#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>

bool substitution_encrypt(char *dest, const char *src, const char *key) {
    if (strlen(key) != 26) return false;
    int len = strlen(src);
    for (int i = 0; i < len; i++) {
        if (isupper(src[i])) {
            dest[i] = toupper(key[src[i] - 'A']);
        } else if (islower(src[i])) {
            dest[i] = tolower(key[src[i] - 'a']);
        } else {
            dest[i] = src[i];
        }
    }
    dest[len] = '\0';
    return true;
}

int main(void) {
    char out[128];
    const char *key = "YTNSHKVEFXRBAUQZCLWDMIPGJO";
    substitution_encrypt(out, "HELLO", key);
    printf("Encrypted: %s\n", out);
    return 0;
}
