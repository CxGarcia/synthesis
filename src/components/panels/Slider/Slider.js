import { useState } from 'react';

import styles from './Slider.module.scss';
import { useDebounce } from '../../../utils/index';
import { useEffect } from 'react';

function Slider({
  handleChangeFn,
  min = 0,
  max = 100,
  step = 1,
  label,
  defaultVal,
}) {
  const [value, setValue] = useState(defaultVal);

  //If default val changes (because there is a new active instrument for example), the slider position should change
  useEffect(() => {
    setValue(defaultVal);
  }, [defaultVal]);

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
