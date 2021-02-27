import React from 'react';
import styles from './Sequencer.module.scss';

import Tile from '../Tile/Tile';

const Sequencer = React.memo(function Sequencer({
  instrument,
  pattern,
  toggleActive,
  note,
}) {
  // const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  // notes[row % length] + String()
  // const length = Array.isArray(notes) && notes.length;

  function renderSequence() {
    return pattern.map((arr, row) => {
      return (
        <div className={styles.sequence} key={`R-${row}-N${note}`}>
          {arr.map((active, col) => {
            return (
              <Tile
                instrument={instrument}
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
      <div>{renderSequence()}</div>
    </>
  );
},
compareChangeInPattern);

//Only rerender the sequencer when there is a change in the pattern
function compareChangeInPattern(prevProps, newProps) {
  return (
    prevProps.pattern === newProps.pattern &&
    prevProps.instrument === newProps.instrument
  );
}

export default Sequencer;
