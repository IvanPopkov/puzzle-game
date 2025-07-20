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
  error?: boolean;
}

const BoardCell: React.FC<BoardCellProps> = ({ type, userSolution, candidates, numberInPuzzle, handleClick, error }) => {

  return (
    <div className={'board-cell ' + (error ? 'error' : '')}>
      {type === CellType.GIVEN_NUMBER && (
        <div
          className={CellType.GIVEN_NUMBER}
        >
          {numberInPuzzle}
        </div>
      )}
      {type !== CellType.GIVEN_NUMBER && (
        <div tabIndex={0} style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
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