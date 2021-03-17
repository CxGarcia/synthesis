import { useRef } from 'react';
const { Scale } = require('@tonaljs/tonal');

function randomChordProgression(root = 'C', octave = 4, scale) {
  const scaleName = `${root} ${scale}`;

  const scaleNotes = Scale.get(scaleName).notes;

  const chordGen = scaleNotes.concat(scaleNotes);

  const newChord = [];

  for (let i = 0; i < scaleNotes.length; i++) {
    const noteIdx = randomNumberGenerator(scaleNotes.length - 1);
    newChord.push(
      chordGen[noteIdx] + octave,
      chordGen[noteIdx + 2] + octave,
      chordGen[noteIdx + 4] + octave
    );
  }

  console.log(newChord);
  return newChord.slice(0, 16);
}

function randomNumberGenerator(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(arr) {
  let arrCopy = [...arr];

  for (let i = 0; i < arrCopy.length; i++) {
    const randIdx = randomNumberGenerator(i);
    const shuffle1 = arrCopy[i];

    arrCopy[i] = arrCopy[randIdx];
    arrCopy[randIdx] = shuffle1;
  }

  return arrCopy;
}

function useDebounce(fn, timeout = 1000) {
  let timeoutRef = useRef(null);

  return (...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      return fn(...args);
    }, timeout);
  };
}

function createArr(n, fill = 0, cb = (el) => el) {
  const arr = Array(n).fill(fill).map(cb);
  return arr;
}

function createMatrix(row, col, cb = (_) => createArr(col)) {
  const matrix = Array(row).fill(0).map(cb);

  return matrix;
}

function compareChanges(prevProps, newProps) {
  return (
    prevProps.active === newProps.active &&
    prevProps.properties === newProps.properties
  );
}

export {
  createArr,
  useDebounce,
  createMatrix,
  compareChanges,
  randomChordProgression,
};
