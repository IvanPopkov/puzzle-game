import './App.css';
import MainMenu from "./components/MainMenu/MainMenu.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import Sudoku from "./components/Sudoku/Sudoku.tsx";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainMenu/>}/>
          <Route path="/sudoku" element={<Sudoku/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
