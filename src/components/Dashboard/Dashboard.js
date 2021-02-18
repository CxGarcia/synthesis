import React from 'react';
import styles from './Dashboard.module.scss';
import { Synth, Transport } from 'tone';

function Dashboard() {
  function handleTransport() {
    Transport.start();
  }

  const synth = new Synth();
  synth.toDestination();

  return (
    <div>
      <button onClick={handleTransport}>Start / Stop</button>
      <Sequencer synth={synth} />
    </div>
  );
}

function Sequencer({ synth }) {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const length = notes.length;

  function renderSequencer(pitch) {
    return Array(7)
      .fill(0)
      .map((_, idx) => {
        const note = notes[idx % length] + String(pitch);

        return <Tile synth={synth} note={note} key={idx} />;
      });
  }

  return (
    <div>
      <div>{renderSequencer(4)}</div>
      <div>{renderSequencer(5)}</div>
      <div>{renderSequencer(6)}</div>
      <div>{renderSequencer(7)}</div>
      <div>{renderSequencer(8)}</div>
    </div>
  );
}

function Tile({ synth, note }) {
  function handlePlay() {
    synth.triggerAttackRelease(note, '8n');
  }

  return (
    <div
      onClick={handlePlay}
      style={{
        background: 'black',
        height: '2rem',
        width: '2rem',
        color: 'white',
      }}
    >
      {note}
    </div>
  );
}

export default Dashboard;
