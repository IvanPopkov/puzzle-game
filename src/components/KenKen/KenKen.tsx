import './KenKen.css'
import {useEffect, useState} from "react";
import {generateKenken} from "../../utils/puzzleGenerator.tsx";

const KenKen = () => {
  const PUZZLE_MAX_SIZE = 9;

  const [puzzle, setPuzzle] = useState<number[]>([0]);
  const [puzzleSize, setPuzzleSize] = useState(PUZZLE_MAX_SIZE);

  useEffect(() => {
    setPuzzle(generateKenken());
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPuzzleSize(event.target.value === "" ? PUZZLE_MAX_SIZE : Number(event.target.value));
  };

  return (
    <>
      <p><a href="/">Back</a></p>
      <p>This is a KenKen game</p>
      <p>{ puzzle }</p>
      <input type="number" value={puzzleSize} onChange={handleChange} min={2} max={PUZZLE_MAX_SIZE}></input>
      <button onClick={() => setPuzzle(generateKenken(puzzleSize))}></button>
    </>
  );
};

export default KenKen;