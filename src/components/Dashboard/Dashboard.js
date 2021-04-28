import React, { useState, useCallback, useEffect } from 'react';
import { useGlobalState } from '@context/GlobalState';

import Playground from '@components/Playground/Playground';
import MasterPanel from '@components/MasterPanel/MasterPanel';
import SelectionPanel from '@library/SelectionPanel/SelectionPanel';

import InstrumentPanel from '@components/InstrumentPanel/InstrumentPanel';

import styles from './Dashboard.module.scss';

function Dashboard() {
  const [state, dispatch] = useGlobalState();
  const {
    Tone,
    maxBars,
    master,
    effectsList,
    instruments,
    categoryErrorFlag,
    activeInstrumentId,
    replaceInstrumentId,
  } = state;

  const { bpm, volume, metronomeVol } = master;
  const [playState, setPlayState] = useState(Tone.Transport.state);

  useEffect(() => {
    Tone.Transport.set({
      bpm: bpm,
    });
  }, [Tone.Transport, Tone.Transport.bpm, bpm]);

  useEffect(() => {
    Tone.Master.set({
      volume: volume,
    });
  }, [Tone.Master, volume]);

  // Play/Pause master
  const handleTransport = useCallback(() => {
    if (playState === 'started') Tone.Transport.stop();
    else {
      //had to add this for debug purposes so you can play music as soon as you hit the browser. will need a better solution
      const synth = new Tone.Synth({
        volume: -60,
      });
      synth.triggerAttackRelease('C0', '8n');
      synth.dispose();

      Tone.Transport.start();
    }

    setPlayState(Tone.Transport.state);
  }, [Tone.Transport, playState]);

  const activeInstrument =
    activeInstrumentId && getActiveInstrument(instruments, activeInstrumentId);

  const handleKeyPress = useCallback(
    (event) => {
      const { which } = event;

      switch (which) {
        case 32: {
          event.preventDefault();
          handleTransport();
          return;
        }
        default: {
          return;
        }
      }
    },
    [handleTransport]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, false);

    return () => {
      document.removeEventListener('keydown', handleKeyPress, false);
    };
  }, [handleKeyPress]);

  return (
    <div className={styles.container}>
      <div className={styles.selectionPanel}>
        <SelectionPanel
          Tone={Tone}
          dispatch={dispatch}
          categoryErrorFlag={categoryErrorFlag}
          replaceInstrumentId={replaceInstrumentId}
        />
      </div>
      <div className={styles.mainPanels}>
        <MasterPanel
          Tone={Tone}
          dispatch={dispatch}
          playState={playState}
          masterProperties={master}
          handleTransport={handleTransport}
        />

        <InstrumentPanel
          Tone={Tone}
          dispatch={dispatch}
          effectsList={effectsList}
          activeInstrument={activeInstrument}
        />

        <Playground
          Tone={Tone}
          maxBars={maxBars}
          dispatch={dispatch}
          instruments={instruments}
          metronomeVol={metronomeVol}
          categoryErrorFlag={categoryErrorFlag}
          activeInstrumentId={activeInstrumentId}
          replaceInstrumentId={replaceInstrumentId}
        />
      </div>
    </div>
  );
}

export default Dashboard;

//Helper functions
function getActiveInstrument(instruments, activeInstrumentId) {
  const instrument = instruments.find((_instrument) => {
    return _instrument.id === activeInstrumentId;
  });

  return instrument;
}
