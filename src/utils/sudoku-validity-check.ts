import {SUDOKU_GRID_SIZE, SUDOKU_BOARD_SIZE} from "./sudoku.constants.ts";

export const isSudokuValid = (board: number[]) : boolean => {
  const isIncorrectBoardLength = board.length !== SUDOKU_BOARD_SIZE;

  return isIncorrectBoardLength
    ? false
    : areRowsValid(board) && areColumnsValid(board) && areBlocksValid(board);
};

export const areRowsValid = (board: number[]): boolean => {
  for (let i = 0; i < SUDOKU_GRID_SIZE; i++) {
    const row = board.slice(i * SUDOKU_GRID_SIZE, (i + 1) * SUDOKU_GRID_SIZE);
    if (isContainingDuplicates(row)) {
      return false;
    }
  }

  return true;
};

export const areColumnsValid = (board: number[]): boolean => {
  for (let colIndex = 0; colIndex < SUDOKU_GRID_SIZE; colIndex++) {
    const column: number[] = [];
    for (let rowIndex = 0; rowIndex < SUDOKU_GRID_SIZE; rowIndex++) {
      column.push(board[rowIndex * SUDOKU_GRID_SIZE + colIndex]);
    }
    if (isContainingDuplicates(column)) {
      return false;
    }
  }

  return true;
};

export const areBlocksValid = (board: number[]): boolean => {
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const block: number[] = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const index = (blockRow * 3 + row) * SUDOKU_GRID_SIZE + (blockCol * 3 + col);
          block.push(board[index]);
        }
      }
      if (isContainingDuplicates(block)) {
        return false;
      }
    }
  }

  return true;
};

export const isContainingDuplicates = (row: number[]): boolean => {
  const seen: Set<number> = new Set();

  for (const num of row) {
    if (num !== 0 && seen.has(num)) {
      return true;
    }
    seen.add(num);
  }

  return false;
}
