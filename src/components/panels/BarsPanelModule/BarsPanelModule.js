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
    <>
      <Select
        onChangeFn={handleMaxTiles}
        options={barsOptions}
        initialOption={barsOptions[getOptionsIdx(bars)]}
      />
      ,
      <Select
        onChangeFn={handlePitch}
        options={pitchOptions}
        initialOption={pitch}
      />
      ,
    </>
  );
}

export default BarsPanelModule;
