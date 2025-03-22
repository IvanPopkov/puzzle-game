import './MainMenu.css'
import {BASE_URL} from "../../constants.ts";

const MainMenu = () => {
  return (
    <div className="container">
      <a href={`${BASE_URL}sudoku`} className="sudoku-game">Play Sudoku</a>
      <a href={`${BASE_URL}kenken`} className="kenken-game">Play KenKen</a>
    </div>
  );
};

export default MainMenu;