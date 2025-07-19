import {isSudokuValid} from "./sudoku-validity-check.ts";
import {SUDOKU_GRID_SIZE, SUDOKU_BOARD_SIZE} from "./sudoku.constants.ts";

export const solveSudoku = (board: number[]): number[][] => {
  return solveStep([...board], 0);
}

const solveStep = (board: number[], index: number): number[][] => {
  if (index === SUDOKU_BOARD_SIZE) {
    return [board];
  }

  if (board[index] !== 0) {
    return solveStep(board, index + 1);
  }

  const solutions: number[][] = [];
  for (let i = 1; i <= SUDOKU_GRID_SIZE; i++) {
    const newBoard = [...board];
    newBoard[index] = i;
    if (isSudokuValid(newBoard)) {
      const newSolutions = solveStep(newBoard, index + 1);
      solutions.push(...newSolutions);
    }
  }

  return solutions;
}

