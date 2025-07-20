import {SUDOKU_GRID_SIZE} from "./sudoku.constants.ts";

export const extractBlock = (blockRow: number, blockCol: number, board: number[]) => {
  const block: number[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const index = (blockRow * 3 + row) * SUDOKU_GRID_SIZE + (blockCol * 3 + col);
      block.push(board[index]);
    }
  }

  return block;
}