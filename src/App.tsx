import './App.css';
import MainMenu from "./components/MainMenu/MainMenu.tsx";
import {HashRouter, Route, Routes} from "react-router";
import Sudoku from "./games/Sudoku/Sudoku.tsx";


function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainMenu/>}/>
        <Route path="/sudoku" element={<Sudoku/>}/>
      </Routes>
    </HashRouter>
  )
}

export default App
