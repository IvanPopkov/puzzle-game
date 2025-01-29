import './MainMenu.css'

const MainMenu = () => {
  return (
    <div className="container">
      <a href="/sudoku" className="sudoku-game">Play Sudoku</a>
      <a href="/kenken" className="kenken-game">Play KenKen</a>
    </div>
  );
};

export default MainMenu;