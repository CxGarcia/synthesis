import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';

import Sequencer from '../../Sequencer/Sequencer';
import styles from './Synth.module.scss';
import { createArr, createMatrix } from '../../../utils';

function Synth({ Tone, dispatch, effects, id, active, volume }) {
  const [synth, setSynth] = useState(null);
  const [pattern, setPattern] = useState([]);
  const [name, setName] = useState('synth');
  const [configs, setConfigs] = useState({
    bars: 1,
    subdivisions: 16,
  });

  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  useEffect(() => {
    const _synth = new Tone.PolySynth(Tone.Synth, {
      volume: -8,
      portamento: 0.005,
    }).toDestination();

    _synth.volume.value = volume;
    setSynth(_synth);

    return () => _synth.dispose();
  }, [Tone.PolySynth, Tone.Synth, volume]);

  const toggleActive = useCallback(
    (note, row, col) => {
      const _pattern = [...pattern];

      _pattern[row][col] = _pattern[row][col] === 0 ? note : 0;
      setPattern(_pattern);
    },
    [pattern]
  );

  useEffect(() => {
    const sequence = new Tone.Sequence(
      (time, col) => {
        pattern.forEach((row, noteIdx) => {
          if (row[col] !== 0) {
            synth.triggerAttackRelease(['C4', 'E4', 'G4'], '8n', time);
          }
        });
      },

      createArr(configs.subdivisions * configs.bars, null, (_, idx) => idx),
      `${configs.subdivisions}n`
    );

    sequence.loop = true;
    sequence.start(0);

    return () => {
      console.log('disposing sequence');
      sequence.dispose();
    };
  }, [Tone.Sequence, configs.bars, configs.subdivisions, pattern, synth]);

  // add effects to synth, if any
  useEffect(() => {
    if (synth == null) return;
    const _effects = effects.map((_effect) => _effect.method);

    synth.chain(..._effects, Tone.Destination);
  }, [Tone.Destination, Tone.destination, effects, synth]);

  useLayoutEffect(() => {
    setPattern(createMatrix(notes.length, configs.subdivisions * configs.bars));
  }, [configs.bars, configs.subdivisions, notes.length]);

  const handleSetActiveInstrument = () =>
    dispatch({ type: 'SET_ACTIVE_INSTRUMENT', id });

  const handleDeleteInstrument = () =>
    dispatch({ type: 'DELETE_INSTRUMENT', id });

  return (
    <>
      <div className={styles.instrument}>
        <div className={`${styles.panel} ${active && styles.activePanel}`}>
          <h1 className={styles.delete} onClick={handleDeleteInstrument}>
            X
          </h1>
          <p>{name}</p>
          {/* <span>|</span> */}
          {/* <Select onChangeFn={handleSelectInstrument} options={sampleOptions} /> */}
          <div
            className={`${styles.fxButton} ${active && styles.activeButton}`}
            onClick={handleSetActiveInstrument}
          >
            FX
          </div>
        </div>
        <Sequencer
          instrument={synth}
          pattern={pattern}
          toggleActive={toggleActive}
          // note={note}
        />
      </div>
    </>
  );
}

export default Synth;
