import React from 'react';
import Slider from '@panels/Slider/Slider';

import styles from './VolumePanelModule.module.scss';

function VolumePanelModule({ handleVolume, volume }) {
  return (
    <div className={styles.container}>
      <Slider
        handleChangeFn={handleVolume}
        min={-60}
        max={10}
        defaultVal={+volume}
        label="VOL"
      />
      <Slider
        // handleChangeFn={handleVolume}
        min={-60}
        max={10}
        defaultVal={+volume}
        label="PORTAMENTO"
      />
    </div>
  );
}

export default VolumePanelModule;
