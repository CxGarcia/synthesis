import React, { useRef } from 'react';
import styles from './Select.module.scss';

function Select({ options, onChangeFn, defaultOption }) {
  const selectRef = useRef(null);

  function renderOptions() {
    const _options = defaultOption ? [defaultOption, ...options] : options;

    return _options.map((option, idx) => (
      <option value={option} key={idx}>
        {option.replace('-', ' ')}
      </option>
    ));
  }

  function handleChange(event) {
    event.preventDefault();

    onChangeFn(event.target.value);
    if (defaultOption) selectRef.current.value = defaultOption;
  }

  return (
    <>
      <select className={styles.select} onChange={handleChange} ref={selectRef}>
        {renderOptions()}
      </select>
    </>
  );
}

export default Select;
