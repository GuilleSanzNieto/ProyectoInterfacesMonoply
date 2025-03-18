import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dados from './components/Dados.jsx'
import Tablero from './components/Tablero.jsx'
import TicTacToe from './juegos/TicTacToe.jsx'
import WordSearch from './juegos/WordSearch.jsx'
import MemoriCard from './juegos/MemoriCard.jsx'
import Sudoku from './juegos/Sudoku.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sudoku />
  </StrictMode>
)
