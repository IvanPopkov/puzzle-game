import styles from './MainMenu.module.css';
import {BASE_URL} from "../../constants.ts";

const MainMenu = () => {
  return (
    <div className={styles.gamesList}>
      <a href={`${BASE_URL}#/sudoku`} className={styles.sudoku}>
        <img
          alt={'Play sudoku'}
          src={`${import.meta.env.BASE_URL}sudoku-icon-512.png`}
          style={{width: '100%'}}
        />
        <div>Play sudoku</div>
      </a>
    </div>
  );
};

export default MainMenu;