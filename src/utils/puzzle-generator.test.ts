import {beforeEach, describe, expect, it} from "vitest";
import {verifyEligibility} from "./puzzle-generator.ts";

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