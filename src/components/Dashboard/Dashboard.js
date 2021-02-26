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
  const { instruments, Tone, activeInstrumentId } = state;

  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [activeCol, setActiveCol] = useState(0);

  let activeInstrument;

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

  function handleAddEffect(effect, id) {
    dispatch({ type: 'ADD_EFFECT_TO_INSTRUMENT', effect, id });
  }

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.master}>
          <div onClick={handleTransport} className={styles.transportButton}>
            {playState === 'stopped' ? <Play /> : <Pause />}
          </div>
          <Select
            onChangeFn={handleCreateInstrument}
            options={Object.keys(instrumentComponents)}
            defaultOption={'add instrument'}
          />
        </div>
        <div className={styles.instruments}>
          <EffectsPanel
            Tone={Tone}
            handleAddEffect={handleAddEffect}
            activeInstrumentId={activeInstrumentId}
          />
        </div>
      </div>
      {renderInstruments()}
    </div>
  );
}

export default Dashboard;
