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
      style={{
        background: active ? 'red' : 'white',
        height: '2rem',
        width: '2rem',
        color: 'white',
        border: '1px dashed black',
        boxSizing: 'border-box',
      }}
    ></div>
  );
}

export default Tile;
