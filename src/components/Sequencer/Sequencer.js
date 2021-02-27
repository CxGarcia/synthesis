import React from 'react';
import styles from './Sequencer.module.scss';

import Tile from '../Tile/Tile';

const Sequencer = React.memo(function Sequencer({
  instrument,
  pattern,
  toggleActive,
  note,
  keyboard,
}) {
  function renderKeyboard() {
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
    const length = notes.length;
    return pattern.map((_pattern, row) => {
      const note = notes[row % length] + String();
      return renderSequence(_pattern, note, row);
    });
  }

  function renderSequence(_pattern, _note, row = 0) {
    return (
      <div className={styles.sequence} key={`R-${row}-N${note}`}>
        {_pattern.map((active, col) => {
          return (
            <Tile
              instrument={instrument}
              note={_note}
              key={`R${row}-C${col}-N${_note}`}
              active={active !== 0}
              row={row}
              col={col}
              toggleActive={toggleActive}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.sequencer}>
      {keyboard ? renderKeyboard() : renderSequence(pattern, note)}
    </div>
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

// const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
// notes[row % length] + String()
// const length = Array.isArray(notes) && notes.length;

// function renderSequence() {
//   return pattern.map((arr, row) => {
//     return (
//       <div className={styles.sequence} key={`R-${row}-N${note}`}>
//         {arr.map((active, col) => {
//           return (
//             <Tile
//               instrument={instrument}
//               note={note}
//               key={`R-${row}-C${col}-N${note}`}
//               active={active !== 0}
//               row={row}
//               col={col}
//               toggleActive={toggleActive}
//             />
//           );
//         })}
//       </div>
//     );
//   });
// }
