import React from "react";
import styles from "./Sudoku.module.css";
import NumberWheel from "./NumberWheel/NumberWheel.tsx";
import {Button, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {SUDOKU_BOARD_SIZE, SUDOKU_GRID_SIZE} from "@utils/sudoku.constants.ts";
import BoardCell from "./BoardCell/BoardCell.tsx";
import {useSudokuGame} from "./hooks/useSudokuGame.ts";
import Spinner from "@components/LoadingSpinner/LoadingSpinner.tsx";
import ArrowCircleLeftOutlined from "@mui/icons-material/ArrowCircleLeftOutlined";


const SudokuGenerator = () => {
  const {
    wheel,
    closeWheel,
    handleSelect,
    isInDraftMode,
    setIsInDraftMode,
    oneClickNumber,
    setOneClickNumber,
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

  const getPositionalClasses = (index: number): string[] => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    return [
      row > 0 && row % 3 === 0 ? 'thickBorderTop' : '',
      col > 0 && col % 3 === 0 ? 'thickBorderLeft' : ''
    ];
  }

  const handleOneClickNumber = (
    _event: React.MouseEvent<HTMLElement>,
    newOneClick: number | null,
  ) => {
    setOneClickNumber(newOneClick);
  };

  return (
    <>
      <div className={styles.header}>
        <a className={styles.backButton} href="/">
          <ArrowCircleLeftOutlined style={{fontSize: '64px'}}/>
        </a>
      </div>
      <div className={styles.container}>
        {wheel && <NumberWheel {...wheel} onSelect={handleSelect} onClose={closeWheel}/>}

        <div className={styles.oneClickBar}>
          <ToggleButtonGroup
            exclusive={true}
            value={isInDraftMode}
            color="primary"
            onChange={(_, value) => setIsInDraftMode(value)}
          >
            <ToggleButton value={true}>
              Draft mode
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            exclusive
            color="primary"
            value={oneClickNumber}
            onChange={handleOneClickNumber}
          >
            {Array.from({length: SUDOKU_GRID_SIZE}).map((_, index) => (
              <ToggleButton
                key={index + 1}
                value={index + 1}
              >
                {index + 1}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
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
                  positionalClasses={getPositionalClasses(index)}
                />
              ))}
            </div>
          )}
        </div>
        <Button variant="contained" disabled={isGenerating} onClick={fillCandidates}>Fill empty cells</Button>
        <Button variant="contained" disabled={isGenerating} onClick={generatePuzzle}>Generate new puzzle</Button>
        <Button variant="contained" disabled={isGenerating} onClick={clearAll}>Clear</Button>
      </div>
    </>
  );
};

export default SudokuGenerator;