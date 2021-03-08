import React from 'react';

import { instrumentComponents } from '@instruments';
import SelectionPanel from '@library/SelectionPanel/SelectionPanel';
import TransportPosition from '@panels/TransportPosition/TransportPosition';

import styles from './Playground.module.scss';

function Playground({
  Tone,
  maxBars,
  dispatch,
  instruments,
  categoryErrorFlag,
  activeInstrumentId,
}) {
  // Create component dynamically, based on the instrument that the user selects
  function renderInstruments() {
    return instruments.map((_instrument) => {
      const { id, category, subCategory, instrument } = _instrument;

      const newInstrument = React.createElement(
        instrumentComponents[category],
        {
          Tone,
          dispatch,
          subCategory,
          instrument,
          key: id,
          properties: _instrument,
          active: id === activeInstrumentId,
        }
      );

      return newInstrument;
    });
  }

  return (
    <div className={styles.playground}>
      <SelectionPanel
        Tone={Tone}
        dispatch={dispatch}
        categoryErrorFlag={categoryErrorFlag}
        activeInstrumentId={activeInstrumentId}
      />
      {instruments.length > 0 && (
        <div className={styles.playgroundSub}>
          <TransportPosition Tone={Tone} maxBars={maxBars} />
          <div className={styles.instruments}>{renderInstruments()}</div>
        </div>
      )}
    </div>
  );
}

export default Playground;
