import React from 'react';

import Select from '@components/Select/Select';

import styles from './InstrumentContainer.module.scss';

function InstrumentContainer({
  handleSetActiveInstrument,
  handleDeleteInstrument,
  setActiveTilesByStep,
  active,
  name,
}) {
  return (
    <div
      className={`${styles.panel} ${active && styles.activePanel}`}
      onClick={handleSetActiveInstrument}
    >
      <h1 className={styles.delete} onClick={handleDeleteInstrument}>
        X
      </h1>
      <p>{name.replace('.wav', '')}</p>

      {setActiveTilesByStep && (
        <Select onChangeFn={setActiveTilesByStep} options={[1, 2, 4, 8, 16]} />
      )}

      <div className={`${styles.fxButton} ${active && styles.activeButton}`}>
        +
      </div>
    </div>
  );
}

export default InstrumentContainer;
