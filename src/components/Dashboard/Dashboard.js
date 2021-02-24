import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Dashboard.module.scss';
import * as Tone from 'tone';

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const length = notes.length;

const MemoedSequencer = React.memo(Sequencer, compareChangeInPattern);

//Only rerender the sequencer when there is a change in the pattern
function compareChangeInPattern(prevProps, newProps) {
  return prevProps.pattern === newProps.pattern;
}

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
        {/* {//TODO - remove this, for prototyping only} */}
        <option value={null}>null</option>
      </select>
    </div>
  );
}

function Synth() {
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
        <MemoedSequencer
          synth={synth}
          pattern={pattern}
          toggleActive={toggleActive}
        />
      </div>
    </div>
  );
}

function createArr(n, fill = 0, cb = (el) => el) {
  return Array(n).fill(fill).map(cb);
}

function Sampler() {
  const [configs, setConfigs] = useState({
    bars: 1,
    subdivisions: 16,
  });

  const [instrument, setInstrument] = useState('kick');
  const [sample, setSample] = useState(null);
  const [pattern, setPattern] = useState([]);
  const [name, setName] = useState('sampler');

  const events = createArr(
    configs.subdivisions * configs.bars,
    null,
    (_, idx) => idx
  );

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
      events,
      `${configs.subdivisions}n`
    );

    sequence.loop = true;
    sequence.start(0);

    return () => {
      console.log('disposing sequence');
      sequence.dispose();
    };
  }, [configs.subdivisions, events, pattern, sample]);

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
          <h1 style={{ textTransform: 'uppercase' }}>
            {name} | {instrument}
          </h1>
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

function Sequencer({ synth, pattern, toggleActive }) {
  function renderSequence(pitch) {
    return pattern.map((arr, row) => {
      const note = notes[row % length] + String(pitch);
      return (
        <div className={styles.sequence} key={`R-${row}-N${note}`}>
          <h2>{note}</h2>
          {arr.map((active, col) => {
            return (
              <Tile
                synth={synth}
                note={note}
                key={`R-${row}-C${col}-N${note}`}
                active={active !== 0}
                row={row}
                col={col}
                toggleActive={toggleActive}
              />
            );
          })}
        </div>
      );
    });
  }

  return (
    <>
      <div>{renderSequence(4)}</div>
    </>
  );
}

function Tile({ synth, note, active, row, col, toggleActive }) {
  function handlePlay() {
    synth.triggerAttackRelease(note, '8n');
  }

  return (
    <div
      onMouseDown={() => {
        toggleActive(note, row, col);
        handlePlay();
      }}
      style={{
        background: active ? 'red' : 'white',
        height: '2rem',
        width: '2rem',
        color: 'white',
        border: '1px dashed black',
        boxSizing: 'border-box',
      }}
    ></div>
  );
}

export default Dashboard;
