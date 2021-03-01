import { useState } from 'react';

import styles from './Slider.module.scss';
import { useDebounce } from '../../../utils/index';

function Slider({
  handleChangeFn,
  min = 0,
  max = 100,
  step = 1,
  label,
  defaultVal = 50,
}) {
  const [value, setValue] = useState(defaultVal);

  const debouncedHandleChangeFn = useDebounce(handleChangeFn, 250);

  function handleChange(event) {
    event.preventDefault();

    const volume = event.target.value;
    setValue(volume);
    debouncedHandleChangeFn(volume);
  }

  return (
    <>
      <label htmlFor="input">
        <h3 className={styles.sliderLabel}>{label}</h3>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        className={styles.slider}
        id="myRange"
        onChange={handleChange}
      />
    </>
  );
}

export default Slider;
