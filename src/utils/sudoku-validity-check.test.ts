import {describe, expect, it} from "vitest";
import {
  areRowsValid,
  areColumnsValid,
  isContainingDuplicates,
  isSudokuValid,
  areBlocksValid, SudokuRuleViolation, getSudokuRulesViolations
} from "./sudoku-validity-check.ts";
import {SUDOKU_GRID_SIZE} from "./sudoku.constants.ts";

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

const PUZZLE_4_9: number[] = [
  4, 7, 2,  1, 9, 6,  5, 3, 8,
  1, 5, 9,  3, 8, 7,  2, 4, 6,
  3, 6, 8,  5, 2, 4,  7, 9, 1,

  9, 1, 3,  0, 0, 0,  0, 0, 0,
  6, 8, 7,  0, 0, 0,  0, 0, 0,
  2, 4, 5,  0, 0, 0,  0, 0, 0,

  0, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0
];

const PUZZLE_5_9: number[] = [
  4, 7, 2,  1, 9, 6,  5, 3, 8,
  1, 5, 9,  3, 8, 7,  2, 4, 6,
  3, 6, 8,  5, 2, 4,  7, 9, 1,

  9, 1, 3,  8, 7, 5,  0, 0, 0,
  6, 8, 7,  4, 1, 2,  0, 0, 0,
  2, 4, 5,  9, 6, 3,  0, 0, 0,

  0, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0,
  0, 0, 0,  0, 0, 0,  0, 0, 0
];

const PUZZLE_9_9: number[] = [
  4, 7, 2,  1, 9, 6,  5, 3, 8,
  1, 5, 9,  3, 8, 7,  2, 4, 6,
  3, 6, 8,  5, 2, 4,  7, 9, 1,

  9, 1, 3,  8, 7, 5,  6, 2, 4,
  6, 8, 7,  4, 1, 2,  3, 5, 9,
  2, 4, 5,  9, 6, 3,  8, 1, 7,

  5, 2, 6,  7, 4, 9,  1, 8, 3,
  7, 9, 1,  2, 3, 8,  4, 6, 5,
  8, 3, 4,  6, 5, 1,  9, 7, 2
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
      { board: boardWithIncorrectRow(), expected: [SudokuRuleViolation.ROW] },
      { board: boardWithIncorrectColumn(), expected: [SudokuRuleViolation.COLUMN] },
      { board: boardWithIncorrectBlock(), expected: [SudokuRuleViolation.BLOCK] },
      { board: PUZZLE_9_9, expected: [] },
      { board: boardWithIncorrectEverything(), expected: [SudokuRuleViolation.ROW, SudokuRuleViolation.COLUMN, SudokuRuleViolation.BLOCK] }
    ])('should return correct violations', ({ board, expected }) => {
      expect(getSudokuRulesViolations(board)).toEqual(expected);
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
