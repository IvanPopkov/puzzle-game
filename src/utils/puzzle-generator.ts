const PUZZLE_SIZE = 9;

export const verifyEligibility = (
  puzzle: (number | '')[], candidate: number, index: number
) => {
  const violations = [];
  const candidate_i = Math.floor(index / PUZZLE_SIZE);
  const candidate_j = index % PUZZLE_SIZE;
  // column check
  for (let i = 0; i < PUZZLE_SIZE; i++) {
    if (i !== candidate_i && puzzle[i * PUZZLE_SIZE + candidate_j] === candidate) {
      violations.push('column');
      break;
    }
  }
  // row check
  for (let j = 0; j < PUZZLE_SIZE; j++) {
    if (j !== candidate_j && puzzle[candidate_i * PUZZLE_SIZE + j] === candidate) {
      violations.push('row');
      break;
    }
  }
  return violations;
};

export const generateSolution = () => {
  const solution: number[] = Array(PUZZLE_SIZE * PUZZLE_SIZE).fill(0);
  for (let i = 0; i < PUZZLE_SIZE; i++) {
    const candidates = [...Array(PUZZLE_SIZE).keys()]
      .map(value => value + 1)
      .sort(() => Math.random() - 0.5);

    for (let j = 0; j < PUZZLE_SIZE; j++) {
      const index = i * PUZZLE_SIZE + j;
      const eligibleCandidateIndex = candidates.findIndex(
        candidate => verifyEligibility(solution, candidate, index).length === 0
      );
      if (eligibleCandidateIndex === -1) {
        i--;
        break;
      }
      solution[index] = candidates[eligibleCandidateIndex];
      candidates.splice(eligibleCandidateIndex, 1);
    }
  }
  return solution;
};

const generatePropositions = (puzzle: (number | '')[], index: number) => {
  return [...Array(PUZZLE_SIZE).keys()].map(val => val + 1).filter(val => verifyEligibility(puzzle, val, index).length === 0);
}

const isPuzzleSolvable = (puzzle: (number | '')[], removedIndexes: number[], indexToRemove: number) => {
  let solvable = false;
  for (const index of [...removedIndexes, indexToRemove]) {
    const propositions = generatePropositions(puzzle, index);
    if (propositions.length === 1) {
      solvable = true;
      break;
    }
  }
  return solvable;
}

const generatePuzzle = (solution: number[]) => {
  const removedIndexes: number[] = [];
  const puzzle: (number | '')[] = [...solution];
  const shuffledIndexes = [...Array(solution.length).keys()].sort(() => Math.random() - 0.5);

  for (const indexToRemove of shuffledIndexes) {
    const valueToRemove = puzzle[indexToRemove];
    removedIndexes.push(indexToRemove);
    puzzle[indexToRemove] = '';

    if (!isPuzzleSolvable(puzzle, removedIndexes, indexToRemove)) {
      puzzle[indexToRemove] = valueToRemove;
      break;
    }
  }
  return puzzle;
};

export const generateSudoku = () => {
  const solution = generateSolution();
  const puzzle = generatePuzzle(solution);

  return { puzzle };
};
