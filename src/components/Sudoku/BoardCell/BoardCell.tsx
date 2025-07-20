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

  return (
    <div className={'board-cell ' + (invalid ? 'error' : '')}>
      {type === CellType.GIVEN_NUMBER && (
        <div style={{ fontWeight: '600' }}>
          {numberInPuzzle}
        </div>
      )}
      {type !== CellType.GIVEN_NUMBER && (
        <div
          className="user-input-cell"
          onClick={handleClick}
        >
          {type === CellType.USER_NUMBER && (
            userSolution
          )}
          {type === CellType.CANDIDATES && (
            <Candidates candidateList={candidates}/>
          )}
        </div>
      )}
    </div>
  );
}

export default BoardCell;