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
    bars: 2,
    subdivisions: 16,
    pitchRange: '3-4',
  });

  // const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const notes = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const [chords, setChords] = useState(
    createArr(configs.subdivisions * configs.bars, [])
  );

  useEffect(() => {
    const _synth = new Tone.PolySynth(Tone.Synth, {
      volume: volume,
      portamento: 0.005,
    }).toDestination();

    _synth.set({
      oscillator: { volume: 0, type: 'triangle' },
      envelope: { attack: 0.5, decay: 0.5, sustain: 0.5, release: 1 },
      filter: { type: 'lowpass', frequency: 200 },
      filterEnvelope: {
        frequency: 200,
        attack: 0.1,
        decay: 0,
        sustain: 0,
        release: 0,
      },
    });

    setSynth(_synth);

    return () => {
      console.log('disposing synth');
      synth && synth.dispose();
    };
  }, [Tone.PolySynth, Tone.Synth, volume]);

  const toggleActive = useCallback(
    (note, row, col) => {
      const _pattern = [...pattern];
      let _chords;

      if (_pattern[row][col] === 0) {
        _chords = chords.map((chord, idx) => {
          if (idx !== col) return chord;
          else return [...chord, note];
        });

        _pattern[row][col] = 1;
      } else {
        _chords = chords.map((chord, idx) => {
          if (idx !== col) return chord;
          else return chord.filter((_note) => _note !== note);
        });

        _pattern[row][col] = 0;
      }

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
    if (!synth) return;
    const _effects = effects.map((_effect) => _effect.method);

    synth.chain(..._effects, Tone.Destination);

    // return () => {
    //   _effects.forEach((_effect) => _effect.dispose());
    // };
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
        <div className={styles.keyboard}>
          <Sequencer
            instrument={synth}
            pattern={pattern}
            toggleActive={toggleActive}
            keyboard={true}
          />
        </div>
      </div>
    </>
  );
}

export default Synth;
