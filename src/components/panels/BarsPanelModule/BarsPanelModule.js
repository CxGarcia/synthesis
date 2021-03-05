import React from 'react';
import Select from '@components/Select/Select';

import styles from './BarsPanelModule.module.scss';

function BarsPanelModule({
  handleMaxTiles,
  barsOptions,
  getOptionsIdx,
  bars,
  handlePitch,
  pitchOptions,
  pitch,
}) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Bars</label>
      <Select
        onChangeFn={handleMaxTiles}
        options={barsOptions}
        initialOption={barsOptions[getOptionsIdx(bars)]}
      />
      <label className={styles.label}>Pitch</label>
      <Select
        onChangeFn={handlePitch}
        options={pitchOptions}
        initialOption={pitch}
      />
    </div>
  );
}

export default BarsPanelModule;
