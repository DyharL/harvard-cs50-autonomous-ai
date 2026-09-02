PROBS = {
    "gene": {2: 0.01, 1: 0.03, 0: 0.96},
    "trait": {
        2: {True: 0.65, False: 0.35},
        1: {True: 0.56, False: 0.44},
        0: {True: 0.01, False: 0.99}
    },
    "mutation": 0.01
}

def joint_probability(people, one_gene, two_genes, have_trait):
    joint = 1.0
    for name, person in people.items():
        genes = 2 if name in two_genes else (1 if name in one_gene else 0)
        trait = name in have_trait

        if not person["mother"] and not person["father"]:
            gene_prob = PROBS["gene"][genes]
        else:
            def pass_prob(parent):
                p_genes = 2 if parent in two_genes else (1 if parent in one_gene else 0)
                if p_genes == 2:
                    return 1.0 - PROBS["mutation"]
                elif p_genes == 1:
                    return 0.5
                return PROBS["mutation"]

            p_m = pass_prob(person["mother"])
            p_f = pass_prob(person["father"])
            if genes == 2:
                gene_prob = p_m * p_f
            elif genes == 1:
                gene_prob = p_m * (1 - p_f) + (1 - p_m) * p_f
            else:
                gene_prob = (1 - p_m) * (1 - p_f)

        trait_prob = PROBS["trait"][genes][trait]
        joint *= gene_prob * trait_prob
    return joint
