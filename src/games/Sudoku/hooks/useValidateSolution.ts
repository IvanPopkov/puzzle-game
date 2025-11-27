import {getSudokuRulesViolations, SudokuRuleViolation} from "@utils/sudoku-validity-check.ts";
import {SUDOKU_GRID_SIZE} from "@utils/sudoku.constants.ts";
import {useState} from "react";


export const useValidateSolution = () => {

  const [errorCellIndexes, setErrorCellIndexes] = useState<number[]>([]);

  const validateSolution = (puzzle: number[], num: number, index: number) => {
    const violations = getViolationsForCandidate(puzzle, num, index);
    if (violations.length > 0) {
      const errorIndexes = [];
      if (violations.includes(SudokuRuleViolation.COLUMN)) {
        const x = index % SUDOKU_GRID_SIZE;
        const columnIndexes = [...Array(SUDOKU_GRID_SIZE).keys()].map(row => x + SUDOKU_GRID_SIZE * row);
        errorIndexes.push(...columnIndexes);
      }
      if (violations.includes(SudokuRuleViolation.ROW)) {
        const y = Math.floor(index / SUDOKU_GRID_SIZE);
        const columnIndexes = [...Array(SUDOKU_GRID_SIZE).keys()].map(column => column + SUDOKU_GRID_SIZE * y);
        errorIndexes.push(...columnIndexes);
      }
      if (violations.includes(SudokuRuleViolation.BLOCK)) {
        const blockIndexes = getInvalidBlockIndexes(index);
        errorIndexes.push(...blockIndexes);
      }
      setErrorCellIndexes(errorIndexes);
    }
  };

  const getViolationsForCandidate = (puzzle: number[], candidate: number, index: number): SudokuRuleViolation[] => {
    const boardToVerify = [...puzzle];
    boardToVerify[index] = candidate;

    return getSudokuRulesViolations(boardToVerify);
  };

  const getInvalidBlockIndexes = (index: number) => {
    const blockRow = Math.floor(index / SUDOKU_GRID_SIZE / 3);
    const blockCol = Math.floor(index % SUDOKU_GRID_SIZE / 3);

    const blockIndexes: number[] = [];

    for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
      for (let colOffset = 0; colOffset < 3; colOffset++) {
        const row = blockRow * 3 + rowOffset;
        const col = blockCol * 3 + colOffset;
        blockIndexes.push(row * 9 + col);
      }
    }
    return blockIndexes;
  };

  return {
    errorCellIndexes,
    setErrorCellIndexes,
    validateSolution
  };
}
