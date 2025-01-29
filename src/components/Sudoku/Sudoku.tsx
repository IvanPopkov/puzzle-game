import {useEffect, useState} from "react";
import {generateSudoku} from "../../utils/puzzleGenerator.tsx";

const SudokuGenerator = () => {
  const PUZZLE_MAX_SIZE = 9;

  const [puzzle, setPuzzle] = useState<number[]>([0]);
  const [puzzleSize, setPuzzleSize] = useState(PUZZLE_MAX_SIZE);

  useEffect(() => {
    setPuzzle(generateSudoku(puzzleSize));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPuzzleSize(event.target.value === "" ? PUZZLE_MAX_SIZE : Number(event.target.value));
  };

  return (
    <>
      <p><a href="/">Back</a></p>
      <p>This is a sudoku game</p>
      <p>{ puzzle }</p>
      <input type="number" value={puzzleSize} onChange={handleChange} />
      <button onClick={() => setPuzzle(generateSudoku(puzzleSize))}>Generate new puzzle</button>
    </>
  );
};

export default SudokuGenerator;