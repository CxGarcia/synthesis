import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';

import styles from './Synth.module.scss';

function Synth({ Tone }) {
  const synth = new Tone.Synth().toDestination();
  const [pattern, setPattern] = useState([]);
  const [configs, setConfigs] = useState();

  const piano = new Tone.PolySynth(Tone.Synth, {
    volume: -8,
    portamento: 0.005,
  }).toDestination();

  useEffect(() => {
    const sequence = new Tone.Sequence(
      (time, col) => {
        pattern.forEach((row, noteIdx) => {
          if (row[col] !== 0) {
            piano.triggerAttackRelease(['C4', 'E4', 'G4'], '8n', time);
          }
        });
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      '1n'
    );

    sequence.loop = true;
    sequence.start(0);

    return () => {
      console.log('disposing sequence');
      sequence.dispose();
    };
  }, [pattern, piano]);

  useEffect(() => {
    setPattern(
      Array(4)
        .fill(0)
        .map((_) => Array(4).fill(0))
    );
  }, []);

  const toggleActive = useCallback(
    (note, row, col) => {
      const _pattern = [...pattern];

      _pattern[row][col] = _pattern[row][col] === 0 ? note : 0;
      setPattern(_pattern);
    },
    [pattern]
  );

  return (
    <div>
      <div className={styles.instrument}>
        <div className={styles.panel}>Synth</div>
        {/* <Sequencer
          synth={synth}
          pattern={pattern}
          toggleActive={toggleActive}
        /> */}
      </div>
    </div>
  );
}

export default Synth;
