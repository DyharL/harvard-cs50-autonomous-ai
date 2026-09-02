#include <stdio.h>
#include <stdbool.h>

#define MAX 9

int preferences[MAX][MAX];
bool locked[MAX][MAX];

typedef struct {
    int winner;
    int loser;
} pair;

pair pairs[MAX * (MAX - 1) / 2];
int pair_count = 0;
int candidate_count = 3;

bool has_cycle(int current, int target) {
    if (current == target) return true;
    for (int i = 0; i < candidate_count; i++) {
        if (locked[current][i]) {
            if (has_cycle(i, target)) return true;
        }
    }
    return false;
}

void lock_pairs(void) {
    for (int i = 0; i < pair_count; i++) {
        if (!has_cycle(pairs[i].loser, pairs[i].winner)) {
            locked[pairs[i].winner][pairs[i].loser] = true;
        }
    }
}

int print_winner(void) {
    for (int col = 0; col < candidate_count; col++) {
        bool has_incoming = false;
        for (int row = 0; row < candidate_count; row++) {
            if (locked[row][col]) {
                has_incoming = true;
                break;
            }
        }
        if (!has_incoming) return col;
    }
    return 0;
}

int main(void) {
    pairs[0] = (pair){.winner = 0, .loser = 1};
    pairs[1] = (pair){.winner = 1, .loser = 2};
    pairs[2] = (pair){.winner = 2, .loser = 0};
    pair_count = 3;
    lock_pairs();
    printf("Condorcet DAG Winner Index: %d\n", print_winner());
    return 0;
}
