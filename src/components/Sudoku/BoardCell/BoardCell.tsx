import React from "react";
import {Candidates} from "../Candidates/Candidates.tsx";
import {CellType} from "./CellType.ts";

interface BoardCellProps {
  type: CellType;
  userSolution: number;
  candidates: number[];
  numberInPuzzle: number;
  handleClick: (index: number, e: React.MouseEvent<HTMLDivElement>) => void;
  index: number;
}

const BoardCell: React.FC<BoardCellProps> = ({ type, userSolution, candidates, numberInPuzzle, handleClick, index }) => {

  return (
    <>
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
             onClick={(e) => handleClick(index, e)}
        >
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