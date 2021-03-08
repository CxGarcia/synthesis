import { useRef } from 'react';
const { Scale, Chord } = require('@tonaljs/tonal');

function randomChordProgression(root = 'C', octave = 5, scale) {
  const scaleName = `${root}${octave} ${scale}`;
  const scaleNotes = Scale.get(scaleName).notes;
  const scaleChords = Scale.scaleChords(scaleName);

  const progression = [];

  for (let i = 0; i < 4; i++) {
    const noteIdx = randomNumberGenerator(scaleNotes.length - 1);
    const chordIdx = randomNumberGenerator(scaleChords.length - 1);

    const chord = scaleNotes[noteIdx][0] + scaleChords[chordIdx];
    const notes = Chord.get(chord).notes;
    progression.push(notes.map((note) => note + octave));
  }

  return progression;
}

function randomNumberGenerator(max) {
  return Math.round(Math.random() * max);
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

function createMatrix(row, col) {
  const matrix = Array(row)
    .fill(0)
    .map((_) => createArr(col));
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
