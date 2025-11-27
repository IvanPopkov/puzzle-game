import {describe, expect, it} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useValidateSolution} from "./useValidateSolution.ts";
import {EMPTY_PUZZLE, PUZZLE_4_9, PUZZLE_5_9} from "@testing/utils/sudoku-test-utils.ts";


describe("useValidateSolution", () => {
  describe("errorCellIndexes state", () => {
    it("should initialize with empty array", () => {
      const {result} = renderHook(() => useValidateSolution());
      expect(result.current.errorCellIndexes).toEqual([]);
    });

    it("should allow setting error cell indexes", () => {
      const {result} = renderHook(() => useValidateSolution());

      act(() => {
        result.current.setErrorCellIndexes([0, 1, 2]);
      });

      expect(result.current.errorCellIndexes).toEqual([0, 1, 2]);
    });
  });

  describe("validateSolution", () => {
    it("should not set error indexes when placing a valid number", () => {
      const {result} = renderHook(() => useValidateSolution());
      const puzzle = [...PUZZLE_5_9];

      act(() => {
        result.current.validateSolution(puzzle, 4, 33);
      });

      expect(result.current.errorCellIndexes).toEqual([]);
    });

    it("should set column error indexes when violating column rule", () => {
      // GIVEN
      const {result} = renderHook(() => useValidateSolution());

      const puzzle = [...EMPTY_PUZZLE];
      puzzle[0] = 5;
      // WHEN
      act(() => {
        result.current.validateSolution(puzzle, 5, 9);
      });

      // THEN
      const expectedColumnIndexes = [0, 9, 18, 27, 36, 45, 54, 63, 72];
      expect(result.current.errorCellIndexes).toEqual(expect.arrayContaining(expectedColumnIndexes));
    });

    it("should set row error indexes when violating row rule", () => {
      // GIVEN
      const {result} = renderHook(() => useValidateSolution());
      const puzzle = [...EMPTY_PUZZLE];
      puzzle[0] = 3;

      // WHEN
      act(() => {
        result.current.validateSolution(puzzle, 3, 5);
      });

      // THEN
      const expectedRowIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      expect(result.current.errorCellIndexes).toEqual(expect.arrayContaining(expectedRowIndexes));
    });

    it("should set block error indexes when violating block rule", () => {
      // GIVEN
      const {result} = renderHook(() => useValidateSolution());
      const puzzle = [...EMPTY_PUZZLE];
      puzzle[0] = 7;

      // WHEN
      act(() => {
        result.current.validateSolution(puzzle, 7, 10);
      });

      // THEN
      const expectedBlockIndexes = [0, 1, 2, 9, 10, 11, 18, 19, 20];
      expect(result.current.errorCellIndexes).toEqual(expect.arrayContaining(expectedBlockIndexes));
    });

    it("should set multiple error indexes when violating multiple rules", () => {
      // GIVEN
      const {result} = renderHook(() => useValidateSolution());
      const puzzle = [...EMPTY_PUZZLE];
      puzzle[0] = 4;
      puzzle[9] = 4;

      const columnIndexes = [0, 9, 18, 27, 36, 45, 54, 63, 72];
      const blockIndexes = [0, 1, 2, 9, 10, 11, 18, 19, 20];

      // WHEN
      act(() => {
        result.current.validateSolution(puzzle, 4, 18);

      });
      // THEN
      columnIndexes.forEach(index => {
        expect(result.current.errorCellIndexes).toContain(index);
      });

      blockIndexes.forEach(index => {
        expect(result.current.errorCellIndexes).toContain(index);
      });
    });

    it("should calculate correct block indexes for middle block", () => {
      // GIVEN
      const {result} = renderHook(() => useValidateSolution());
      const puzzle = [...EMPTY_PUZZLE];
      puzzle[40] = 2;

      const expectedBlockIndexes = [30, 31, 32, 39, 40, 41, 48, 49, 50];
      // WHEN
      act(() => {
        result.current.validateSolution(puzzle, 2, 41);

      });
      // THEN
      expect(result.current.errorCellIndexes).toEqual(expect.arrayContaining(expectedBlockIndexes));
    });

    it("should calculate correct block indexes for bottom-right block", () => {
      // GIVEN
      const {result} = renderHook(() => useValidateSolution());
      const puzzle = [...EMPTY_PUZZLE];
      puzzle[80] = 8;

      // WHEN
      act(() => {
        result.current.validateSolution(puzzle, 8, 70);
      });

      // THEN
      const expectedBlockIndexes = [60, 61, 62, 69, 70, 71, 78, 79, 80];
      expect(result.current.errorCellIndexes).toEqual(expect.arrayContaining(expectedBlockIndexes));
    });

    it("should handle complex puzzle state correctly", () => {
      // GIVEN
      const {result} = renderHook(() => useValidateSolution());
      const puzzle = [...PUZZLE_4_9];

      // WHEN
      act(() => {
        result.current.validateSolution(puzzle, 1, 27);
      });

      // THEN
      expect(result.current.errorCellIndexes.length).toBeGreaterThan(0);
      expect(result.current.errorCellIndexes).toContain(0);
      expect(result.current.errorCellIndexes).toContain(27);
    });
  });
});
