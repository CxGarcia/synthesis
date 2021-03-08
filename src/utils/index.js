import { useRef } from 'react';
const { Scale, Chord, Note } = require('@tonaljs/tonal');

function randomChordProgression(root = 'C', octave = 5, scale) {
  const scaleName = `${root} ${scale}`;
  const scaleNotes = Scale.get(scaleName).notes;
  const scaleChords = Scale.scaleChords(scaleName);

  const progression = [];

  for (let i = 0; i < 16; i++) {
    const noteIdx = randomNumberGenerator(scaleNotes.length - 1);
    const chordIdx = randomNumberGenerator(scaleChords.length - 1);

    const chord = scaleNotes[noteIdx] + scaleChords[chordIdx];
    // const notes = Chord.get(chord).notes;
    const _note = scaleNotes[noteIdx];

    const note = Note.simplify(_note);
    progression.push(note + octave);

    // progression.push(notes.map((note) => note + octave));

    // scaleNotes.forEach((note) => progression.push(note + octave));
    // notes.forEach((_note) => {
    //   const note = Note.simplify(_note);
    //   progression.push(note + octave);
    // });
  }

  return progression;
  // return progression;

  // return shuffle(progression);
  // return [...new Set(progression)];
  // return scaleNotes;
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
