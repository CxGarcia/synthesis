import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

import Sequencer from '@components/Sequencer/Sequencer';
import InstrumentContainer from '../InstrumentContainer/InstrumentContainer';

import {
  createArr,
  createMatrix,
  compareChanges,
  randomChordProgression,
} from '@utils';
import synthBuilder from './synthBuilder';
import styles from './Synth.module.scss';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const Synth = React.memo(function Synth({
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
    octave,
    volume,
    bars,
    subdivisions,
    envelope,
    oscillator,
    arpeggiator = true,
    savedPattern = [],
  } = properties;

  const {
    createSynth,
    createSynthSequence,
    createArpeggiatorSequence,
    setNewOctaveToPattern,
    options,
  } = synthBuilder(Tone);

  const [synth, setSynth] = useState(null);
  const [instrument, setInstrument] = useState(_instrument);

  const [pattern, setPattern] = useState(savedPattern);
  const [progression, setProgression] = useState([]);

  const totalTiles = bars * subdivisions;

  useEffect(() => {
    const _synth = createSynth(
      instrument,
      envelope,
      volume,
      effects,
      oscillator
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
    instrument,
    volume,
    effects,
    envelope,
    oscillator,
    octave,
  ]);

  const toggleActive = (col, row, note) => {
    const _progression = [...progression];

    _progression[col] = progression[col] !== note ? note : 0;

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
  //     // const _chords = setNewOctaveToChords(chords, octave);
  //   }

  //   //eslint-disable-next-line
  // }, [octave]);

  useEffect(() => {
    const sequence = arpeggiator
      ? createArpeggiatorSequence(synth, progression)
      : createSynthSequence(synth, progression, bars, subdivisions);

    return () => {
      console.log('disposing sequence');
      sequence.dispose();
    };
  }, [
    arpeggiator,
    bars,
    createArpeggiatorSequence,
    createSynthSequence,
    progression,
    subdivisions,
    synth,
  ]);

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

  function handleRandomProgression() {
    const _progression = randomChordProgression('E', octave, 'aeolian');
    const _indexOfNotes = getIndexOfNotes(_progression);
    const _pattern = createMatrixWithPattern(
      notes.length,
      totalTiles,
      _indexOfNotes
    );
    // const _pattern =

    // const cb = createArr(totalTiles, null, (el, idx) => {

    // })

    setPattern(_pattern);
    setProgression(_progression);
  }

  return (
    <>
      <div className={styles.instrument}>
        <div>
          <InstrumentContainer
            handleSelectInstrument={handleSelectInstrument}
            handleSetActiveInstrument={handleSetActiveInstrument}
            handleDeleteInstrument={handleDeleteInstrument}
            options={options}
            name={`${subCategory} | ${_instrument}`}
            active={active}
          />
          <button onClick={handleRandomProgression}>XXX</button>
        </div>
        <div className={styles.keyboard}>
          <Sequencer
            instrument={synth}
            pattern={pattern}
            toggleActive={toggleActive}
            keyboard={true}
            octave={octave}
          />
        </div>
      </div>
    </>
  );
},
compareChanges);

export default Synth;

function getIndexOfNotes(progression) {
  return progression.map((note, i) => {
    return notes.indexOf(note.replace(/[0-9]/g, ''));
  });
}

function createMatrixWithPattern(rows, cols, indexes) {
  return Array(rows)
    .fill(null)
    .map((_, row) => {
      return Array(cols)
        .fill(null)
        .map((_, col) => {
          if (row === indexes[col]) return 1;
          else return 0;
        });
    });
}
