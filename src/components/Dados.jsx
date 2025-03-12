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
        <div className="face one">
          <div className="num" id="num1" ref={numRefs[1]}>
            1
          </div>
        </div>
        <div className="face two">
          <div className="num" id="num2" ref={numRefs[2]}>
            2
          </div>
        </div>
        <div className="face three">
          <div className="num" id="num3" ref={numRefs[3]}>
            3
          </div>
        </div>
        <div className="face four">
          <div className="num" id="num4" ref={numRefs[4]}>
            4
          </div>
        </div>
        <div className="face five">
          <div className="num" id="num5" ref={numRefs[5]}>
            5
          </div>
        </div>
        <div className="face six">
          <div className="num" id="num6" ref={numRefs[6]}>
            6
          </div>
        </div>
      </div>
    </div>
  );
}

export default CubeSpinner;