import React from 'react';

import PanelModuleContainer from '@panels/PanelModuleContainer/PanelModuleContainer';
import Visualizer from '@panels/Visualizer/Visualizer';
import Slider from '@panels/Slider/Slider';

import { Play, Pause } from '@resources/icons';
import styles from './MasterPanel.module.scss';

function MasterPanel({
  dispatch,
  handleTransport,
  playState,
  masterProperties,
}) {
  const { metronomeVol, bpm, volume } = masterProperties;

  const handleBPM = (value) => dispatch({ type: 'UPDATE_BPM', value });
  const handleVolume = (value) =>
    dispatch({ type: 'UPDATE_MASTER_VOLUME', value });

  return (
    <div className={styles.container}>
      <div className={styles.panelTitle}>
        <h2>Master</h2>
      </div>
      <PanelModuleContainer>
        {/* <Visualizer playing={playState === 'started' ? false : true} /> */}
      </PanelModuleContainer>
      <PanelModuleContainer>
        <div onClick={handleTransport} className={styles.transportButton}>
          {playState === 'stopped' ? <Play /> : <Pause />}
        </div>
      </PanelModuleContainer>
      <PanelModuleContainer flex="row">
        <Slider
          handleChangeFn={handleVolume}
          min={-60}
          max={10}
          step={1}
          label={`MST VOL`}
          defaultVal={volume}
        />
        <Slider
          handleChangeFn={handleBPM}
          min={60}
          max={240}
          step={5}
          label={`BPM-${bpm}`}
          defaultVal={bpm}
        />
        <Slider
          handleChangeFn={handleBPM}
          min={60}
          max={240}
          step={5}
          label={`BPM VOL`}
          defaultVal={120}
        />
      </PanelModuleContainer>
    </div>
  );
}

export default MasterPanel;
