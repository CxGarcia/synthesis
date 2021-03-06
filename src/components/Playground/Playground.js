import React from 'react';

import instrumentComponents from '@instruments';
import SelectionPanel from '@panels/SelectionPanel/SelectionPanel';
import TransportPosition from '@panels/TransportPosition/TransportPosition';

import styles from './Playground.module.scss';

function Playground({
  Tone,
  instruments,
  dispatch,
  activeInstrumentId,
  maxBars,
}) {
  // Create component dynamically, based on the instrument that the user selects
  function renderInstruments() {
    return instruments.map((_instrument) => {
      const { id, instrument } = _instrument;

      const newInstrument = React.createElement(
        instrumentComponents[instrument],
        {
          Tone,
          dispatch,
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
      <SelectionPanel Tone={Tone} dispatch={dispatch} />
      <div className={styles.playgroundSub}>
        {instruments.length > 0 && (
          <TransportPosition Tone={Tone} maxBars={maxBars} />
        )}
        <div className={styles.instruments}>{renderInstruments()}</div>
      </div>
    </div>
  );
}

export default Playground;
