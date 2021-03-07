import React from 'react';

import Select from '@components/Select/Select';

import styles from './Oscillator.module.scss';

function Oscillator({ dispatch }) {
  const options = ['sine', 'square', 'sawtooth', 'triangle', 'none'];

  function handleOscillator(oscType) {
    dispatch({ type: 'UPDATE_OSCILLATOR', oscType });
  }

  return (
    <>
      <h3 className={styles.title}>Oscillator</h3>
      <Select options={options} onChangeFn={handleOscillator} />
    </>
  );
}

export default Oscillator;
