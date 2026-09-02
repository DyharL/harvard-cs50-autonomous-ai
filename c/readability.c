#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <math.h>
#include <stdbool.h>

int compute_coleman_liau(const char *text) {
    int letters = 0;
    int words = 0;
    int sentences = 0;
    int len = strlen(text);
    bool in_word = false;

    for (int i = 0; i < len; i++) {
        if (isalpha(text[i])) {
            letters++;
            if (!in_word) {
                in_word = true;
                words++;
            }
        } else if (isspace(text[i])) {
            in_word = false;
        } else if (text[i] == '.' || text[i] == '!' || text[i] == '?') {
            sentences++;
        }
    }

    if (words == 0) return 0;
    float L = ((float)letters / words) * 100.0f;
    float S = ((float)sentences / words) * 100.0f;
    return (int)roundf(0.0588f * L - 0.296f * S - 15.8f);
}

int main(void) {
    const char *sample = "Alice was beginning to get very tired of sitting by her sister on the bank.";
    int grade = compute_coleman_liau(sample);
    printf("Grade: %d\n", grade);
    return 0;
}
