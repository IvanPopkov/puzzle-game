import "./Sudoku.css";
import React, {useState} from "react";
import {generateSudoku} from "../../utils/puzzleGenerator.ts";
import NumberWheel, {NumberWheelInputProps} from "./NumberWheel/NumberWheel.tsx";
import {verifySudoku} from "../../utils/solutionVerifier.ts";

const SudokuGenerator = () => {
  const PUZZLE_MAX_SIZE = 9;
  let gridSize = PUZZLE_MAX_SIZE;

  const [puzzleSize, setPuzzleSize] = useState(PUZZLE_MAX_SIZE);
  const [puzzle, setPuzzle] = useState<(number | string)[]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [userSolution, setUserSolution] = useState<(number | '')[]>(Array(PUZZLE_MAX_SIZE * PUZZLE_MAX_SIZE).fill(''));

  const [wheel, setWheel] = useState<NumberWheelInputProps | null>(null);

  const generatePuzzle = () => {
    gridSize = puzzleSize;
    const {puzzle, solution} = generateSudoku(puzzleSize);
    setUserSolution(Array(PUZZLE_MAX_SIZE * PUZZLE_MAX_SIZE).fill(''));
    setPuzzle(puzzle);
    setSolution(solution);
  };

  const handlePuzzleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPuzzleSize(event.target.value === "" ? PUZZLE_MAX_SIZE : Number(event.target.value));
  };

  const handleClick = (x: number, y: number, e: React.MouseEvent<HTMLDivElement>) => {
    const {clientX, clientY} = e;
    const index = y * puzzleSize + x;
    setWheel({x: clientX, y: clientY, index, n: puzzleSize + 1});
  };

  const handleSelect = (num: number | '', index: number) => {
    userSolution[index] = num;
    setUserSolution(userSolution);
    const violations = verifySudoku(userSolution);
    setWheel(null);
  };



  return (
    <div className="container">
      <p><a href="/">Back</a></p>
      <p>This is a sudoku game</p>
      {wheel && <NumberWheel {...wheel} onSelect={handleSelect} onClose={() => setWheel(null)}/>}
      <div className="play-table">
        <table>
          <tbody>
          {[...Array(gridSize)].map((_, indexY) => (
            <tr key={indexY}>
              {[...Array(gridSize)].map((_, indexX) => (
                <td
                  key={`${indexX}-${indexY}`}
                  className="cell"
                >
                  {puzzle[gridSize * indexY + indexX] !== '' && (
                    <div className="solution-cell">
                      {puzzle[gridSize * indexY + indexX]}
                    </div>
                  )}
                  {puzzle[gridSize * indexY + indexX] === '' && (
                    <div className="user-solution-cell" onClick={(e) => handleClick(indexX, indexY, e)}>
                      {userSolution[gridSize * indexY + indexX]}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <input type="number" min="3" max={PUZZLE_MAX_SIZE} value={puzzleSize} onChange={handlePuzzleSizeChange}/>
      <button onClick={() => generatePuzzle()}>Generate new puzzle</button>
    </div>
  );
};

export default SudokuGenerator;