import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import MemoedSequencer from '../Sequencer/Sequencer';

import styles from './Sampler.module.scss';
import { createArr } from '../../utils';

function Sampler({ Tone }) {
  const [configs, setConfigs] = useState({
    bars: 1,
    subdivisions: 16,
  });

  const [instrument, setInstrument] = useState('kick');
  const [sample, setSample] = useState(null);
  const [pattern, setPattern] = useState([]);
  const [name, setName] = useState('sampler');

  useEffect(() => {
    const _sample = new Tone.Sampler({
      urls: {
        A1: `/assets/samples/${instrument}.wav`,
      },
      onload: () => {
        // sample.triggerAttackRelease('F1');
        console.log(`${instrument} loaded`);
      },
    }).toDestination();

    setSample(_sample);
  }, [instrument]);

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
            sample.triggerAttackRelease('F1', '1n', time);
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
  }, [configs.bars, configs.subdivisions, pattern, sample]);

  const toggleActive = useCallback(
    (note, row, col) => {
      const _pattern = [...pattern];

      _pattern[row][col] = _pattern[row][col] === 0 ? note : 0;
      setPattern(_pattern);
    },
    [pattern]
  );

  function handleSelectInstrument(event) {
    event.preventDefault();

    setInstrument(event.target.value);
  }

  return (
    <div>
      <div className={styles.instrument}>
        <div className={styles.panel}>
          <p>{name}</p>
          <span>|</span>
          <select
            name="intruments"
            id="instruments"
            onChange={handleSelectInstrument}
          >
            <option value="kick">Kick</option>
            <option value="kick2">Kick 2</option>
            <option value="openhh">Open HH</option>
            <option value="closedhh">Closed HH</option>
            <option value="combo">Combo</option>
            <option value="maracas">Maracas</option>
          </select>
        </div>
        <MemoedSequencer
          synth={sample}
          pattern={pattern}
          toggleActive={toggleActive}
        />
      </div>
    </div>
  );
}

export default Sampler;
