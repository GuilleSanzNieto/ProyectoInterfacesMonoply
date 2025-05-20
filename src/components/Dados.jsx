import React, { useRef, useState, useEffect } from 'react';
import './styles/Dados.css';

const Dados = ({ spinning, setValor, index }) => {
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

  useEffect(() => {
    if (spinning) {
      spin();
    }
  }, [spinning]);

  const resetAnimation = (element) => {
    element.style.animation = 'none';
    element.offsetHeight; // Forzar un reflujo del DOM
    element.style.animation = '';
  };

  const spin = () => {
    //const randomNum = Math.floor(Math.random() * 6) + 1;
    const randomNum = 6;
    
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
      resetAnimation(cubeRef.current);
      cubeRef.current.style.animationDirection = 'normal';
      cubeRef.current.style.animation = `${newKindaSpin} 1000ms ease-in-out forwards`;
    }

    setTimeout(() => {
      if (numRefs[newA].current) {
        resetAnimation(numRefs[newA].current);
        numRefs[newA].current.style.animation = 'fadeIn 2s linear forwards';
        setValor(previouState => {
          return {
            ...previouState,
            [index]: randomNum
          }
        });
        
      }
    }, 2000);
  };

  return (
    <div className="content">
      <div className="cube" id="cube" ref={cubeRef}>
        <div className="face one" ref={numRefs[1]}>
          <div className="dot"></div>
        </div>
        <div className="face two" ref={numRefs[2]}>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="face three" ref={numRefs[3]}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="face four" ref={numRefs[4]}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="face five" ref={numRefs[5]}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="face six" ref={numRefs[6]}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Dados;