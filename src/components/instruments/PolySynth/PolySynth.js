import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

import InstrumentContainer from '../InstrumentContainer/InstrumentContainer';
import Sequencer from '@components/Sequencer/Sequencer';
import Select from '@components/Select/Select';

import { createArr, createMatrix, compareChanges } from '@utils';
import polySynth from './polySynthBuilder';

import styles from './PolySynth.module.scss';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PolySynth = React.memo(function PolySynth({
  Tone,
  dispatch,
  active,
  properties,
  instrument: _instrument,
  subCategory,
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
    savedChords = [],
    savedPattern = [],
  } = properties;

  const {
    createSynth,
    createSynthSequence,
    addNoteToChord,
    removeNoteFromChord,
    setNewPitchToChords,
    options,
  } = polySynth(Tone);

  const [instrument, setInstrument] = useState(_instrument);
  const [synth, setSynth] = useState(null);
  const [chords, setChords] = useState(savedChords);
  const [pattern, setPattern] = useState(savedPattern);

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
    const _pattern = [...pattern];
    let _chords;

    if (_pattern[row][col] === 0) {
      _chords = addNoteToChord(chords, note, col);
      _pattern[row][col] = 1;
    } else {
      _chords = removeNoteFromChord(chords, note, col);
      _pattern[row][col] = 0;
    }

    setPattern(_pattern);
    setChords(_chords);
  };

  //TODO: decide if this feature is worth it or not
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (chords && !isInitialMount.current) {
      const _chords = setNewPitchToChords(chords, pitch);
      setChords(_chords);
    }

    //eslint-disable-next-line
  }, [pitch]);

  useEffect(() => {
    const sequence = createSynthSequence(synth, chords, bars, subdivisions);

    return () => {
      console.log('disposing sequence');
      sequence.dispose();
    };
  }, [Tone, bars, chords, createSynthSequence, subdivisions, synth]);

  //rerender pattern if the amount of bars changes
  useLayoutEffect(() => {
    setPattern(createMatrix(notes.length, totalTiles));
    setChords(createArr(totalTiles, []));
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
          name={`${subCategory} | ${_instrument}`}
          active={active}
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

export default PolySynth;
