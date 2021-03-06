const effectsList = {
  Distortion: [0.8],
  Phaser: [
    {
      frequency: 1,
      octaves: '1',
      baseFrequency: 100,
    },
  ],
  Compressor: [-30, 3],
  Filter: [1500, 'highpass'],
  Tremolo: [9, 0.75],
  PitchShift: [4],
  Reverb: [1],
  Delay: ['4n', 0.2],
  Freeverb: [],
  FeedbackDelay: ['8n', 0.5],
};

export default effectsList;
