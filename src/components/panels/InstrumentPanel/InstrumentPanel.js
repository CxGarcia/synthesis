import React, { useState } from 'react';

import panelModules from '@panels/index.PanelModule';
import PanelModuleContainer from '@panels/PanelModuleContainer/PanelModuleContainer';
import { createArr } from '@utils/';

import { ArrowL, ArrowR } from '@resources/icons';

import styles from './InstrumentPanel.module.scss';

function InstrumentPanel({ dispatch, activeInstrument, effectsList }) {
  const panels = ['adsr', 'bars', 'effects', 'volume'];
  const [activePanels, setActivePanels] = useState(panels);

  if (!activeInstrument) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title} style={{ alignSelf: 'center' }}>
          Select your instrument
        </h1>
      </div>
    );
  }

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

  function handleRight() {
    const _panels = [...activePanels];
    const _panel = _panels.shift();
    _panels.push(_panel);

    setActivePanels(_panels);
  }

  function handleLeft() {
    const _panels = [...activePanels];
    const _panel = _panels.pop();
    _panels.unshift(_panel);

    setActivePanels(_panels);
  }

  function renderPanels() {
    return activePanels.slice(0, 3).map((_panel, idx) => {
      const newPanel = React.createElement(panelModules[_panel], {
        ...moduleProps[_panel],
        key: _panel,
      });

      return <PanelModuleContainer>{newPanel}</PanelModuleContainer>;
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.panelTitle}>
        <h2>Instrument</h2>
      </div>
      <ArrowL
        className={styles.svg}
        style={{ left: 0, marginLeft: '5%' }}
        onClick={handleLeft}
      />
      {renderPanels()}
      <ArrowR
        className={styles.svg}
        style={{ right: 0, marginRight: '1%' }}
        onClick={handleRight}
      />
    </div>
  );
}

export default InstrumentPanel;

function getOptionsIdx(num) {
  if (num >= 1) return num + 1;
  else return num * 4 - 1;
}
