import React, { useRef, useState } from 'react';
import './styles/Dados.css'; // Asegúrate de que el CSS esté en un archivo llamado CubeSpinner.css

function CubeSpinner() {
  const [a, setA] = useState(1);
  const cubeRef = useRef(null);
  const numRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
    5: useRef(null),
    6: useRef(null),
  };
  const [kindaSpin, setKindaSpin] = useState('');

  const spin = () => {
    const randomNum = Math.floor(Math.random() * 6) + 1;
    const randomNumStr = randomNum.toString();

    Object.values(numRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.style.animation = '';
      }
    });

    let newKindaSpin = '';
    let newA = '';

    switch (randomNum) {
      case 1:
        newKindaSpin = 'one';
        newA = '1';
        break;
      case 2:
        newKindaSpin = 'two';
        newA = '2';
        break;
      case 3:
        newKindaSpin = 'three';
        newA = '3';
        break;
      case 4:
        newKindaSpin = 'four';
        newA = '4';
        break;
      case 5:
        newKindaSpin = 'five';
        newA = '5';
        break;
      case 6:
        newKindaSpin = 'six';
        newA = '6';
        break;
      default:
        break;
    }

    setKindaSpin(newKindaSpin);
    setA(newA);

    if (cubeRef.current) {
      cubeRef.current.style.animationDirection = 'normal';
      cubeRef.current.style.animation = `${newKindaSpin} 2500ms ease-in-out forwards`;
    }

    setTimeout(() => {
      if (numRefs[newA].current) {
        numRefs[newA].current.style.animation = 'fadeIn 2s linear forwards';
      }
    }, 2000);
  };

  return (
    <div className="content" onClick={spin}>
      <div className="cube" id="cube" ref={cubeRef}>
        <div className="face one" ref={numRefs[1]}>
          <div class="dot"></div>
        </div>
        <div className="face two" ref={numRefs[2]}>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div className="face three" ref={numRefs[3]}>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div className="face four" ref={numRefs[4]}>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div className="face five" ref={numRefs[5]}>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div className="face six" ref={numRefs[6]}>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  );
}

export default CubeSpinner;