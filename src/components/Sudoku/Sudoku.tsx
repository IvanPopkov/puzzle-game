import "./Sudoku.css";
import React, {useState} from "react";
import {generateSudoku} from "../../utils/puzzleGenerator.ts";
import NumberWheel, {NumberWheelInputProps} from "./NumberWheel/NumberWheel.tsx";

const SudokuGenerator = () => {
  const PUZZLE_MAX_SIZE = 9;
  let gridSize = PUZZLE_MAX_SIZE;

  const [puzzleSize, setPuzzleSize] = useState(PUZZLE_MAX_SIZE);
  const [puzzle, setPuzzle] = useState<(number | string)[]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [userSolution, setUserSolution] = useState<(number | '')[]>(Array(PUZZLE_MAX_SIZE * PUZZLE_MAX_SIZE).fill(''));
  const [errorCellIndexes, setErrorCellIndexes] = useState<number[]>([]);

  const [wheel, setWheel] = useState<NumberWheelInputProps | null>(null);
  const closeWheel = () => setWheel(null);

  const generatePuzzle = () => {
    gridSize = puzzleSize;
    const {puzzle, solution} = generateSudoku(puzzleSize);
    setUserSolution(Array(PUZZLE_MAX_SIZE * PUZZLE_MAX_SIZE).fill(''));
    setPuzzle(puzzle);
    setSolution(solution);
    setErrorCellIndexes([]);
  };

  const handlePuzzleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPuzzleSize(event.target.value === "" ? PUZZLE_MAX_SIZE : Number(event.target.value));
  };

  const handleClick = (x: number, y: number, e: React.MouseEvent<HTMLDivElement>) => {
    const {clientX, clientY} = e;
    const index = y * puzzleSize + x;
    setWheel({x: clientX, y: clientY, index, n: puzzleSize + 1});
  };

  const validateSolution = (userSolution: (number | '')[], solution: number[]) => {
    const errorIndexList = [];
    for (let i = 0; i < solution.length; i++) {
      if (userSolution[i] !== '' && userSolution[i] !== solution[i]) {
        errorIndexList.push(i);
      }
    }
    setErrorCellIndexes(errorIndexList);
  };

  const handleSelect = (num: number | '', index: number) => {
    closeWheel();

    userSolution[index] = num;
    setUserSolution(userSolution);
    validateSolution(userSolution, solution);
  };

  return (
    <div className="container">
      <p><a href="/">Back</a></p>
      <p>This is a sudoku game</p>
      {wheel && <NumberWheel {...wheel} onSelect={handleSelect} onClose={closeWheel}/>}
      <div className="play-table">
        <table>
          <tbody>
          {[...Array(gridSize)].map((_, indexY) => (
            <tr key={indexY}>
              {[...Array(gridSize)].map((_, indexX) => {
                const index = gridSize * indexY + indexX;
                const numberInPuzzle = puzzle[index];

                return (
                  <td
                    key={`${indexX}-${indexY}`}
                    className="cell"
                  >
                    {numberInPuzzle !== '' && (<div className="solution-cell">{numberInPuzzle}</div>)}
                    {numberInPuzzle === '' && (
                      <div
                        className={"user-solution-cell " + (errorCellIndexes.includes(index) ? "error" : "")}
                        onClick={(e) => handleClick(indexX, indexY, e)}
                      >
                        {userSolution[index]}
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
      <input type="number" min="3" max={PUZZLE_MAX_SIZE} value={puzzleSize} onChange={handlePuzzleSizeChange}/>
      <button onClick={() => validateSolution(userSolution, solution)}>Validate solution</button>
      <button onClick={generatePuzzle}>Generate new puzzle</button>
    </div>
  );
};

export default SudokuGenerator;