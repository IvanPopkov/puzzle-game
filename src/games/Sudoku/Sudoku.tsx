import "./Sudoku.css";
import NumberWheel from "./NumberWheel/NumberWheel.tsx";
import {FormControlLabel, Switch} from "@mui/material";
import {SUDOKU_BOARD_SIZE, SUDOKU_GRID_SIZE} from "@utils/sudoku.constants.ts";
import BoardCell from "./BoardCell/BoardCell.tsx";
import {useSudokuGame} from "./hooks/useSudokuGame.ts";


const SudokuGenerator = () => {
  const {
    wheel,
    closeWheel,
    handleSelect,
    isInBlueprintMode,
    setIsInBlueprintMode,
    oneClickNumber,
    handleOneClickNumber,
    getCellType,
    userSolution,
    candidates,
    puzzle,
    handleClick,
    errorCellIndexes,
    fillCandidates,
    generatePuzzle,
    clearAll
  } = useSudokuGame();


  return (
    <div className="container">
      <p><a href="/public">Back</a></p>
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
        {[...Array(SUDOKU_BOARD_SIZE)].map((_, index) => (
          <BoardCell
            key={`${index}-${index}`}
            type={getCellType(index)}
            userSolution={userSolution[index]}
            candidates={candidates[index]}
            numberInPuzzle={puzzle[index]}
            handleClick={handleClick(index)}
            invalid={errorCellIndexes.includes(index)}
          />
        ))}
      </div>
      <button onClick={fillCandidates}>Fill empty cells</button>
      <button onClick={generatePuzzle}>Generate new puzzle</button>
      <button onClick={clearAll}>Clear</button>
    </div>
  );
};

export default SudokuGenerator;