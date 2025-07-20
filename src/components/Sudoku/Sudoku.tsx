import "./Sudoku.css";
import React, {useState} from "react";
import {generateSudoku} from "@utils/puzzle-generator.ts";
import NumberWheel, {NumberWheelInputProps} from "./NumberWheel/NumberWheel.tsx";
import {FormControlLabel, Switch} from "@mui/material";
import {getSudokuRulesViolations, SudokuRuleViolation} from "@utils/sudoku-validity-check.ts";
import {SUDOKU_BOARD_SIZE, SUDOKU_GRID_SIZE} from "@utils/sudoku.constants.ts";
import {CellType} from "./BoardCell/CellType.ts";
import BoardCell from "./BoardCell/BoardCell.tsx";


const SudokuGenerator = () => {

  const [puzzle, setPuzzle] = useState<number[]>([]);
  const [candidates, setCandidates] = useState<number[][]>(Array.from({length: SUDOKU_BOARD_SIZE}, () => []));
  const [userSolution, setUserSolution] = useState<number[]>(Array(SUDOKU_BOARD_SIZE).fill(0));
  const [errorCellIndexes, setErrorCellIndexes] = useState<number[]>([]);
  const [isInBlueprintMode, setIsInBlueprintMode] = useState<boolean>(false);
  const [oneClickNumber, setOneClickNumber] = useState<number | null>(null);

  const [wheel, setWheel] = useState<NumberWheelInputProps | null>(null);
  const closeWheel = () => setWheel(null);

  const generatePuzzle = () => {
    clearInput();
    const {puzzle} = generateSudoku();
    setPuzzle(puzzle);
  };

  const clearInput = () => {
    setUserSolution(Array(SUDOKU_BOARD_SIZE).fill(0));
    setCandidates(Array.from({length: SUDOKU_BOARD_SIZE}, () => []));
    setErrorCellIndexes([]);
    setOneClickNumber(null);
  };

  const handleClick = (index: number) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      if (oneClickNumber !== null) {
        handleSelect(oneClickNumber, index);
      } else {
        const {clientX, clientY} = e;
        setWheel({x: clientX, y: clientY, index, n: SUDOKU_GRID_SIZE + 1});
      }
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
  }

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

  const handleCandidate = (num: number, index: number) => {
    if (num && candidates[index].includes(num)) {
      const numIndex = candidates[index].findIndex(value => value === num);
      candidates[index].splice(numIndex, 1);
    } else if (num) {
      candidates[index].push(num);
    }
  };

  const handleUserInput = (num: number, index: number) => {
    if (userSolution[index] === num) {
      num = 0;
    }
    userSolution[index] = num;
    setUserSolution(userSolution);
    if (num !== 0) {
      validateSolution(puzzle, num, index);
    } else {
      setErrorCellIndexes([]);
    }
  };

  const handleSelect = (num: number, index: number) => {
    closeWheel();

    if (isInBlueprintMode) {
      handleCandidate(num, index);
    } else {
      handleUserInput(num, index);
    }
  };

  const fillCandidates = () => {
    setCandidates(
      Array.from({length: SUDOKU_BOARD_SIZE}, () => [...Array(SUDOKU_GRID_SIZE).keys()].map(val => val + 1)));
  };

  const clearAll = () => {
    clearInput();
  };

  const getCellType = (index: number) => {
    if (puzzle[index] !== 0) {
      return CellType.GIVEN_NUMBER;
    }
    if (userSolution[index] !== 0) {
      return CellType.USER_NUMBER;
    }
    if (candidates[index].length > 0) {
      return CellType.CANDIDATES;
    }
    return CellType.EMPTY;
  };

  const handleOneClickNumber = (index: number) => {
    const newNumber = index + 1;
    setOneClickNumber(oneClickNumber === newNumber ? null : newNumber);
  }

  return (
    <div className="container">
      <p><a href="/">Back</a></p>
      <p>This is a sudoku game</p>
      {wheel && <NumberWheel {...wheel} onSelect={handleSelect} onClose={closeWheel}/>}
      <FormControlLabel
        control={
          <Switch
            checked={isInBlueprintMode}
            onChange={(e) => setIsInBlueprintMode(e.target.checked)}
          />
        }
        label={isInBlueprintMode ? "Blueprint" : "Editing"}
      />
      <div className="one-click-bar">
        {Array.from({length: SUDOKU_GRID_SIZE}).map((_, index) => (
          <button
            key={index + 1}
            className={oneClickNumber === index + 1 ? 'selected-number' : ''}
            onClick={() => handleOneClickNumber(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="sudoku-grid">
        {[...Array(SUDOKU_GRID_SIZE)].map((_, indexY) =>
          [...Array(SUDOKU_GRID_SIZE)].map((_, indexX) => {
            const index = SUDOKU_GRID_SIZE * indexY + indexX;

            return (
              <div
                key={`${indexX}-${indexY}`}
                className={"cell " + (indexY % 3 === 2 ? ' cell-with-border' : '')}
              >
                <BoardCell
                  type={getCellType(index)}
                  userSolution={userSolution[index]}
                  candidates={candidates[index]}
                  numberInPuzzle={puzzle[index]}
                  handleClick={handleClick(index)}
                  invalid={errorCellIndexes.includes(index)}
                />
              </div>
            )
          }))}
      </div>
      <button onClick={fillCandidates}>Fill empty cells</button>
      <button onClick={generatePuzzle}>Generate new puzzle</button>
      <button onClick={clearAll}>Clear</button>
    </div>
  );
};

export default SudokuGenerator;