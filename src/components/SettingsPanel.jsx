// src/components/SettingsPanel.jsx
import React from 'react';
import { useTranslation } from './i18n.js';
import { useSettings } from './SettingsContext.jsx';

export const SettingsPanel = ({ onClose }) => {
  const t = useTranslation();
  const {
    darkMode, toggleDark,
    colorBlindMode, toggleColorBlind,
    language, setLanguage
  } = useSettings();

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <h2>{t.ajustesTitulo}</h2>

        <div className="settings-row">
          <label>
            <input type="checkbox" checked={darkMode} onChange={toggleDark} />
            {t.modoOscuro}
          </label>
        </div>

        <div className="settings-row">
          <label>
            <input type="checkbox" checked={colorBlindMode} onChange={toggleColorBlind} />
            {t.modoDaltonico}
          </label>
        </div>

        <div className="settings-row">
          <label>
            {t.idioma}:
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>

        <div className="settings-footer">
          <button className="btn-close" onClick={onClose}>
            {t.cerrar}
          </button>
        </div>
      </div>
    </div>
  );
};
