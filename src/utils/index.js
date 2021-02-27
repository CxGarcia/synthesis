import { useRef } from 'react';

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

export { createArr, useDebounce, createMatrix };
