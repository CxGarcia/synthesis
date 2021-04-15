import { useReducer } from 'react';
import * as Tone from 'tone';
import stateReducer from './stateReducer';

import effectsList from '@effects';

const keys = Object.keys(effectsList);

function useGlobalState() {
  const [state, dispatch] = useReducer(stateReducer, {
    Tone: Tone,
    master: {
      effects: [],
      volume: -10,
      bpm: 120,
      metronome: true,
      metronomeVol: -20,
    },
    instruments: [
      {
        category: 'polySynth',
        subCategory: 'polySynth',
        instrument: 'Synth',
        id: 'e6f14aa1-5b2c-4d1a-bd05-474a139d3c0e',
        effects: [],
        volume: -25,
        subdivisions: 16,
        bars: 1,
        octave: 2,
        envelope: [0.01, 1.4, 0, 0.5],
        oscillator: { oscType: 'sine', oscVol: 10 },
      },
      {
        category: 'sampler',
        subCategory: 'kicks',
        instrument: '2-kick.wav',
        id: 'f1549289-ee11-4f2c-8bb7-7128460ecff7',
        effects: [],
        volume: -25,
        subdivisions: 16,
        bars: 1,
        octave: 2,
      },
      {
        category: 'sampler',
        subCategory: 'hh',
        instrument: 'ClosedHH 808.wav',
        id: 'be1f89ec-cba1-46f7-b269-1d0a2f15156e',
        effects: [],
        volume: -25,
        subdivisions: 16,
        bars: 1,
        octave: 2,
      },
      {
        category: 'sampler',
        subCategory: 'hh',
        instrument: 'open-hh.wav',
        id: '5b3d6d74-8a1d-40b4-9aa7-52584443c94a',
        effects: [],
        volume: -25,
        subdivisions: 16,
        bars: 1,
        octave: 2,
      },
      {
        category: 'sampler',
        subCategory: 'clap',
        instrument: '909X.wav',
        id: 'f5b451e8-6305-487d-a7bc-708a6a93be4b',
        effects: [],
        volume: -25,
        subdivisions: 16,
        bars: 1,
        octave: 2,
      },
      {
        category: 'sampler',
        subCategory: 'bongo',
        instrument: 'Bongo Congolezi 3.wav',
        id: 'b5552f43-e1d2-48b2-8725-278c35a8c4b0',
        effects: [],
        volume: -25,
        subdivisions: 16,
        bars: 1,
        octave: 2,
      },
    ],
    activeInstrumentId: 'e6f14aa1-5b2c-4d1a-bd05-474a139d3c0e',
    maxBars: 1,
    effectsList: keys,
    categoryErrorFlag: false,
  });

  return [state, dispatch];
}

export { useGlobalState };
