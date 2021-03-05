import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

import Sequencer from '@components/Sequencer/Sequencer';
import InstrumentContainer from '../InstrumentContainer/InstrumentContainer';

import { createArr, createMatrix, compareChanges } from '@utils';
import synthBuilder from './synthBuilder';
import styles from './Synth.module.scss';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const Synth = React.memo(function Synth({
  Tone,
  dispatch,
  active,
  properties,
}) {
  const {
    effects,
    id,
    volume,
    bars,
    subdivisions,
    pitch,
    envelope,
    oscillators,

    savedPattern = [],
  } = properties;

  const {
    createSynth,
    createSynthSequence,
    setNewPitchToChords,
    options,
  } = synthBuilder(Tone);

  const [instrument, setInstrument] = useState('Synth');
  const [synth, setSynth] = useState(null);
  const [pattern, setPattern] = useState(savedPattern);
  const [progression, setProgression] = useState([]);

  const totalTiles = bars * subdivisions;

  useEffect(() => {
    const _synth = createSynth(
      instrument,
      envelope,
      volume,
      effects,
      oscillators
    );
    setSynth(_synth);

    return () => {
      console.log('disposing synth');
      synth && synth.dispose();
    };
    //eslint-disable-next-line
  }, [
    Tone.PolySynth,
    Tone.Synth,
    volume,
    envelope,
    effects,
    instrument,
    pitch,
  ]);

  const toggleActive = (col, row, note) => {
    const _progression = [...progression];

    _progression[col] = note;

    const _pattern = pattern.map((patternRow, currRow) => {
      return patternRow.map((el, idx) => {
        if (idx !== col) return el;
        else if (row === currRow && el === 0) return note;
        else return 0;
      });
    });

    setProgression(_progression);
    setPattern(_pattern);
  };

  //TODO: decide if this feature is worth it or not
  // const isInitialMount = useRef(true);
  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else if (chords && !isInitialMount.current) {
  //     // const _chords = setNewPitchToChords(chords, pitch);
  //   }

  //   //eslint-disable-next-line
  // }, [pitch]);

  useEffect(() => {
    const sequence = createSynthSequence(
      synth,
      progression,
      bars,
      subdivisions
    );

    return () => {
      console.log('disposing sequence');
      sequence.dispose();
    };
  }, [bars, createSynthSequence, progression, subdivisions, synth]);

  //rerender pattern if the amount of bars changes
  useLayoutEffect(() => {
    setProgression(createArr(totalTiles));
    setPattern(createMatrix(notes.length, totalTiles));
  }, [totalTiles]);

  const handleSetActiveInstrument = () =>
    dispatch({ type: 'SET_ACTIVE_INSTRUMENT', id });

  const handleDeleteInstrument = () =>
    dispatch({ type: 'DELETE_INSTRUMENT', id });

  const handleSelectInstrument = (option) => setInstrument(option);

  return (
    <>
      <div className={styles.instrument}>
        <InstrumentContainer
          handleSelectInstrument={handleSelectInstrument}
          handleSetActiveInstrument={handleSetActiveInstrument}
          handleDeleteInstrument={handleDeleteInstrument}
          options={options}
          name="Synth"
          active
        />
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
},
compareChanges);

export default Synth;
