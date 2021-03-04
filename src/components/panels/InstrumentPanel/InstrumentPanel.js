import React, { useEffect, useState } from 'react';

import panelModules from '@panels/index.PanelModule';
import PanelModuleContainer from '@panels/PanelModuleContainer/PanelModuleContainer';
import { createArr } from '@utils/';

import { ArrowL, ArrowR } from '@resources/icons';

import styles from './InstrumentPanel.module.scss';

function InstrumentPanel({ dispatch, activeInstrument, effectsList }) {
  if (!activeInstrument)
    return <h1 className={styles.title}>Select your instrument</h1>;

  const { effects, volume, bars, pitch, envelope } = activeInstrument;
  const handleVolume = (_volume) =>
    dispatch({ type: 'UPDATE_INSTRUMENT_VOLUME', volume: _volume });

  const handleMaxTiles = (_bars) => dispatch({ type: 'SET_BARS', bars: _bars });

  const handlePitch = (_pitch) =>
    dispatch({ type: 'SET_PITCH', pitch: _pitch });

  const barsOptions = ['1/4', '1/2', '1', '2'];
  const pitchOptions = createArr(7, null, (_, idx) => idx + 1);

  const moduleProps = {
    adsr: {
      envelope,
      dispatch,
    },
    effects: {
      activeInstrumentEffects: effects,
      effectsList,
      dispatch,
    },
    bars: {
      handleMaxTiles,
      barsOptions,
      getOptionsIdx,
      bars,
      handlePitch,
      pitchOptions,
      pitch,
    },
    volume: {
      handleVolume,
      volume,
    },
  };

  function handleLeft() {
    const _panels = [...panelModules];
    const _panel = _panels.shift();

    _panels.push(_panel);

    // setPanels(_panels);
  }

  const panels = ['adsr', 'effects', 'bars'];

  // function renderPanels() {
  //   return panelModules.slice(0, 3).map((panel) => {
  //     return <PanelModuleContainer>{panel}</PanelModuleContainer>;
  //   });
  // }

  function renderPanels() {
    return panels.map((_panel, idx) => {
      const newPanel = React.createElement(panelModules[_panel], {
        ...moduleProps[_panel],
      });

      return <PanelModuleContainer>{newPanel}</PanelModuleContainer>;
    });
  }

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
