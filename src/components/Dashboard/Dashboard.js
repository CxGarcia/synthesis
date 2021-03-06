import React, { useState, useCallback, useEffect } from 'react';
import { useGlobalState } from '@context/GlobalState';

import instrumentComponents from '@instruments';
import TransportPosition from '@panels/TransportPosition/TransportPosition';
import InstrumentPanel from '@panels/InstrumentPanel/InstrumentPanel';
import MasterPanel from '@components/MasterPanel/MasterPanel';

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
  // const [activeInstrumentId, setActiveInstrument] = useState(null);

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

  // const handleActiveInstrument = (id) => setActiveInstrument(id);

  // Create component dynamically, based on the instrument that the user selects
  function renderInstruments() {
    return instruments.map((_instrument) => {
      const { id, instrument } = _instrument;

      const newInstrument = React.createElement(
        instrumentComponents[instrument],
        {
          Tone,
          dispatch,
          // handleActiveInstrument,
          key: id,
          properties: _instrument,
          active: id === activeInstrumentId,
        }
      );

      return newInstrument;
    });
  }

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
              effectsList={Object.keys(effectsList)}
            />
          ) : (
            <h1 className={styles.title}>Select your instrument</h1>
          )}
        </div>
      </div>
      {instruments.length > 0 && (
        <TransportPosition Tone={Tone} maxBars={maxBars} />
      )}
      <div className={styles.instruments}>{renderInstruments()}</div>
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
