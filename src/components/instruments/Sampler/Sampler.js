import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';

import Sequencer from '../../Sequencer/Sequencer';
import Select from '../../Select/Select';
import styles from './Sampler.module.scss';
import { createArr } from '../../../utils';

function Sampler({ Tone, dispatch, effects, id, active }) {
  const [configs, setConfigs] = useState({
    bars: 1,
    subdivisions: 16,
  });

  const [instrument, setInstrument] = useState('kick');
  const [sample, setSample] = useState(null);
  const [pattern, setPattern] = useState([]);
  const [name, setName] = useState('sampler');

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

    setSample(_sample);
  }, [Tone.Sampler, instrument]);

  // add effects to the sample, if any
  useEffect(() => {
    if (sample == null) return;

    const _effects = effects.map((_effect) => _effect.method);

    sample.chain(..._effects, Tone.Destination);
  }, [Tone.Destination, Tone.destination, effects, sample]);

  // create the tiles with the correct layout
  useLayoutEffect(() => {
    setPattern(
      createArr(1, 0, (_) => createArr(configs.bars * configs.subdivisions))
    );
  }, [configs.bars, configs.subdivisions]);

  useEffect(() => {
    const sequence = new Tone.Sequence(
      (time, col) => {
        // setActiveCol(col);
        pattern.forEach((row, noteIdx) => {
          if (row[col] !== 0) {
            sample.triggerAttackRelease(note, '1n', time);
          }
        });
      },
      createArr(configs.subdivisions * configs.bars, null, (_, idx) => idx),
      `${configs.subdivisions}n`
    );

    sequence.loop = true;
    sequence.start(0);

    return () => {
      console.log(`disposing ${instrument} sequence`);
      sequence.dispose();
    };
    //eslint-disable-next-line
  }, [Tone.Sequence, configs.bars, configs.subdivisions, pattern, sample]);

  const toggleActive = useCallback(
    (note, row, col) => {
      const _pattern = [...pattern];

      _pattern[row][col] = _pattern[row][col] === 0 ? note : 0;
      setPattern(_pattern);
    },

    [pattern]
  );

  const handleSetActiveInstrument = () =>
    dispatch({ type: 'SET_ACTIVE_INSTRUMENT', id });

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
          <p>{name}</p>
          <span>|</span>
          <Select onChangeFn={handleSelectInstrument} options={sampleOptions} />
          <div
            className={`${styles.button} ${active && styles.activeButton}`}
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
