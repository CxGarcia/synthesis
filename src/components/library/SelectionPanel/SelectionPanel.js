import React, { useEffect, useState } from 'react';

import instrumentComponents from '@instruments';

import CategoryItems from '@library/CategoryItems/CategoryItems';
import SelectionItems from '@library/SelectionItems/SelectionItems';
import Select from '@components/Select/Select';

import { getSampleNames } from '@api';
import styles from './SelectionPanel.module.scss';

function SelectionPanel({ dispatch, Tone }) {
  const [samples, setSamples] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getSampleNames().then((res) => {
      const _samples = Object.values(res).flat(1);
      const _categories = Object.keys(res);

      setSamples(_samples);
      setCategories(_categories);
    });
  }, []);

  function renderCategories() {
    return categories.map((category, idx) => {
      return <CategoryItems name={category} key={category} Tone={Tone} />;
    });
  }

  function renderOptions(cb = (_) => true) {
    return samples.filter(cb).map((sample, idx) => {
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
        <div className={styles.options}>
          {renderCategories()}
          {renderOptions()}
        </div>
      </div>
    </div>
  );
}

export default SelectionPanel;
