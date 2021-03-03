import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';

import Sequencer from '@components/Sequencer/Sequencer';
import Select from '@components/Select/Select';
import { createArr } from '@utils';

import styles from './Sampler.module.scss';

function Sampler({
  Tone,
  dispatch,
  effects,
  id,
  active,
  volume,
  bars,
  subdivisions,
}) {
  const [instrument, setInstrument] = useState('kick');
  const [sample, setSample] = useState(null);
  const [pattern, setPattern] = useState([]);
  const [name, setName] = useState('sampler');

  const totalTiles = bars * subdivisions;
  const note = 'F1';
  // const pitch = 1;

  // update and get the sample with the correct instrument
  useEffect(() => {
    const _sample = new Tone.Sampler({
      urls: {
        A1: `/assets/samples/${instrument}.wav`,
      },
      onload: () => {
        console.log(`${instrument} loaded`);
      },
    });

    _sample.volume.value = volume;
    setSample(_sample);

    return () => _sample.dispose();
  }, [Tone.Sampler, instrument, volume]);

  // add effects to the sample, if any
  useEffect(() => {
    if (sample == null) return;
    const _effects = effects.map((_effect) => _effect.method);

    sample.chain(..._effects, Tone.Destination);
  }, [Tone.Destination, Tone.destination, effects, sample]);

  useLayoutEffect(() => {
    setPattern(createArr(totalTiles));
  }, [bars, dispatch, id, subdivisions, totalTiles]);

  useEffect(() => {
    const sequence = new Tone.Sequence(
      (time, col) => {
        if (pattern[col] !== 0) sample.triggerAttackRelease(note, '1n', time);
      },
      createArr(totalTiles, null, (_, idx) => idx),
      `${subdivisions}n`
    );

    sequence.loop = true;
    sequence.start(0);

    return () => {
      console.log(`disposing ${instrument} sequence`);
      sequence.dispose();
    };
    //eslint-disable-next-line
  }, [Tone.Sequence, bars, subdivisions, pattern, sample]);

  const toggleActive = useCallback(
    (note, _, col) => {
      const _pattern = [...pattern];

      _pattern[col] = _pattern[col] === 0 ? note : 0;
      setPattern(_pattern);
    },
    [pattern]
  );

  const handleSetActiveInstrument = () =>
    dispatch({ type: 'SET_ACTIVE_INSTRUMENT', id });

  const handleDeleteInstrument = () =>
    dispatch({ type: 'DELETE_INSTRUMENT', id });

  const handleSelectInstrument = (option) => setInstrument(option);

  const sampleOptions = [
    'kick',
    'kick-2',
    'open-hh',
    'closed-hh',
    'combo',
    'maracas',
  ];

  return (
    <>
      <div className={styles.instrument}>
        <div className={`${styles.panel} ${active && styles.activePanel}`}>
          <h1 className={styles.delete} onClick={handleDeleteInstrument}>
            X
          </h1>
          <p>{name}</p>
          <span>|</span>
          <Select onChangeFn={handleSelectInstrument} options={sampleOptions} />
          <div
            className={`${styles.fxButton} ${active && styles.activeButton}`}
            onClick={handleSetActiveInstrument}
          >
            FX
          </div>
        </div>
        <Sequencer
          instrument={sample}
          pattern={pattern}
          toggleActive={toggleActive}
          note={note}
        />
      </div>
    </>
  );
}

export default Sampler;
