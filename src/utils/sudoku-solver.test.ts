import {describe, expect, it} from "vitest";
import {solveSudoku} from "./sudoku-solver.ts";


const PUZZLE_5_9: number[] = [
  4, 7, 2,  1, 9, 6,  5, 3, 8,
  1, 5, 9,  3, 8, 7,  2, 4, 6,
  3, 6, 8,  5, 2, 4,  7, 9, 1,

  9, 1, 3,  8, 7, 5,  6, 2, 4,
  6, 8, 7,  4, 1, 2,  3, 5, 9,
  2, 4, 5,  9, 6, 3,  8, 1, 7,

  5, 2, 6,  7, 4, 9,  1, 8, 3,
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

describe('Sudoku solver', () => {
  it('should find a single solution', () => {
    const unsolvedPuzzle = [...PUZZLE_9_9];
    unsolvedPuzzle[80] = 0;

    const res = solveSudoku(unsolvedPuzzle);

    expect(res.length).toBe(1);
    expect(res[0]).toEqual(PUZZLE_9_9);
  });

  it('should find no solutions for an unsolvable puzzle', () => {
    const unsolvedPuzzle = [...PUZZLE_9_9];
    unsolvedPuzzle[80] = 0;
    unsolvedPuzzle[0] = unsolvedPuzzle[1];

    const res = solveSudoku(unsolvedPuzzle);
    expect(res.length).toBe(0);
  });

  it('should find multiple solutions', () => {
    const solution1 = [...PUZZLE_9_9];
    const solution2 = [
      4, 7, 2,  1, 9, 6,  5, 3, 8,
      1, 5, 9,  3, 8, 7,  2, 4, 6,
      3, 6, 8,  5, 2, 4,  7, 9, 1,

      9, 1, 3,  8, 7, 5,  6, 2, 4,
      6, 8, 7,  4, 1, 2,  3, 5, 9,
      2, 4, 5,  9, 6, 3,  8, 1, 7,

      5, 2, 6,  7, 4, 9,  1, 8, 3,
      8, 3, 4,  6, 5, 1,  9, 7, 2,
      7, 9, 1,  2, 3, 8,  4, 6, 5
    ];
    const res = solveSudoku(PUZZLE_5_9);
    expect(res).toEqual([solution1, solution2]);
  })
});
