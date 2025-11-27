import React, {useState} from "react";
import {SUDOKU_BOARD_SIZE, SUDOKU_GRID_SIZE} from "@utils/sudoku.constants.ts";
import {NumberWheelInputProps} from "../NumberWheel/NumberWheel.tsx";
import {CellType} from "../BoardCell/CellType.ts";
import {generateSudokuInWorker} from "@services/puzzle-worker-client.ts";
import {useValidateSolution} from "@games/Sudoku/hooks/useValidateSolution.ts";


export const useSudokuGame = () => {
  const {
    errorCellIndexes,
    setErrorCellIndexes,
    validateSolution
  } = useValidateSolution();

  const [puzzle, setPuzzle] = useState<number[]>([]);
  const [candidates, setCandidates] = useState<number[][]>(Array.from({length: SUDOKU_BOARD_SIZE}, () => []));
  const [userSolution, setUserSolution] = useState<number[]>(Array(SUDOKU_BOARD_SIZE).fill(0));
  const [isInDraftMode, setIsInDraftMode] = useState<boolean>(false);
  const [oneClickNumber, setOneClickNumber] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [wheel, setWheel] = useState<NumberWheelInputProps | null>(null);
  const closeWheel = () => setWheel(null);

  const clearInput = () => {
    setUserSolution(Array(SUDOKU_BOARD_SIZE).fill(0));
    setCandidates(Array.from({length: SUDOKU_BOARD_SIZE}, () => []));
    setErrorCellIndexes([]);
    setOneClickNumber(null);
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
    const updatedSolution = [...userSolution];
    updatedSolution[index] = num;
    setUserSolution(() => updatedSolution);
    if (num !== 0) {
      validateSolution(puzzle, num, index);
      return;
    }
    setErrorCellIndexes([]);
  };

  const handleSelect = (num: number, index: number) => {
    closeWheel();

    if (isInDraftMode) {
      handleCandidate(num, index);
    } else {
      handleUserInput(num, index);
    }
  };

  const handleClick = (index: number) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      if (oneClickNumber !== null) {
        handleSelect(oneClickNumber, index);
      } else {
        const {clientX, clientY} = e;
        setWheel({x: clientX, y: clientY, index, n: SUDOKU_GRID_SIZE + 1});
      }
    };
  }

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

  const fillCandidates = () => {
    setCandidates(
      Array.from({length: SUDOKU_BOARD_SIZE}, () => [...Array(SUDOKU_GRID_SIZE).keys()].map(val => val + 1)));
  };

  const generatePuzzle = async () => {
    setIsGenerating(true);
    clearInput();
    const res = await generateSudokuInWorker();
    setPuzzle(res.puzzle);
    setIsGenerating(false);
  };

  return {
    puzzle,
    userSolution,
    candidates,
    errorCellIndexes,
    isInDraftMode,
    oneClickNumber,
    setOneClickNumber,
    wheel,
    handleClick,
    handleSelect,
    generatePuzzle,
    fillCandidates,
    clearAll,
    getCellType,
    closeWheel,
    setIsInDraftMode,
    isGenerating
  };
}