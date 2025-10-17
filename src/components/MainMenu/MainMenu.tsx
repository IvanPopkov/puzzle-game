import styles from './MainMenu.module.css';
import {BASE_URL} from "../../constants.ts";

const MainMenu = () => {
  return (
    <div className={styles.gamesList}>
      <a href={`${BASE_URL}#/sudoku`} style={{width: '33%'}}>
        <img
          alt={'Play sudoku'}
          src={`${import.meta.env.BASE_URL}sudoku-icon-512.png`}
          style={{width: '100%'}}
        />
      </a>
      <div style={{width: '33%', alignContent: 'center'}}>Coming soon...</div>
    </div>
  );
};

export default MainMenu;