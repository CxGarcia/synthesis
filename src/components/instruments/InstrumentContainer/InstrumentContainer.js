import React from 'react';

import Select from '@components/Select/Select';

import styles from './InstrumentContainer.module.scss';

function InstrumentContainer({
  handleSelectInstrument,
  handleSetActiveInstrument,
  handleDeleteInstrument,
  setActiveTilesByStep,
  active,
  options,
  name,
}) {
  return (
    <div className={`${styles.panel} ${active && styles.activePanel}`}>
      <h1 className={styles.delete} onClick={handleDeleteInstrument}>
        X
      </h1>
      <p>{name}</p>
      <span>|</span>
      <Select onChangeFn={handleSelectInstrument} options={options} />
      {name === 'sampler' && (
        <Select onChangeFn={setActiveTilesByStep} options={[1, 2, 4, 8, 16]} />
      )}

      <div
        className={`${styles.fxButton} ${active && styles.activeButton}`}
        onClick={handleSetActiveInstrument}
      >
        +
      </div>
    </div>
  );
}

export default InstrumentContainer;
