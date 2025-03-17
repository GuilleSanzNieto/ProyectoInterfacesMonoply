import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dados from './components/Dados.jsx'
import Tablero from './components/Tablero.jsx'
import TicTacToe from './components/TicTacToe.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TicTacToe />
  </StrictMode>,
)
