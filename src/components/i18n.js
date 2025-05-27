// src/i18n.js
import { useSettings } from './SettingsContext.jsx';

export const texts = {
  es: {
    ajustesTitulo:       'Ajustes del juego',
    modoOscuro:          'Modo oscuro',
    modoDaltonico:       'Modo daltónico',
    idioma:              'Idioma',
    cerrar:              'Cerrar',
    numeroJugadores:     'Número de Jugadores',
    jugar:               'JUGAR',
    instruccionesTitulo: '📜 Instrucciones del Monopoly UMA',
    nombreJugador:       'Nombre del Jugador',
    // …añade aquí todas las claves que necesites…
  },
  en: {
    ajustesTitulo:       'Game Settings',
    modoOscuro:          'Dark Mode',
    modoDaltonico:       'Colorblind Mode',
    idioma:              'Language',
    cerrar:              'Close',
    numeroJugadores:     'Number of Players',
    jugar:               'PLAY',
    instruccionesTitulo: '📜 Monopoly UMA Instructions',
    nombreJugador:       'Player Name',
    // …
  }
};

// Hook para usarlo fácil en cualquier componente
export function useTranslation() {
  const { language } = useSettings();
  return texts[language];
}
