import styles from "./Sudoku.module.css";
import NumberWheel from "./NumberWheel/NumberWheel.tsx";
import {FormControlLabel, Switch} from "@mui/material";
import {SUDOKU_BOARD_SIZE, SUDOKU_GRID_SIZE} from "@utils/sudoku.constants.ts";
import BoardCell from "./BoardCell/BoardCell.tsx";
import {useSudokuGame} from "./hooks/useSudokuGame.ts";
import Spinner from "@components/LoadingSpinner/LoadingSpinner.tsx";


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
    clearAll,
    isGenerating
  } = useSudokuGame();


  return (
    <div className={styles.container}>
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
      <div className={styles.oneClickBar}>
        {Array.from({length: SUDOKU_GRID_SIZE}).map((_, index) => (
          <button
            key={index + 1}
            className={oneClickNumber === index + 1 ? styles.selectedNumber : ''}
            onClick={() => handleOneClickNumber(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className={styles.gameBoard}>
        {isGenerating && (<Spinner/>)}
        {!isGenerating && (
          <div className={styles.sudokuGrid}>
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
        )}
      </div>
      <button onClick={fillCandidates}>Fill empty cells</button>
      <button onClick={generatePuzzle}>Generate new puzzle</button>
      <button onClick={clearAll}>Clear</button>
    </div>
  );
};

export default SudokuGenerator;