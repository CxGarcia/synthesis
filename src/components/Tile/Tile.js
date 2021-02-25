import React from 'react';
import styles from './Tile.module.scss';

function Tile({ synth, note, active, row, col, toggleActive }) {
  function handlePlay() {
    synth.triggerAttackRelease(note, '8n');
  }

  return (
    <div
      onMouseDown={() => {
        toggleActive(note, row, col);
        handlePlay();
      }}
      className={`${active ? styles.active : null} ${styles.tile}`}
    ></div>
  );
}

export default Tile;
