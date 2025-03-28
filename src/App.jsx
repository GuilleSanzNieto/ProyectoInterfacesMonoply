import { useState } from 'react';
import './App.css';
import Inicio from './components/Inicio.jsx';
import Tablero from './components/Tablero.jsx';
import { PlayersProvider } from './Contexts/PlayersContext.jsx';

function App() {
  const [juegoIniciado, setJuegoIniciado] = useState(false);

  return (
    <PlayersProvider>
      {juegoIniciado ? (
        <Tablero />
      ) : (
        <Inicio onStart={() => setJuegoIniciado(true)} />
      )}
      {/* <Tablero/> */}
    </PlayersProvider>
  );
}

export default App;