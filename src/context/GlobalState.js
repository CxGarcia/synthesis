import React, { useReducer } from 'react';
import stateReducer from './stateReducer';
import * as Tone from 'tone';

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
      tremolo: new Tone.Tremolo(9, 0.75),
      pitchShift: new Tone.PitchShift(4),
      reverb: new Tone.Reverb(1),
      delay: new Tone.PingPongDelay('4n', 0.2),
      freeverb: new Tone.Freeverb(),
      feedback: new Tone.FeedbackDelay('8n', 0.5),
    },
  });

  return [state, dispatch];
}

export { useGlobalState };
