import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  // useCallback,
} from 'react';

import Sequencer from '@components/Sequencer/Sequencer';
import { createArr, createMatrix } from '@utils';

import styles from './Synth.module.scss';

const savedPattern = [
  ['D#2'],
  [],
  [],
  ['C2'],
  [],
  [],
  ['G2'],
  [],
  [],
  [],
  ['D#2'],
  [],
  ['C2'],
  [],
  [],
  [],
];

const savedMatrix = [
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function Synth({
  Tone,
  dispatch,
  effects,
  id,
  active,
  volume,
  bars,
  subdivisions,
  pitch,
  envelope,
}) {
  const [synth, setSynth] = useState(null);
  const [pattern, setPattern] = useState([]);
  const [name, setName] = useState('synth');
  const totalTiles = bars * subdivisions;

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

  const [chords, setChords] = useState([]);

  useEffect(() => {
    const [attack, decay, sustain, release] = envelope;

    const _synth = new Tone.PolySynth(Tone.Synth, {
      volume: volume,
      portamento: 0.005,
    }).toDestination();

    _synth.set({
      oscillator: { volume: 12, type: 'sine' },
      envelope: { attack, decay, sustain, release },
      // filterEnvelope: {
      //   frequency: 100,
      //   attack: 0.1,
      //   decay: 0.2,
      //   sustain: 0.1,
      //   release: 0,
      // },
    });

    setSynth(_synth);

    return () => {
      console.log('disposing synth');
      synth && synth.dispose();
    };
    //eslint-disable-next-line
  }, [Tone.PolySynth, Tone.Synth, volume, envelope]);

  const toggleActive = (note, row, col) => {
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
  };

  useEffect(() => {
    const sequence = new Tone.Sequence(
      (time, col) => {
        if (chords[col].length < 1) return;
        synth.triggerAttackRelease(chords[col], '8n', time);
      },

      createArr(totalTiles, null, (_, idx) => idx),
      `${subdivisions}n`
    );

    sequence.loop = true;
    sequence.start(0);

    return () => {
      console.log('disposing sequence');
      sequence.dispose();
    };
  }, [Tone.Sequence, chords, pattern, subdivisions, synth, totalTiles]);

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
    setPattern(savedMatrix || createMatrix(notes.length, totalTiles));
    setChords(savedPattern || createArr(totalTiles, []));
  }, [notes.length, totalTiles]);

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
            pitch={pitch}
          />
        </div>
      </div>
    </>
  );
}

export default Synth;
