import React, { useState, useCallback, useEffect } from 'react';
import { useGlobalState } from '@context/GlobalState';

import instrumentComponents from '@instruments';
import InstrumentPanel from '@panels/InstrumentPanel/InstrumentPanel';
import Visualizer from '@panels/Visualizer/Visualizer';
import TransportPosition from '@panels/TransportPosition/TransportPosition';
import Select from '@components/Select/Select';

import { Play, Pause } from '@resources/icons';

import styles from './Dashboard.module.scss';

function Dashboard() {
  const [state, dispatch] = useGlobalState();
  const { instruments, Tone, activeInstrumentId, effectsList, maxBars } = state;

  const [playState, setPlayState] = useState(Tone.Transport.state);

  // Tone.Transport.bpm.value = 120;

  const handleCreateInstrument = (selectedInstrument) =>
    dispatch({ type: 'CREATE_INSTRUMENT', selectedInstrument });

  // Play/Pause master
  const handleTransport = useCallback(() => {
    if (playState === 'started') Tone.Transport.stop();
    else Tone.Transport.start();

    setPlayState(Tone.Transport.state);
  }, [Tone.Transport, playState]);

  // Create component dynamically, based on the instrument that the user selects
  function renderInstruments() {
    return instruments.map((_instrument) => {
      const { id, instrument } = _instrument;

      const newInstrument = React.createElement(
        instrumentComponents[instrument],
        {
          Tone,
          dispatch,
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
          <div onClick={handleTransport} className={styles.transportButton}>
            {playState === 'stopped' ? <Play /> : <Pause />}
          </div>
          {/* <Visualizer Tone={Tone} /> */}
          <Select
            onChangeFn={handleCreateInstrument}
            options={Object.keys(instrumentComponents)}
            defaultOption={'add instrument'}
          />
        </div>

        <div className={styles.instrumentsPanel}>
          <div className={styles.panelTitle}>
            <h2>Instrument</h2>
          </div>
          <InstrumentPanel
            Tone={Tone}
            dispatch={dispatch}
            activeInstrument={activeInstrument}
            effectsList={Object.keys(effectsList)}
          />
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
  const instrument = instruments.find((_instrument) => {
    return _instrument.id === activeInstrumentId;
  });

  return instrument;
}
