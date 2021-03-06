import React, { useEffect, useState } from 'react';

import instrumentComponents from '@instruments';
import SelectionItems from '@components/SelectionItems/SelectionItems';
import Select from '@components/Select/Select';

import { getSampleNames } from '@api';
import styles from './SelectionPanel.module.scss';

function SelectionPanel({ dispatch, Tone }) {
  const [samples, setSamples] = useState(null);

  useEffect(() => {
    getSampleNames().then((_samples) => {
      setSamples(_samples);
    });
  }, []);

  function renderOptions() {
    return samples.map((sample, idx) => {
      const { category, name } = sample;
      if (name.length < 1 || name == null) return null;
      return (
        <SelectionItems
          category={category}
          name={name}
          key={name + idx}
          Tone={Tone}
        />
      );
    });
  }

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
        <div className={styles.options}>{samples && renderOptions()}</div>
      </div>
    </div>
  );
}

export default SelectionPanel;
