#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <ctype.h>

bool check_luhn(const char *num) {
    int sum = 0;
    bool double_digit = false;
    int len = strlen(num);

    for (int i = len - 1; i >= 0; i--) {
        if (!isdigit(num[i])) return false;
        int d = num[i] - '0';
        if (double_digit) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        double_digit = !double_digit;
    }
    return (sum % 10 == 0);
}

const char *get_brand(const char *num) {
    int len = strlen(num);
    if (!check_luhn(num)) return "INVALID";

    if (len == 15 && num[0] == '3' && (num[1] == '4' || num[1] == '7')) {
        return "AMEX";
    }
    if (len == 16 && num[0] == '5' && num[1] >= '1' && num[1] <= '5') {
        return "MASTERCARD";
    }
    if ((len == 13 || len == 16 || len == 19) && num[0] == '4') {
        return "VISA";
    }
    return "INVALID";
}

int main(int argc, char *argv[]) {
    const char *test_card = argc > 1 ? argv[1] : "4000001234567899";
    printf("Card: %s -> %s\n", test_card, get_brand(test_card));
    return 0;
}
