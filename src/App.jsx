import { useState } from 'react';
import './App.css';
import Inicio from './components/Inicio.jsx';
import Tablero from './components/Tablero.jsx';

function App() {
  const [juegoIniciado, setJuegoIniciado] = useState(false);

  return (
    <>
      {juegoIniciado ? (
        <Tablero />
      ) : (
        <Inicio onStart={() => setJuegoIniciado(true)} />
      )}
    </>
  );
}

export default App;
