import React from 'react';
import Slider from '../Slider/Slider';
import EffectsPanel from '../EffectsPanel/EffectsPanel';
import styles from './InstrumentPanel.module.scss';

function InstrumentPanel({
  dispatch,
  Tone,
  activeInstrument,
  activeInstrumentEffects,
  effectsList,
}) {
  if (!activeInstrument)
    return (
      <div className={styles.subPanelContainer}>
        <h1>Select your instrument</h1>
      </div>
    );

  const { effects, volume } = activeInstrument;

  const handleVolume = (_volume) =>
    dispatch({ type: 'UPDATE_INSTRUMENT_VOLUME', volume: _volume });

  return (
    <>
      <div className={styles.subPanelContainer}>
        <EffectsPanel
          Tone={Tone}
          dispatch={dispatch}
          activeInstrument={activeInstrument}
          activeInstrumentEffects={effects}
          effectsList={effectsList}
        />
      </div>
      <div className={styles.subPanelContainer}>
        <Slider
          handleChangeFn={handleVolume}
          min={-60}
          max={10}
          defaultVal={volume}
          label="VOL"
        />
      </div>
    </>
  );
}

export default InstrumentPanel;
