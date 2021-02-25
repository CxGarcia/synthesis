import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import Sampler from '../Sampler/Sampler';

import { v4 as uuidv4 } from 'uuid';

import styles from './Dashboard.module.scss';
import * as Tone from 'tone';

function Dashboard() {
  const handleTransport = useCallback(() => {
    Tone.Transport.toggle();
    // setPlayState(Tone.Transport.state)
  }, []);

  // Tone.Transport.timeSignature = 16;
  Tone.Transport.bpm.value = 120;

  const [instruments, setInstruments] = useState([]);
  const [activeCol, setActiveCol] = useState(0);

  const instrumentComponents = {
    synth: Synth,
    sampler: Sampler,
  };

  function handleCreateInstrument(event) {
    const _instruments = [...instruments];
    const type = event.target.value;
    if (!type || type === 'null') return;

    //eventually replace with DB _id to get the configs, etc.
    const id = uuidv4();

    const newInstrument = [type, id];
    _instruments.push(newInstrument);

    setInstruments(_instruments);
  }

  //create component dynamically, based on the instrument that the user selects
  function renderInstruments() {
    return instruments.map((instrumentTuple) => {
      const [type, id] = instrumentTuple;

      return React.createElement(instrumentComponents[type], {
        key: id,
        id: id,
        Tone: Tone,
      });
    });
  }

  function renderInstrumentOptions() {
    const instrumentOptions = Object.keys(instrumentComponents);
    return instrumentOptions.map((instrument, idx) => (
      <option value={instrument} key={idx}>
        {instrument}
      </option>
    ));
  }

  return (
    <div>
      {renderInstruments()}
      <button onClick={handleTransport}>Start / Stop</button>
      <select
        name="intruments"
        id="instruments"
        onChange={handleCreateInstrument}
      >
        {renderInstrumentOptions()}
        {/* TODO - remove this, for prototyping only */}
        <option value={null}>null</option>
      </select>
    </div>
  );
}

function Synth({ Tone }) {
  const synth = new Tone.Synth().toDestination();
  const [pattern, setPattern] = useState([]);
  const [configs, setConfigs] = useState();

  const piano = new Tone.PolySynth(Tone.Synth, {
    volume: -8,
    portamento: 0.005,
  }).toDestination();

  useEffect(() => {
    const sequence = new Tone.Sequence(
      (time, col) => {
        pattern.forEach((row, noteIdx) => {
          if (row[col] !== 0) {
            piano.triggerAttackRelease(['C4', 'E4', 'G4'], '8n', time);
          }
        });
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      '1n'
    );

    sequence.loop = true;
    sequence.start(0);

    return () => {
      console.log('disposing sequence');
      sequence.dispose();
    };
  }, [pattern, piano]);

  useEffect(() => {
    setPattern(
      Array(4)
        .fill(0)
        .map((_) => Array(4).fill(0))
    );
  }, []);

  const toggleActive = useCallback(
    (note, row, col) => {
      const _pattern = [...pattern];

      _pattern[row][col] = _pattern[row][col] === 0 ? note : 0;
      setPattern(_pattern);
    },
    [pattern]
  );

  return (
    <div>
      <div className={styles.instrument}>
        <div className={styles.panel}>Synth</div>
        {/* <MemoedSequencer
          synth={synth}
          pattern={pattern}
          toggleActive={toggleActive}
        /> */}
      </div>
    </div>
  );
}

export default Dashboard;
