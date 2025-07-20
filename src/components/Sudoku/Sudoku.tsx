import "./Sudoku.css";
import React, {useState} from "react";
import {generateSudoku} from "../../utils/puzzle-generator.ts";
import NumberWheel, {NumberWheelInputProps} from "./NumberWheel/NumberWheel.tsx";
import {Candidates} from "./Candidates/Candidates.tsx";
import {FormControlLabel, Switch} from "@mui/material";
import {getSudokuRulesViolations, SudokuRuleViolation} from "../../utils/sudoku-validity-check.ts";

enum CellType {
  GIVEN_NUMBER = 'given-number',
  USER_NUMBER = 'user-number',
  CANDIDATES = 'canditates',
  EMPTY = 'empty'
}

const SudokuGenerator = () => {
  const GRID_SIZE = 9;
  const MAX_INDEX = GRID_SIZE ** 2;

  const [puzzle, setPuzzle] = useState<(number | '')[]>([]);
  const [candidates, setCandidates] = useState<number[][]>(Array.from({length: MAX_INDEX}, () => []));
  const [userSolution, setUserSolution] = useState<(number | '')[]>(Array(MAX_INDEX).fill(''));
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
    setUserSolution(Array(MAX_INDEX).fill(''));
    setCandidates(Array.from({length: MAX_INDEX}, () => []));
    setErrorCellIndexes([]);
    setOneClickNumber(null);
  };

  const handleClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (oneClickNumber !== null) {
      handleSelect(oneClickNumber, index);
    } else {
      const {clientX, clientY} = e;
      setWheel({x: clientX, y: clientY, index, n: GRID_SIZE + 1});
    }
  };

  const getViolationsForCandidate = (puzzle: (number | '')[], candidate: number, index: number): SudokuRuleViolation[] => {
    const boardToVerify = [...puzzle];
    boardToVerify[index] = candidate;
    const filteredBoard = boardToVerify.map(el => el === '' ? 0 : el);

    return getSudokuRulesViolations(filteredBoard);
  };

  const validateSolution = (puzzle: (number | '')[], num: number, index: number) => {
    const violations = getViolationsForCandidate(puzzle, num, index);
    if (violations.length > 0) {
      const errorIndexes = [];
      if (violations.includes(SudokuRuleViolation.COLUMN)) {
        const x = index % GRID_SIZE;
        const columnIndexes = [...Array(GRID_SIZE).keys()].map(row => x + GRID_SIZE * row);
        errorIndexes.push(...columnIndexes);
      }
      if (violations.includes(SudokuRuleViolation.ROW)) {
        const y = Math.floor(index / GRID_SIZE);
        const columnIndexes = [...Array(GRID_SIZE).keys()].map(column => column + GRID_SIZE * y);
        errorIndexes.push(...columnIndexes);
      }
      setErrorCellIndexes(errorIndexes);
    }
  };

  const handleCandidate = (num: number | '', index: number) => {
    if (num && candidates[index].includes(num)) {
      const numIndex = candidates[index].findIndex(value => value === num);
      candidates[index].splice(numIndex, 1);
    } else if (num) {
      candidates[index].push(num);
    }
  };

  const handleUserInput = (num: number | '', index: number) => {
    if (userSolution[index] === num) {
      num = '';
    }
    userSolution[index] = num;
    setUserSolution(userSolution);
    if (num !== '') {
      validateSolution(puzzle, num, index);
    } else {
      setErrorCellIndexes([]);
    }
  };

  const handleSelect = (num: number | '', index: number) => {
    closeWheel();

    if (isInBlueprintMode) {
      handleCandidate(num, index);
    } else {
      handleUserInput(num, index);
    }
  };

  const fillCandidates = () => {
    setCandidates(
      Array.from({length: MAX_INDEX}, () => [...Array(GRID_SIZE).keys()].map(val => val + 1)));
  };

  const clearAll = () => {
    clearInput();
  };

  const getCellType = (index: number) => {
    if (puzzle[index] !== 0) {
      return CellType.GIVEN_NUMBER;
    }
    if (userSolution[index] !== '') {
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
        { Array.from({ length: GRID_SIZE }).map((_, index) => (
          <button
            key={index}
            className={oneClickNumber === index + 1 ? 'selected-number' : ''}
            onClick={() => handleOneClickNumber(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="play-table">
        <table>
          <tbody>
          {[...Array(GRID_SIZE)].map((_, indexY) => (
            <tr key={indexY}>
              {[...Array(GRID_SIZE)].map((_, indexX) => {
                const index = GRID_SIZE * indexY + indexX;
                const numberInPuzzle = puzzle[index];

                return (
                  <td
                    key={`${indexX}-${indexY}`}
                    className={"cell " + (errorCellIndexes.includes(index) ? ' error' : '') + (indexY % 3 === 2 ? ' cell-with-border' : '')}
                  >
                    {getCellType(index) === CellType.GIVEN_NUMBER && (
                      <div
                        className={CellType.GIVEN_NUMBER}
                      >
                        {numberInPuzzle}
                      </div>
                    )}
                    {getCellType(index) !== CellType.GIVEN_NUMBER && (
                      <div tabIndex={0} style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                           onClick={(e) => handleClick(index, e)}
                      >
                        {getCellType(index) === CellType.USER_NUMBER && (
                          userSolution[index]
                        )}
                        {getCellType(index) === CellType.CANDIDATES && (
                          <Candidates candidateList={candidates[index]}/>
                        )}
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <button onClick={fillCandidates}>Fill empty cells</button>
      <button onClick={generatePuzzle}>Generate new puzzle</button>
      <button onClick={clearAll}>Clear</button>
    </div>
  );
};

export default SudokuGenerator;