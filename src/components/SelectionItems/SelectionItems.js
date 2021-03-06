import React, { useRef } from 'react';
import styles from './SelectionItems.module.scss';

function SelectionItems({ Tone, name, category }) {
  const prevSample = useRef(null);

  function handleClick() {
    prevSample.current && prevSample.current.dispose();
    const _sample = new Tone.Sampler({
      urls: {
        A1: `http://localhost:3000/samples/${category}/${name}`,
      },
      onload: () => {
        _sample.triggerAttackRelease('F1', 2.5);
        prevSample.current = _sample;
      },
      volume: 0,
    }).toDestination();
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <p>{name.replace('.wav', '')}</p>
    </div>
  );
}

export default SelectionItems;
