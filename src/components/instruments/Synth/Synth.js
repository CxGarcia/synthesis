import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
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

  const synthRef = useRef(null);

  const [chords, setChords] = useState(
    createArr(configs.subdivisions * configs.bars, [])
  );

  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  useEffect(() => {
    const _synth = new Tone.PolySynth(Tone.Synth, {
      volume: -8,
      portamento: 0.005,
    }).toDestination();

    _synth.volume.value = volume;
    synthRef.current = _synth;

    setSynth(_synth);

    return () => synthRef.current.dispose();
  }, [Tone.PolySynth, Tone.Synth, volume]);

  const toggleActive = useCallback(
    (note, row, col) => {
      const _pattern = [...pattern];

      const _chords = chords.map((chord, idx) => {
        if (idx !== col) return chord;
        else return [...chord, note];
      });

      _pattern[row][col] = _pattern[row][col] === 0 ? note : 0;

      setPattern(_pattern);
      setChords(_chords);
    },
    [pattern, chords]
  );

  useEffect(() => {
    const sequence = new Tone.Sequence(
      (time, col) => {
        if (chords[col].length < 1) return;
        synth.triggerAttackRelease(chords[col], '8n', time);
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
  }, [
    Tone.Sequence,
    chords,
    configs.bars,
    configs.subdivisions,
    pattern,
    synth,
  ]);

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
          keyboard={true}
        />
      </div>
    </>
  );
}

export default Synth;
