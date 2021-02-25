function createArr(n, fill = 0, cb = (el) => el) {
  return Array(n).fill(fill).map(cb);
}

export { createArr };
