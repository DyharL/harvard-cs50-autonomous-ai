def longest_match(sequence: str, subsequence: str) -> int:
    longest_run = 0
    sub_len = len(subsequence)
    seq_len = len(sequence)

    for i in range(seq_len):
        count = 0
        while sequence[i + count * sub_len : i + (count + 1) * sub_len] == subsequence:
            count += 1
        longest_run = max(longest_run, count)

    return longest_run


def match_dna(dna_sequence: str, database: list[dict]) -> str:
    if not database:
        return "No match"
    str_keys = [k for k in database[0].keys() if k != "name"]
    sample_profile = {str_name: longest_match(dna_sequence, str_name) for str_name in str_keys}

    for person in database:
        if all(int(person[k]) == sample_profile[k] for k in str_keys):
            return person["name"]
    return "No match"
