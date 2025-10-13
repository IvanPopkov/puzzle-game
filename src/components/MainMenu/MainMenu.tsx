import styles from './MainMenu.module.css';
import {BASE_URL} from "../../constants.ts";

const MainMenu = () => {
  return (
    <div className={styles.gamesList}>
      <a href={`${BASE_URL}#/sudoku`} className="sudoku-game">
        <img
          alt={'Play sudoku'}
          src={`${import.meta.env.BASE_URL}sudoku-icon-512.png`}
          style={{width: '320px', height: '320px'}}
        />
      </a>
      <a href={`${BASE_URL}#/kenken`} className="kenken-game">Play KenKen</a>
    </div>
  );
};

export default MainMenu;