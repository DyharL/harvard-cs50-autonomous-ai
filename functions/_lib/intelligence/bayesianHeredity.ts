export interface PersonData {
  name: string;
  mother: string | null;
  father: string | null;
  trait: boolean | null;
}

export const PROBS = {
  // Unconditional probabilities for having gene copies
  gene: {
    2: 0.01,
    1: 0.03,
    0: 0.96
  },
  trait: {
    // Probability of trait given number of gene copies
    2: { true: 0.65, false: 0.35 },
    1: { true: 0.56, false: 0.44 },
    0: { true: 0.01, false: 0.99 }
  },
  // Mutation probability
  mutation: 0.01
};

export function computeJointProbability(
  people: Record<string, PersonData>,
  oneGene: Set<string>,
  twoGenes: Set<string>,
  haveTrait: Set<string>
): number {
  let jointProb = 1.0;

  for (const [name, person] of Object.entries(people)) {
    const geneCopies = twoGenes.has(name) ? 2 : oneGene.has(name) ? 1 : 0;
    const hasTrait = haveTrait.has(name);

    let geneProb = 0;

    if (!person.mother && !person.father) {
      geneProb = PROBS.gene[geneCopies as 0 | 1 | 2];
    } else {
      // Calculate probability of passing gene from each parent
      const getPassProb = (parentName: string): number => {
        const parentCopies = twoGenes.has(parentName) ? 2 : oneGene.has(parentName) ? 1 : 0;
        if (parentCopies === 2) return 1 - PROBS.mutation;
        if (parentCopies === 1) return 0.5;
        return PROBS.mutation;
      };

      const pFromMother = getPassProb(person.mother!);
      const pFromFather = getPassProb(person.father!);

      if (geneCopies === 2) {
        geneProb = pFromMother * pFromFather;
      } else if (geneCopies === 1) {
        geneProb = pFromMother * (1 - pFromFather) + (1 - pFromMother) * pFromFather;
      } else {
        geneProb = (1 - pFromMother) * (1 - pFromFather);
      }
    }

    const traitProb = PROBS.trait[geneCopies as 0 | 1 | 2][hasTrait ? 'true' : 'false'];
    jointProb *= geneProb * traitProb;
  }

  return jointProb;
}
