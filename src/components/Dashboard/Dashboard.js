import React, { useState, useCallback, useEffect } from 'react';
import { useGlobalState } from '@context/GlobalState';

import Playground from '@components/Playground/Playground';
import MasterPanel from '@components/MasterPanel/MasterPanel';
import InstrumentPanel from '@panels/InstrumentPanel/InstrumentPanel';

import styles from './Dashboard.module.scss';

function Dashboard() {
  const [state, dispatch] = useGlobalState();
  const {
    instruments,
    Tone,
    activeInstrumentId,
    effectsList,
    maxBars,
    master,
  } = state;

  const { bpm, volume } = master;
  const [playState, setPlayState] = useState(Tone.Transport.state);

  useEffect(() => {
    Tone.Transport.set({
      bpm: bpm,
    });
  }, [Tone.Transport, Tone.Transport.bpm, bpm]);

  useEffect(() => {
    Tone.Master.set({
      volume: volume,
    });
  }, [Tone.Master, volume]);

  // Play/Pause master
  const handleTransport = useCallback(() => {
    if (playState === 'started') Tone.Transport.stop();
    else Tone.Transport.start();

    setPlayState(Tone.Transport.state);
  }, [Tone.Transport, playState]);

  const activeInstrument =
    activeInstrumentId && getActiveInstrument(instruments, activeInstrumentId);

  const handleKeyPress = useCallback(
    (event) => {
      const { which } = event;

      switch (which) {
        case 32: {
          event.preventDefault();
          handleTransport();
          return;
        }
        default: {
          return;
        }
      }
    },
    [handleTransport]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, false);

    return () => {
      document.removeEventListener('keydown', handleKeyPress, false);
    };
  }, [handleKeyPress]);

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.masterPanel}>
          <div className={styles.panelTitle}>
            <h2>Master</h2>
          </div>
          <MasterPanel
            dispatch={dispatch}
            handleTransport={handleTransport}
            playState={playState}
            masterProperties={master}
          />
        </div>
        <div className={styles.instrumentsPanel}>
          <div className={styles.panelTitle}>
            <h2>Instrument</h2>
          </div>
          {activeInstrumentId ? (
            <InstrumentPanel
              Tone={Tone}
              dispatch={dispatch}
              activeInstrument={activeInstrument}
              effectsList={effectsList}
            />
          ) : (
            <h1 className={styles.title}>Select your instrument</h1>
          )}
        </div>
      </div>
      <Playground
        Tone={Tone}
        instruments={instruments}
        dispatch={dispatch}
        activeInstrumentId={activeInstrumentId}
        maxBars={maxBars}
      />
    </div>
  );
}

export default Dashboard;

//Helper functions
function getActiveInstrument(instruments, activeInstrumentId) {
  console.log('hiya');

  const instrument = instruments.find((_instrument) => {
    return _instrument.id === activeInstrumentId;
  });

  return instrument;
}
