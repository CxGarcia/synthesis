import React from 'react';
import styles from './SelectionPanel.module.scss';
import instrumentComponents from '@instruments';
import Select from '@components/Select/Select';

function SelectionPanel({ dispatch }) {
  const handleCreateInstrument = (selectedInstrument) =>
    dispatch({ type: 'CREATE_INSTRUMENT', selectedInstrument });

  return (
    <div className={styles.container}>
      <div className={styles.panelTitle}>
        <h2>Library</h2>
      </div>
      <div className={styles.selection}>
        <Select
          onChangeFn={handleCreateInstrument}
          options={Object.keys(instrumentComponents)}
          defaultOption={'add instrument'}
          maxWidth="200px"
        />
      </div>
    </div>
  );
}

export default SelectionPanel;
