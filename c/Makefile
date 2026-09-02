CC = clang
CFLAGS = -Wall -Werror -Wextra -std=c11 -O2

SRCS = credit.c readability.c caesar.c substitution.c tideman.c filter.c recover.c speller.c
BINS = $(SRCS:.c=)

all: $(BINS)

%: %.c
	$(CC) $(CFLAGS) $< -o $@ -lm

clean:
	rm -f $(BINS)
