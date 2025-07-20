import {isSudokuValid} from "./sudoku-validity-check";
import {SUDOKU_GRID_SIZE} from "./sudoku.constants.ts";
import {solveSudoku} from "./sudoku-solver.ts";

const BLOCK_SIZE = 3;
const BOARD_SIZE_IN_BLOCKS = 3;


export const generateCandidatesStrategy = () => {
  return [...Array(SUDOKU_GRID_SIZE).keys()]
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
    const numberIndex = numberY * SUDOKU_GRID_SIZE + numberX;

    const eligibleCandidateIndex = candidateList.findIndex(
      candidate => validateSudoku(board, candidate, numberIndex)
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

export const insertBlockIntoBoard = (board: (number | '')[], blockIndex: number, block: number[]) => {
  const blockX = blockIndex % BOARD_SIZE_IN_BLOCKS;
  const blockY = Math.floor(blockIndex / BOARD_SIZE_IN_BLOCKS);
  const firstElementIndex = blockY * SUDOKU_GRID_SIZE * BLOCK_SIZE + blockX * BLOCK_SIZE;

  block.forEach((number, index) => {
    const elementX = index % BLOCK_SIZE;
    const elementY = Math.floor(index / BLOCK_SIZE);
    const elementIndex = firstElementIndex + elementY * SUDOKU_GRID_SIZE + elementX;
    board[elementIndex] = number;
  });
};

const initBoard = () => Array(SUDOKU_GRID_SIZE * SUDOKU_GRID_SIZE).fill('');

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
    insertBlockIntoBoard(board, blockIndex, block);
    failedBlockGenerations = 0;
  }
  return board;
};

const generatePuzzle = (solution: number[]) => {
  const puzzle: number[] = [...solution];
  const shuffledIndexes = [...Array(solution.length).keys()].sort(() => Math.random() - 0.5);

  for (const indexToRemove of shuffledIndexes) {
    const valueToRemove = puzzle[indexToRemove];
    puzzle[indexToRemove] = 0;

    if (solveSudoku(puzzle).length !== 1) {
      puzzle[indexToRemove] = valueToRemove;
      break;
    }
  }
  return puzzle;
};

export const generateSudoku = () => {
  const solution = generateBoard(generateCandidatesStrategy)
  const puzzle = generatePuzzle(solution);

  return { puzzle };
};

const validateSudoku = (puzzle: (number | '')[], candidate: number, index: number): boolean => {
  const boardToVerify = [...puzzle];
  boardToVerify[index] = candidate;
  const filteredBoard = boardToVerify.map(el => el === '' ? 0 : el);

  return isSudokuValid(filteredBoard);
};
