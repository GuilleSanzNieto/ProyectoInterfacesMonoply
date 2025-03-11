import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Tablero from './components/Tablero.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tablero />
  </StrictMode>,
)
