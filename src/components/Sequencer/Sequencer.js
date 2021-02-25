import React from 'react';
import styles from './Sequencer.module.scss';

import Tile from '../Tile/Tile';

function Sequencer({ synth, pattern, toggleActive }) {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const length = notes.length;

  function renderSequence(pitch) {
    return pattern.map((arr, row) => {
      const note = notes[row % length] + String(pitch);
      return (
        <div className={styles.sequence} key={`R-${row}-N${note}`}>
          <h2>{note}</h2>
          {arr.map((active, col) => {
            return (
              <Tile
                synth={synth}
                note={note}
                key={`R-${row}-C${col}-N${note}`}
                active={active !== 0}
                row={row}
                col={col}
                toggleActive={toggleActive}
              />
            );
          })}
        </div>
      );
    });
  }

  return (
    <>
      <div>{renderSequence(4)}</div>
    </>
  );
}

const MemoedSequencer = React.memo(Sequencer, compareChangeInPattern);

//Only rerender the sequencer when there is a change in the pattern
function compareChangeInPattern(prevProps, newProps) {
  return prevProps.pattern === newProps.pattern;
}
export default MemoedSequencer;
