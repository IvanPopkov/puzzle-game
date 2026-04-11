import {describe, expect, it} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useValidateSolution} from "./useValidateSolution.ts";
import {EMPTY_PUZZLE, PUZZLE_5_9, PUZZLE_9_9} from "@testing/utils/sudoku-test-utils.ts";


describe("validateSolutionV2", () => {
  it.each([
    {board: EMPTY_PUZZLE},
    {board: PUZZLE_5_9},
    {board: PUZZLE_9_9},
  ])("should not set error indexes for a completely valid board", ({board}) => {
    const {result} = renderHook(() => useValidateSolution());

    act(() => {
      result.current.validateSolutionV2(board);
    });

    expect(result.current.errorCellIndexes).toEqual([]);
  });

  it("should highlight multiple rows when multiple rows have duplicates", () => {
    const {result} = renderHook(() => useValidateSolution());
    const puzzle = [...PUZZLE_9_9];
    puzzle[1] = puzzle[0]; // Duplicate in row 0
    puzzle[10] = puzzle[9]; // Duplicate in row 1
    puzzle[19] = puzzle[18]; // Duplicate in row 2

    act(() => {
      result.current.validateSolutionV2(puzzle);
    });

    const row0Indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const row1Indexes = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    const row2Indexes = [18, 19, 20, 21, 22, 23, 24, 25, 26];

    [...row0Indexes, ...row1Indexes, ...row2Indexes].forEach(index => {
      expect(result.current.errorCellIndexes).toContain(index);
    });
  });

  it("should highlight multiple columns when multiple columns have duplicates", () => {
    const {result} = renderHook(() => useValidateSolution());
    const puzzle = [...PUZZLE_5_9];
    puzzle[54] = puzzle[45]; // Duplicate in column 0
    puzzle[55] = 1; // Duplicate in column 1
    puzzle[56] = 3; // Duplicate in column 2

    act(() => {
      result.current.validateSolutionV2(puzzle);
    });

    const col0Indexes = [0, 9, 18, 27, 36, 45, 54, 63, 72];
    const col1Indexes = [1, 10, 19, 28, 37, 46, 55, 64, 73];
    const col2Indexes = [2, 11, 20, 29, 38, 47, 56, 65, 74];

    [...col0Indexes, ...col1Indexes, ...col2Indexes].forEach(index => {
      expect(result.current.errorCellIndexes).toContain(index);
    });
  });

  it("should highlight multiple blocks when multiple blocks have duplicates", () => {
    const {result} = renderHook(() => useValidateSolution());
    const puzzle = [...PUZZLE_9_9];
    puzzle[10] = puzzle[0]; // Duplicate in block 0
    puzzle[40] = puzzle[30]; // Duplicate in block 4
    puzzle[80] = puzzle[60]; // Duplicate in block 8

    act(() => {
      result.current.validateSolutionV2(puzzle);
    });

    const block0Indexes = [0, 1, 2, 9, 10, 11, 18, 19, 20];
    const block4Indexes = [30, 31, 32, 39, 40, 41, 48, 49, 50];
    const block8Indexes = [60, 61, 62, 69, 70, 71, 78, 79, 80];

    [...block0Indexes, ...block4Indexes, ...block8Indexes].forEach(index => {
      expect(result.current.errorCellIndexes).toContain(index);
    });
  });

  it("should handle complex board with multiple violations in different areas", () => {
    const {result} = renderHook(() => useValidateSolution());
    const puzzle = [...PUZZLE_9_9];
    puzzle[1] = puzzle[0];
    puzzle[40] = puzzle[4]; // Column 4 is duplicated
    puzzle[80] = puzzle[60]; // Block 8 is duplicated

    act(() => {
      result.current.validateSolutionV2(puzzle);
    });

    expect(result.current.errorCellIndexes.length).toBeGreaterThan(0);

    // Check that at least some expected indexes are present
    expect(result.current.errorCellIndexes).toContain(0); // From row 0
    expect(result.current.errorCellIndexes).toContain(1); // From row 0
    expect(result.current.errorCellIndexes).toContain(4); // From column 4
    expect(result.current.errorCellIndexes).toContain(40); // From column 4
    expect(result.current.errorCellIndexes).toContain(60); // From block 8
    expect(result.current.errorCellIndexes).toContain(80); // From block 8
  });
});
