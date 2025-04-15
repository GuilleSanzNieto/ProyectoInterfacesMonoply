import React from 'react';
import './styles/ColorPicker.css';

function ColorPicker({ allColors, usedColors, onColorSelect, onClose }) {
  return (
    <div className="color-picker-overlay">
      <div className="color-picker-container">
        <h2>Elige tu color</h2>
        <div className="color-options">
          {allColors.map((color, index) => {
            const isUsed = usedColors.includes(color.hex);
            return (
              <div
                key={index}
                className={`color-circle ${isUsed ? 'used' : 'available'}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => !isUsed && onColorSelect(color.hex)}
              />
            );
          })}
        </div>
        <button onClick={onClose} className="close-button">Cerrar</button>
      </div>
    </div>
  );
}

export default ColorPicker;
