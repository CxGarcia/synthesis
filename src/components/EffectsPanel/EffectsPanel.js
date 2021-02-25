import React from 'react';
import styles from './EffectsPanel.module.scss';

import Tile from '../Tile/Tile';

function EffectsPanel({ Tone, handleEffect }) {
  const effects = {
    distortion: new Tone.Distortion(0.8).toDestination(),
    phaser: new Tone.Phaser({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000,
    }),
    compressor: new Tone.Compressor(-30, 3),
    hipass: new Tone.Filter(1500, 'highpass'),
  };

  function renderEffects() {
    const effectKeys = Object.keys(effects);

    return effectKeys.map((effect, idx) => {
      return (
        <div
          className={styles.effect}
          onClick={() => handleEffect(effects[effect])}
        >
          {effect}
        </div>
      );
    });
  }

  return (
    <div className={styles.container}>
      <div>{renderEffects()}</div>
    </div>
  );
}

export default EffectsPanel;
