import React from 'react';
import styles from './Tile.module.scss';

function Tile({ instrument, note, active, row, col, toggleActive }) {
  function handlePlay() {
    if (active) return;
    instrument.triggerAttackRelease(note, '8n');
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
