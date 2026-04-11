import {getViolations} from "@utils/sudoku-validity-check.ts";
import {SUDOKU_GRID_SIZE} from "@utils/sudoku.constants.ts";
import {useState} from "react";


export const useValidateSolution = () => {

  const [errorCellIndexes, setErrorCellIndexes] = useState<number[]>([]);

  const resetErrors = () => setErrorCellIndexes([]);

  const validateSolution = (board: number[]): void => {
    const violations = getViolations(board);
    const errorIndexes: number[] = [
      ...getRowErrorCells(violations.rows),
      ...getColumnErrorCells(violations.columns),
      ...getBlockErrorCells(violations.blocks)
    ];
    setErrorCellIndexes(errorIndexes);
  }

  const getRowErrorCells = (errorRows: number[]) => {
    const errorIndexes: number[] = [];
    for (const errorRowIndex of errorRows) {
      const rowIndexes = [...new Array(SUDOKU_GRID_SIZE).keys()].map(columnIndex => columnIndex + SUDOKU_GRID_SIZE * errorRowIndex);
      errorIndexes.push(...rowIndexes);
    }
    return errorIndexes;
  }

  const getColumnErrorCells = (errorColumns: number[]) => {
    const errorIndexes: number[] = [];
    for (const errorColumnIndex of errorColumns) {
      const columnIndexes = [...new Array(SUDOKU_GRID_SIZE).keys()].map(rowIndex => errorColumnIndex + SUDOKU_GRID_SIZE * rowIndex);
      errorIndexes.push(...columnIndexes);
    }
    return errorIndexes;
  }

  const getBlockErrorCells = (errorsBlocks: number[]) => {
    const errorIndexes: number[] = [];
    for (const errorBlockIndex of errorsBlocks) {
      const blockIndexes = getBlockCellsIndexes(errorBlockIndex);
      errorIndexes.push(...blockIndexes);
    }
    return errorIndexes;
  }

  const getBlockCellsIndexes = (blockIndex: number) => {
    const blockRow = Math.floor(blockIndex / 3);
    const blockCol = Math.floor(blockIndex % 3);

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
    resetErrors,
    validateSolutionV2: validateSolution
  };
}
