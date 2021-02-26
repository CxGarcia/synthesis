import React, { useState, useEffect, useCallback } from 'react';
import { useGlobalState } from '../../context/GlobalState';
import instrumentComponents from '../instruments/index';

import Sampler from '../instruments/Sampler/Sampler';
import EffectsPanel from '../EffectsPanel/EffectsPanel';
import Select from '../Select/Select';
import { Play, Pause } from '../../resources/icons/index';

import { v4 as uuidv4 } from 'uuid';

import styles from './Dashboard.module.scss';

function Dashboard() {
  const [state, dispatch] = useGlobalState();
  const { instruments, Tone, activeInstrumentId, effectsList } = state;

  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [activeCol, setActiveCol] = useState(0);

  Tone.Transport.bpm.value = 120;

  const handleCreateInstrument = (selectedInstrument) =>
    dispatch({ type: 'CREATE_INSTRUMENT', selectedInstrument });

  const handleTransport = useCallback(() => {
    Tone.Transport.toggle();
    setPlayState(Tone.Transport.state);
  }, [Tone.Transport]);

  // Create component dynamically, based on the instrument that the user selects
  function renderInstruments() {
    return instruments.map((_instrument) => {
      const { instrument, id, effects } = _instrument;

      const newInstrument = React.createElement(
        instrumentComponents[instrument],
        {
          key: id,
          id,
          Tone,
          effects,
          dispatch,
          active: id === activeInstrumentId,
        }
      );

      return newInstrument;
    });
  }

  const activeInstrumentEffects =
    activeInstrumentId &&
    getActiveInstrumentEffects(instruments, activeInstrumentId);

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
          <EffectsPanel
            Tone={Tone}
            dispatch={dispatch}
            activeInstrumentId={activeInstrumentId}
            activeInstrumentEffects={activeInstrumentEffects}
            effectsList={effectsList}
          />
        </div>
      </div>
      {renderInstruments()}
    </div>
  );
}

export default Dashboard;

function getActiveInstrumentEffects(instruments, activeInstrumentId) {
  const instrument = instruments.find((_instrument) => {
    return _instrument.id === activeInstrumentId;
  });

  const { effects } = instrument;
  return effects;
}
