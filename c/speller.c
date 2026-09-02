#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <ctype.h>
#include <stdbool.h>

#define N 65536
#define LENGTH 45

typedef struct node {
    char word[LENGTH + 1];
    struct node *next;
} node;

node *table[N];
unsigned int word_count = 0;

unsigned int hash(const char *word) {
    unsigned long hash = 5381;
    int c;
    while ((c = tolower(*word++))) {
        hash = ((hash << 5) + hash) + c;
    }
    return hash % N;
}

bool load_word(const char *w) {
    unsigned int idx = hash(w);
    node *n = malloc(sizeof(node));
    if (!n) return false;
    strncpy(n->word, w, LENGTH);
    n->word[LENGTH] = '\0';
    n->next = table[idx];
    table[idx] = n;
    word_count++;
    return true;
}

bool check(const char *w) {
    unsigned int idx = hash(w);
    node *cursor = table[idx];
    while (cursor != NULL) {
        if (strcasecmp(cursor->word, w) == 0) return true;
        cursor = cursor->next;
    }
    return false;
}

void unload(void) {
    for (int i = 0; i < N; i++) {
        node *cursor = table[i];
        while (cursor != NULL) {
            node *tmp = cursor;
            cursor = cursor->next;
            free(tmp);
        }
        table[i] = NULL;
    }
}

int main(void) {
    load_word("algorithms");
    load_word("computer");
    load_word("science");
    printf("Check 'algorithms': %s\n", check("algorithms") ? "FOUND" : "MISSING");
    printf("Check 'missing': %s\n", check("missing") ? "FOUND" : "MISSING");
    unload();
    return 0;
}
