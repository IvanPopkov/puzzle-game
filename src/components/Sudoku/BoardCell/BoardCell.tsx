import "./BoardCell.css";
import React from "react";
import {Candidates} from "../Candidates/Candidates.tsx";
import {CellType} from "./CellType.ts";

interface BoardCellProps {
  type: CellType;
  userSolution: number;
  candidates: number[];
  numberInPuzzle: number;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  invalid?: boolean;
}

const BoardCell: React.FC<BoardCellProps> = ({ type, userSolution, candidates, numberInPuzzle, handleClick, invalid }) => {
  const buildClass = () => {
    return 'board-cell' + (invalid ? ' error' : '') + (type === CellType.GIVEN_NUMBER ? ' given-number' : '');
  };

  return (
    <>
      {type === CellType.GIVEN_NUMBER && (
        <div className={buildClass()}>{numberInPuzzle}</div>
      )}
      {type !== CellType.GIVEN_NUMBER && (
        <div className={buildClass()} onClick={handleClick}>
          {type === CellType.USER_NUMBER && (
            userSolution
          )}
          {type === CellType.CANDIDATES && (
            <Candidates candidateList={candidates}/>
          )}
        </div>
      )}
    </>
  );
}

export default BoardCell;