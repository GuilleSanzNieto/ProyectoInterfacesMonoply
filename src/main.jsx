import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dados from './components/Dados.jsx'
import Tablero from './components/Tablero.jsx'
import TicTacToe from './juegos/TicTacToe.jsx'
<<<<<<< HEAD

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
=======
import MemoriCard from './juegos/MemoriCard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemoriCard />
>>>>>>> 9cc2ff8ddeca968f746d59f6383c4f23ba39872f
  </StrictMode>,
)
