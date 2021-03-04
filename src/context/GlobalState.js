import React, { createContext, useContext, useReducer } from 'react';
import stateReducer from './stateReducer';
import * as Tone from 'tone';

const StateContext = createContext(null);
StateContext.displayName = 'StateContext';

function StateProvider({ children }) {
  const [state, dispatch] = useReducer(stateReducer, {
    Tone: Tone,
    master: {
      effects: [],
      volume: -25,
    },
    instruments: [],
    activeInstrumentId: null,
    maxBars: 1,
    effectsList: {
      distortion: new Tone.Distortion(0.8),
      phaser: new Tone.Phaser({
        frequency: 1,
        octaves: '1',
        baseFrequency: 100,
      }),
      compressor: new Tone.Compressor(-30, 3),
      hipass: new Tone.Filter(1500, 'highpass'),
    },
  });

  const value = [state, dispatch];

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
}

function useGlobalState() {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error(
      `useGlobalState must be used within a component in the StateProvider tree`
    );
  }

  return context;
}

export { StateProvider, useGlobalState };
