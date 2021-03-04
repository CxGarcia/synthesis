import React from 'react';
import Slider from '@panels/Slider/Slider';

import styles from './VolumePanelModule.module.scss';

function VolumePanelModule({ handleVolume, volume }) {
  return (
    <>
      <Slider
        handleChangeFn={handleVolume}
        min={-60}
        max={10}
        defaultVal={+volume}
        label="VOL"
      />
    </>
  );
}

export default VolumePanelModule;
