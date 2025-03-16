const PUZZLE_SIZE = 9;
const BLOCK_SIZE = 3;
const BOARD_SIZE_IN_BLOCKS = 3;

export const verifyEligibility = (
  puzzle: (number | '')[], candidate: number, index: number
) => {
  const violations = [];
  const candidateX = index % PUZZLE_SIZE;
  const candidateY = Math.floor(index / PUZZLE_SIZE);
  // column check
  for (let j = 0; j < PUZZLE_SIZE; j++) {
    const elementIndex = candidateX + j * PUZZLE_SIZE;
    if (j !== candidateY && puzzle[elementIndex] === candidate) {
      violations.push('column');
      break;
    }
  }
  // row check
  for (let i = 0; i < PUZZLE_SIZE; i++) {
    const elementIndex = candidateY * PUZZLE_SIZE + i;
    if (i !== candidateX && puzzle[elementIndex] === candidate) {
      violations.push('row');
      break;
    }
  }
  // block check
  const blockX = Math.floor(index % PUZZLE_SIZE / BOARD_SIZE_IN_BLOCKS);
  const blockY = Math.floor(Math.floor(index / PUZZLE_SIZE) / BOARD_SIZE_IN_BLOCKS);
  const firstElementIndex = blockY * PUZZLE_SIZE * BLOCK_SIZE + blockX * BLOCK_SIZE;
  for (let k = 0; k < PUZZLE_SIZE; k++) {
    const elementX = k % BLOCK_SIZE;
    const elementY = Math.floor(k / BLOCK_SIZE);
    const elementIndex = firstElementIndex + elementY * PUZZLE_SIZE + elementX;
    if (elementIndex !== index && puzzle[elementIndex] === candidate) {
      violations.push('block');
      break;
    }
  }
  return violations;
};

export const generateCandidates = () => {
  return [...Array(PUZZLE_SIZE).keys()]
    .map(value => value + 1)
    .sort(() => Math.random() - 0.5);
}

export const generateBlock = (board: (number | '')[], blockIndex: number, candidateList: number[]) => {
  const blockX = blockIndex % BOARD_SIZE_IN_BLOCKS;
  const blockY = Math.floor(blockIndex / BOARD_SIZE_IN_BLOCKS);

  const block: number[] = [];
  for (let k = 0; k < 9; k++) {

    const numberX = blockX * BLOCK_SIZE + k % BLOCK_SIZE;
    const numberY = blockY * BLOCK_SIZE + Math.floor(k / BLOCK_SIZE);
    const numberIndex = numberY * PUZZLE_SIZE + numberX;

    const eligibleCandidateIndex = candidateList.findIndex(
      candidate => verifyEligibility(board, candidate, numberIndex).length === 0
    );
    if (eligibleCandidateIndex < 0) {
      k = 0;
      return -1;
    }

    block.push(candidateList[eligibleCandidateIndex]);
    candidateList.splice(eligibleCandidateIndex, 1);
  }
  return block;
};

export const integrateBlockToBoard = (board: (number | '')[], blockIndex: number, block: number[]) => {
  const blockX = blockIndex % BOARD_SIZE_IN_BLOCKS;
  const blockY = Math.floor(blockIndex / BOARD_SIZE_IN_BLOCKS);
  const firstElementIndex = blockY * PUZZLE_SIZE * BLOCK_SIZE + blockX * BLOCK_SIZE;

  block.forEach((number, index) => {
    const elementX = index % BLOCK_SIZE;
    const elementY = Math.floor(index / BLOCK_SIZE);
    const elementIndex = firstElementIndex + elementY * PUZZLE_SIZE + elementX;
    board[elementIndex] = number;
  });
};

const initBoard = () => Array(PUZZLE_SIZE * PUZZLE_SIZE).fill('');

export const generateBoard = (generateCandidates: () => number[]) => {
  let board = initBoard();
  let failedBlockGenerations = 0;
  for (let blockIndex = 0; blockIndex < 9; blockIndex++) {
    const candidates = generateCandidates();
    const block = generateBlock(board, blockIndex, candidates);
    if (block === -1) {
      blockIndex--;
      failedBlockGenerations++;
      if (failedBlockGenerations >= 3) {
        board = initBoard();
        blockIndex = -1;
      }
      continue;
    }
    integrateBlockToBoard(board, blockIndex, block);
    failedBlockGenerations = 0;
  }
  return board;
};

const generateSolution = () => {
  return generateBoard(generateCandidates);
}

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
