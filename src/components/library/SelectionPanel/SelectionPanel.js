import React, { useEffect, useState } from 'react';

import { synths, polySynths } from '@instruments';
import CategoryItems from '@library/CategoryItems/CategoryItems';
import SelectionItems from '@library/SelectionItems/SelectionItems';
import { useDebounce } from '@utils';

import { getSampleNames } from '@api';
import styles from './SelectionPanel.module.scss';

function SelectionPanel({ Tone, dispatch }) {
  const [instruments, setInstruments] = useState([...synths, ...polySynths]);
  const [subCategories, setSubCategories] = useState(['synth', 'polySynth']);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [search, setSearch] = useState('');

  //handle the volume to test the samples
  const [volume, setVolume] = useState(-15);

  useEffect(() => {
    getSampleNames().then((res) => {
      const _samples = Object.values(res).flat(1);
      const _subCategories = Object.keys(res);

      setInstruments([...instruments, ..._samples]);
      setSubCategories([...subCategories, ..._subCategories]);
    });
    //eslint-disable-next-line
  }, []);

  function handleSubCategory(subCategory) {
    setActiveSubCategory(
      activeSubCategory !== subCategory ? subCategory : null
    );
  }

  function renderCategories() {
    return subCategories.map((subCategory) => {
      return (
        <CategoryItems
          category={subCategory}
          active={subCategory === activeSubCategory}
          handleSubCategory={handleSubCategory}
          key={subCategory}
        />
      );
    });
  }

  const handleCreateInstrument = (category, subCategory, instrument) =>
    dispatch({ type: 'CREATE_INSTRUMENT', category, subCategory, instrument });

  function renderOptions() {
    return instruments
      .filter((instrument) => {
        if (!activeSubCategory && !search) return true;
        else if (activeSubCategory && search) {
          return (
            instrument?.subCategory === activeSubCategory &&
            instrument?.instrument.toLowerCase().includes(search)
          );
        } else if (activeSubCategory) {
          return instrument?.subCategory === activeSubCategory;
        } else if (search) {
          return instrument?.instrument.toLowerCase().includes(search);
        } else return false;
      })
      .slice(0, 250)
      .map((_instrument, idx) => {
        const { category, subCategory, instrument } = _instrument;
        if (instrument.length < 1 || instrument == null) return null;
        return (
          <SelectionItems
            Tone={Tone}
            category={category}
            subCategory={subCategory}
            instrument={instrument}
            handleCreateInstrument={handleCreateInstrument}
            key={instrument + idx}
            volume={volume}
          />
        );
      });
  }

  const handleSearch = useDebounce(function (event) {
    event.preventDefault();

    const { value } = event.target;
    setSearch(value);
  }, 500);

  const debouncedHandleChangeFn = useDebounce(setVolume, 250);

  function handleVolume(event) {
    const volume = event.target.value;
    debouncedHandleChangeFn(volume);
  }

  return (
    <div className={styles.container}>
      <div className={styles.panelTitle}>
        <h2>Library</h2>
      </div>
      <div className={styles.selection}>
        <input type="text" className={styles.input} onChange={handleSearch} />
        <div className={styles.categories}>{renderCategories()}</div>
        <div className={styles.options}>{renderOptions()}</div>
      </div>
      <div className={styles.volume}>
        <input
          type="range"
          min={-60}
          max={10}
          value={volume}
          step={2.5}
          id="myRange"
          className={styles.slider}
          onChange={handleVolume}
        />
      </div>
    </div>
  );
}

export default SelectionPanel;