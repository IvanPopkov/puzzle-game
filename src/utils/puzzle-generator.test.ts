import {describe, expect, it} from "vitest";
import {
  generateBlock,
  insertBlockIntoBoard,
  generateBoard, generateCandidatesStrategy
} from "./puzzle-generator.ts";

const PUZZLE_4_9: (number | '')[] = [
  4, 7, 2,  1, 9, 6,  5, 3, 8,
  1, 5, 9,  3, 8, 7,  2, 4, 6,
  3, 6, 8,  5, 2, 4,  7, 9, 1,

  9, 1, 3,  '', '', '',  '', '', '',
  6, 8, 7,  '', '', '',  '', '', '',
  2, 4, 5,  '', '', '',  '', '', '',

  '', '', '',  '', '', '',  '', '', '',
  '', '', '',  '', '', '',  '', '', '',
  '', '', '',  '', '', '',  '', '', ''
];

const PUZZLE_5_9: (number | '')[] = [
  4, 7, 2,  1, 9, 6,  5, 3, 8,
  1, 5, 9,  3, 8, 7,  2, 4, 6,
  3, 6, 8,  5, 2, 4,  7, 9, 1,

  9, 1, 3,  8, 7, 5,  '', '', '',
  6, 8, 7,  4, 1, 2,  '', '', '',
  2, 4, 5,  9, 6, 3,  '', '', '',

  '', '', '',  '', '', '',  '', '', '',
  '', '', '',  '', '', '',  '', '', '',
  '', '', '',  '', '', '',  '', '', ''
];

const PUZZLE_9_9 = [
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

describe('Puzzle Generator', () => {

  it('should integrate block to board', () => {
    // GIVEN
    const blockIndex = 4;
    const block = [8, 7, 5, 4, 1, 2, 9, 6, 3];

    // WHEN
    insertBlockIntoBoard(PUZZLE_4_9, blockIndex, block);

    // THEN
    expect(PUZZLE_4_9).toStrictEqual(PUZZLE_5_9);
  });

  describe('generateBlock', () => {
    [
      { title: 'generated block', candidates: [6, 4, 2, 3, 5, 9, 8, 1, 7], expected: [6, 2, 4, 3, 5, 9, 8, 1, 7] },
      { title: '-1 when cannot generate block', candidates: [4, 2, 6, 3, 5, 9, 8, 1, 7], expected: -1 }
    ].forEach(testCase => {
      it(`should return ${testCase.title}`, () => {
        // GIVEN
        const blockIndex = 5;
        const board = [...PUZZLE_5_9];
        // WHEN
        const result = generateBlock(board, blockIndex, testCase.candidates);
        // THEN
        expect(result).toStrictEqual(testCase.expected);
      });
    });
  });

  describe('generateBoard', () => {
    function createPredefinedCandidates(values: number[][]): () => number[] {
      let index = 0;

      return function () {
        if (index < values.length) {
          return values[index++];
        } else {
          throw new Error("No more predefined values available");
        }
      };
    }

    const mockGenerateCandidates = () => {
      return createPredefinedCandidates([
        [4, 7, 2, 1, 5, 9, 3, 6, 8],
        [1, 9, 6, 3, 8, 7, 5, 2, 4],
        [5, 3, 8, 2, 4, 6, 7, 9, 1],
        [9, 1, 3, 6, 8, 7, 2, 4, 5],
        [8, 7, 5, 4, 1, 2, 9, 6, 3],
        [6, 2, 4, 3, 5, 9, 8, 1, 7],
        [5, 2, 6, 7, 9, 1, 8, 3, 4],
        [7, 4, 9, 2, 3, 8, 6, 5, 1],
        [1, 8, 3, 4, 6, 5, 9, 7, 2]
      ]);
    };

    it('should generate sudoku puzzle', () => {
      // GIVEN
      const expectedBoard: number[] = [...PUZZLE_9_9];
      // WHEN
      const result = generateBoard(mockGenerateCandidates());
      // THEN
      expect(result).toStrictEqual(expectedBoard);
    });

    it('should generate a solution with 81 elements', () => {
      // WHEN
      const solution = generateBoard(generateCandidatesStrategy);
      expect(solution.length).toBe(81);
      // THEN
      solution.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(9);
      });
    });

    it('should generate a solution where each row contains numbers 1-9 without repetition', () => {
      const solution = generateBoard(generateCandidatesStrategy);
      for (let row = 0; row < 9; row++) {
        const rowValues = solution.slice(row * 9, (row + 1) * 9);
        expect(new Set(rowValues).size).toBe(9);
      }
    });

    it('should generate a solution where each column contains numbers 1-9 without repetition', () => {
      const solution = generateBoard(generateCandidatesStrategy);
      for (let col = 0; col < 9; col++) {
        const colValues = [];
        for (let row = 0; row < 9; row++) {
          colValues.push(solution[row * 9 + col]);
        }
        expect(new Set(colValues).size).toBe(9);
      }
    });

    it('should generate a solution where each 3x3 box contains numbers 1-9 without repetition', () => {
      const solution = generateBoard(generateCandidatesStrategy);
      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
          const boxValues = [];
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
              const rowIndex = boxRow * 3 + row;
              const colIndex = boxCol * 3 + col;
              boxValues.push(solution[rowIndex * 9 + colIndex]);
            }
          }
          expect(new Set(boxValues).size).toBe(9);
        }
      }
    });
  });


});
