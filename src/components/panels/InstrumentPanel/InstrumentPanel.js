import React from 'react';

import Slider from '../Slider/Slider';
import EffectsPanel from '../EffectsPanel/EffectsPanel';
import EnvelopePanel from '../EnvelopePanel/EnvelopePanel';
import Select from '@components/Select/Select';
import { createArr } from '@utils/';

import styles from './InstrumentPanel.module.scss';

function InstrumentPanel({ dispatch, Tone, activeInstrument, effectsList }) {
  if (!activeInstrument)
    return (
      <div className={styles.subPanelContainer}>
        <h1>Select your instrument</h1>
      </div>
    );

  const { effects, volume, bars, pitch } = activeInstrument;
  console.log(activeInstrument);

  const handleVolume = (_volume) =>
    dispatch({ type: 'UPDATE_INSTRUMENT_VOLUME', volume: _volume });

  const handleMaxTiles = (_bars) => dispatch({ type: 'SET_BARS', bars: _bars });

  const handlePitch = (_pitch) =>
    dispatch({ type: 'SET_PITCH', pitch: _pitch });

  // const barsOptions = createArr(4, 2, (el, idx) => el ** (idx + 2));
  const barsOptions = ['1/4', '1/2', '1', '2'];
  const pitchOptions = createArr(7, null, (_, idx) => idx + 1);

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
      <Select
        onChangeFn={handleMaxTiles}
        options={barsOptions}
        initialOption={barsOptions[getOptionsIdx(bars)]}
      />
      <Select
        onChangeFn={handlePitch}
        options={pitchOptions}
        initialOption={pitch}
      />
      <div className={styles.subPanelContainer}>
        <Slider
          handleChangeFn={handleVolume}
          min={-60}
          max={10}
          defaultVal={+volume}
          label="VOL"
        />
        {/* <EnvelopePanel /> */}
      </div>
    </>
  );
}

export default InstrumentPanel;

function getOptionsIdx(num) {
  if (num >= 1) return num + 1;
  else return num * 4 - 1;
}
