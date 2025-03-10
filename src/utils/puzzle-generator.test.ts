import {describe, expect, it} from "vitest";
import {verifyEligibility} from "./puzzle-generator.ts";

describe('Puzzle Generator', () => {
  it('solution should be eligible', () => {
    const puzzle = [
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
    const candidate = 1;
    const index = 0;

    const result = verifyEligibility(puzzle, candidate, index);

    expect(result.length).toBe(0);
  })
});