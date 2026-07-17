import {describe, expect, it} from "vitest";
import {
  areRowsValid,
  areColumnsValid,
  isContainingDuplicates,
  isSudokuValid,
  areBlocksValid,
  ViolationType,
  getSudokuRulesViolations,
  getViolations,
  getInvalidRows,
  getInvalidColumns,
  getInvalidBlocks
} from "./sudoku-validity-check.ts";
import {SUDOKU_GRID_SIZE} from "./sudoku.constants.ts";
import {PUZZLE_4_9, PUZZLE_5_9, PUZZLE_9_9} from "@testing/utils/sudoku-test-utils.ts";

const PUZZLE_0_9: number[] = [
  9, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0,

  0, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0,

  0, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0
];

describe('Sudoku validity check', () => {
  describe('isSudokuValid', () => {
    it.each([
      { board: PUZZLE_0_9, expected: true },
      { board: PUZZLE_4_9, expected: true },
      { board: PUZZLE_5_9, expected: true },
      { board: PUZZLE_9_9, expected: true },
      { board: boardWithIncorrectColumn(), expected: false },
      { board: boardWithIncorrectBlock(), expected: false },
      { board: boardWithIncorrectRow(), expected: false }
    ])('should return false for incorrect board and true for correct ones', ({ board, expected })  => {
      expect(isSudokuValid(board)).toBe(expected);
    });

    it ('should return false for incorrect sized board', () => {
      const incorrectBoard = [...PUZZLE_0_9, 1];
      expect(isSudokuValid(incorrectBoard)).toBe(false);
    });
  });

  describe('isContainingDuplicates', () => {
    it.each([
      { row: [1, 2, 3, 4, 5, 6, 7, 8, 9], expected: false },
      { row: [1, 2, 3, 4, 0, 0, 0, 0, 0], expected: false },
      { row:  [1, 2, 3, 4, 5, 6, 7, 8, 0], expected: false },
      { row:  [0, 0, 0, 0, 0, 0, 0, 0, 0], expected: false },
      { row:  [1, 2, 3, 4, 5, 6, 8, 8, 0], expected: true },
      { row:  [1, 2, 3, 9, 5, 6, 7, 8, 9], expected: true },
    ])('should validate correct row', ({ row, expected }) => {
      expect(isContainingDuplicates(row)).toBe(expected);
    });
  });


  describe('areRowsValid', () => {
    it.each([
      { board: PUZZLE_0_9, expected: true },
      { board: PUZZLE_4_9, expected: true },
      { board: PUZZLE_5_9, expected: true },
      { board: PUZZLE_9_9, expected: true }
    ])('should validate correct board', ({ board, expected }) => {
      expect(areRowsValid(board)).toBe(expected);
    });

    it('should return false for invalid board', () => {
      expect(areRowsValid(boardWithIncorrectRow())).toBe(false);
    });
  });

  describe('areColumnsValid', () => {
    it.each([
      { board: PUZZLE_0_9, expected: true },
      { board: PUZZLE_4_9, expected: true },
      { board: PUZZLE_5_9, expected: true },
      { board: PUZZLE_9_9, expected: true }
    ])('should validate correct board', ({ board, expected }) => {
      expect(areColumnsValid(board)).toBe(expected);
    });

    it('should return false for invalid board', () => {
      expect(areColumnsValid(boardWithIncorrectColumn())).toBe(false);
    });
  });

  describe('areBlocksValid', () => {
    it.each([
      { board: PUZZLE_0_9, expected: true },
      { board: PUZZLE_4_9, expected: true },
      { board: PUZZLE_5_9, expected: true },
      { board: PUZZLE_9_9, expected: true }
    ])('should validate correct board', ({ board, expected }) => {
      expect(areBlocksValid(board)).toBe(expected);
    });

    it('should return false for invalid board', () => {
      expect(areBlocksValid(boardWithIncorrectBlock())).toBe(false);
    });
  });

  describe('getSudokuRulesViolations', () => {
    it.each([
      { board: boardWithIncorrectRow(), expected: [ViolationType.ROW] },
      { board: boardWithIncorrectColumn(), expected: [ViolationType.COLUMN] },
      { board: boardWithIncorrectBlock(), expected: [ViolationType.BLOCK] },
      { board: PUZZLE_9_9, expected: [] },
      { board: boardWithIncorrectEverything(), expected: [ViolationType.ROW, ViolationType.COLUMN, ViolationType.BLOCK] }
    ])('should return correct violations', ({ board, expected }) => {
      expect(getSudokuRulesViolations(board)).toEqual(expected);
    });
  });

  describe('getInvalidRows', () => {
    it.each([
      { board: Array(81).fill(0) },
      { board: PUZZLE_0_9 },
      { board: PUZZLE_4_9 },
      { board: PUZZLE_5_9 },
      { board: PUZZLE_9_9 }
    ])('should return empty array for valid board', ({ board }) => {
      expect(getInvalidRows(board)).toEqual([]);
    });

    it('should return array with multiple invalid row indices', () => {
      const board = [...PUZZLE_9_9];
      board[1] = board[0]; // Duplicate in row 0
      board[10] = board[9]; // Duplicate in row 1
      board[19] = board[18]; // Duplicate in row 2
      expect(getInvalidRows(board)).toEqual([0, 1, 2]);
    });

    it('should not count zeros as duplicates', () => {
      const board = Array(81).fill(0);
      expect(getInvalidRows(board)).toEqual([]);
    });
  });

  describe('getInvalidColumns', () => {
    it.each([
      { board: PUZZLE_0_9 },
      { board: PUZZLE_4_9 },
      { board: PUZZLE_5_9 },
      { board: PUZZLE_9_9 }
    ])('should return empty array for valid board', ({board}) => {
      expect(getInvalidColumns(board)).toEqual([]);
    });

    it('should return array with multiple invalid column indices', () => {
      const board = [...PUZZLE_9_9];
      board[9] = board[0]; // Duplicate in column 0
      board[10] = board[1]; // Duplicate in column 1
      board[11] = board[2]; // Duplicate in column 2
      expect(getInvalidColumns(board)).toEqual([0, 1, 2]);
    });

    it('should not count zeros as duplicates', () => {
      const board = Array(81).fill(0);
      expect(getInvalidColumns(board)).toEqual([]);
    });
  });

  describe('getInvalidBlocks', () => {
    it.each([
      { board: PUZZLE_0_9 },
      { board: PUZZLE_4_9 },
      { board: PUZZLE_5_9 },
      { board: PUZZLE_9_9 }
    ])('should return empty array for a valid board', ({board}) => {
      expect(getInvalidBlocks(board)).toEqual([]);
    });

    it('should return array with multiple invalid block indices', () => {
      const board = [...PUZZLE_9_9];
      board[10] = board[0]; // Duplicate in block 0 (top-left)
      board[14] = board[3]; // Duplicate in block 1 (top-middle)
      board[17] = board[6]; // Duplicate in block 2 (top-right)
      expect(getInvalidBlocks(board)).toEqual([0, 1, 2]);
    });

    it('should detect duplicate in bottom-right block (block 8)', () => {
      const board = [...PUZZLE_9_9];
      // Block 8 is bottom-right: indices 60,61,62,69,70,71,78,79,80
      board[80] = board[60];
      expect(getInvalidBlocks(board)).toEqual([8]);
    });

    it('should not count zeros as duplicates', () => {
      const board = Array(81).fill(0);
      expect(getInvalidBlocks(board)).toEqual([]);
    });
  });

  describe('getViolations', () => {
    it.each([
      { board: PUZZLE_0_9 },
      { board: PUZZLE_4_9 },
      { board: PUZZLE_5_9 },
      { board: PUZZLE_9_9 }
    ])('should return empty arrays for valid board', ({board}) => {
      const violations = getViolations(board);
      expect(violations.rows).toEqual([]);
      expect(violations.columns).toEqual([]);
      expect(violations.blocks).toEqual([]);
    });

    it('should return row violations only', () => {
      const board = [...PUZZLE_5_9];
      board[33] = 9; // Duplicate in row 4
      const violations = getViolations(board);
      expect(violations.rows).toEqual([3]);
      expect(violations.columns).toEqual([]);
      expect(violations.blocks).toEqual([]);
    });

    it('should return column violations only', () => {
      const board = [...PUZZLE_5_9];
      board[33] = 2; // Duplicate in column 7
      const violations = getViolations(board);
      expect(violations.rows).toEqual([]);
      expect(violations.columns).toEqual([6]);
      expect(violations.blocks).toEqual([]);
    });

    it('should return block violations only', () => {
      const board = [...PUZZLE_4_9];
      board[30] = 4;
      board[40] = 4;
      const violations = getViolations(board);
      expect(violations.rows).toEqual([]);
      expect(violations.columns).toEqual([]);
      expect(violations.blocks).toEqual([4]);
    });

    it('should return multiple violation types', () => {
      const board = [...PUZZLE_9_9];
      board[1] = board[0]; // Row 0, Column 1, Block 0
      board[72] = board[63]; // Row 8, Column 0, Block 6
      board[40] = board[4]; // Column 4, Block 4

      const violations = getViolations(board);
      expect(violations.rows).toContain(0);
      expect(violations.rows).toContain(8);
      expect(violations.columns).toContain(0);
      expect(violations.columns).toContain(1);
      expect(violations.columns).toContain(4);
      expect(violations.blocks).toContain(0);
      expect(violations.blocks).toContain(4);
      expect(violations.blocks).toContain(6);
    });
  });

  const boardWithIncorrectRow = () => {
    const incorrectBoard = [...PUZZLE_4_9];
    const someIndex = 30;
    incorrectBoard[someIndex] = incorrectBoard[someIndex - 3];
    return incorrectBoard;
  }

  const boardWithIncorrectColumn = () => {
    const incorrectBoard = [...PUZZLE_5_9];
    const someIndex = 54; // 7th row, 1st column
    incorrectBoard[someIndex] = incorrectBoard[someIndex - SUDOKU_GRID_SIZE];
    return incorrectBoard;
  }

  const boardWithIncorrectBlock = () => {
    const incorrectBoard = [...PUZZLE_5_9];
    const someIndex = 50; // 6th row, 6th column
    incorrectBoard[someIndex] = incorrectBoard[someIndex - SUDOKU_GRID_SIZE - 1];
    return incorrectBoard;
  }

  const boardWithIncorrectEverything = () => {
    const incorrectBoard = [...PUZZLE_5_9];
    const someIndex = 46; // 5th row, 2nd column
    incorrectBoard[someIndex] = incorrectBoard[someIndex - SUDOKU_GRID_SIZE - 1];
    return incorrectBoard;
  }
});
