import React from 'react';

import Slider from '../Slider/Slider';
import PanelModuleContainer from '@panels/PanelModuleContainer/PanelModuleContainer';
import EffectsPanel from '@panels/EffectsPanel/EffectsPanel';
import ChartADSR from '@panels/ChartADSR/ChartADSR';
import Select from '@components/Select/Select';
import { createArr } from '@utils/';

import { ArrowL, ArrowR } from '@resources/icons';

import styles from './InstrumentPanel.module.scss';

function InstrumentPanel({ dispatch, Tone, activeInstrument, effectsList }) {
  if (!activeInstrument)
    return (
      <div className={styles.subPanelContainer}>
        <h1>Select your instrument</h1>
      </div>
    );

  const { effects, volume, bars, pitch, envelope } = activeInstrument;
  const handleVolume = (_volume) =>
    dispatch({ type: 'UPDATE_INSTRUMENT_VOLUME', volume: _volume });

  const handleMaxTiles = (_bars) => dispatch({ type: 'SET_BARS', bars: _bars });

  const handlePitch = (_pitch) =>
    dispatch({ type: 'SET_PITCH', pitch: _pitch });

  const barsOptions = ['1/4', '1/2', '1', '2'];
  const pitchOptions = createArr(7, null, (_, idx) => idx + 1);

  const panels = [
    <ChartADSR envelope={envelope} dispatch={dispatch} />,
    <EffectsPanel
      Tone={Tone}
      dispatch={dispatch}
      activeInstrument={activeInstrument}
      activeInstrumentEffects={effects}
      effectsList={effectsList}
    />,
    [
      <Select
        onChangeFn={handleMaxTiles}
        options={barsOptions}
        initialOption={barsOptions[getOptionsIdx(bars)]}
      />,
      <Select
        onChangeFn={handlePitch}
        options={pitchOptions}
        initialOption={pitch}
      />,
    ],
    <Slider
      handleChangeFn={handleVolume}
      min={-60}
      max={10}
      defaultVal={+volume}
      label="VOL"
    />,
  ];

  function renderPanels() {
    return panels.slice(0, 3).map((panel) => {
      return <PanelModuleContainer>{panel}</PanelModuleContainer>;
    });
  }

  // const barsOptions = createArr(4, 2, (el, idx) => el ** (idx + 2));

  return (
    <div className={styles.container}>
      <ArrowL className={styles.svg} style={{ left: 0, marginLeft: '5%' }} />
      {renderPanels()}
      <ArrowR className={styles.svg} style={{ right: 0, marginRight: '1%' }} />
    </div>
  );
}

export default InstrumentPanel;

function getOptionsIdx(num) {
  if (num >= 1) return num + 1;
  else return num * 4 - 1;
}
