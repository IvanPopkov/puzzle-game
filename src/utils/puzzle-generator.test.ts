import {beforeEach, describe, expect, it} from "vitest";
import {verifyEligibility, generateSolution} from "./puzzle-generator.ts";

describe('Puzzle Generator', () => {
  let puzzle: (number | '')[];
  beforeEach(() => {
    puzzle = [
      1, 2, 3, 4, 5, 6, 7, 8, 9,
      2, 3, 4, 5, 6, 7, 8, 9, 0,
      3, 4, 5, 6, 7, 8, 9, 1, 2,
      4, 5, 6, 7, 8, 9, 1, 2, 3,
      5, 6, 7, 8, 9, 1, 2, 3, 4,
      6, 7, 8, 9, 1, 2, 3, 4, 5,
      7, 8, 9, 1, 2, 3, 4, 5, 6,
      8, 9, 1, 2, 3, 4, 5, 6, 7,
      9, 1, 2, 3, 4, 5, 6, 7, 8
    ];
  });
  
  [
    { title: 'solution should be eligible', candidate: 1, setup: () => {}, expected: [] },
    { title: 'should not have column violation', candidate: 2, setup: () => puzzle[1] = '', expected: ['column'] },
    { title: 'should not have row violation', candidate: 2, setup: () => puzzle[9] = '', expected: ['row'] },
  ].forEach(testCase => {
    it(testCase.title, () => {
      testCase.setup();
      const index = 0;

      const result = verifyEligibility(puzzle, testCase.candidate, index);

      expect(result).toStrictEqual(testCase.expected);
    });
  });
});

describe('generateSolution', () => {
  it('should generate a solution with 81 elements', () => {
    const solution = generateSolution();
    expect(solution.length).toBe(81);

    solution.forEach(num => {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(9);
    });
  });

  it('should generate a solution where each row contains numbers 1-9 without repetition', () => {
    const solution = generateSolution();
    for (let row = 0; row < 9; row++) {
      const rowValues = solution.slice(row * 9, (row + 1) * 9);
      expect(new Set(rowValues).size).toBe(9);
    }
  });

  it('should generate a solution where each column contains numbers 1-9 without repetition', () => {
    const solution = generateSolution();
    for (let col = 0; col < 9; col++) {
      const colValues = [];
      for (let row = 0; row < 9; row++) {
        colValues.push(solution[row * 9 + col]);
      }
      expect(new Set(colValues).size).toBe(9);
    }
  });

  it('should generate a solution where each 3x3 box contains numbers 1-9 without repetition', () => {
    const solution = generateSolution();
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
