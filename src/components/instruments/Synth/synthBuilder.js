import { createArr } from '@utils';

export default function synthBuilder(Tone) {
  const synths = [
    'Synth',
    'AMSynth',
    'DuoSynth',
    'FMSynth',
    'MembraneSynth',
    'MetalSynth',
    'MonoSynth',
    'PluckSynth',
  ];

  return {
    createSynth,
    createSynthSequence,
    setNewPitchToChords,
    options: synths,
  };

  function createSynth(instrument, envelope, volume, effects, oscillator) {
    const [attack, decay, sustain, release] = envelope;
    const { oscVol, oscType } = oscillator;

    const _synth = new Tone[instrument]({
      volume: volume,
      portamento: 0.005,
      oscillator: oscType ? { volume: oscVol, type: oscType } : null,
      envelope: { attack, decay, sustain, release },
    });

    const _effects = mapEffects(effects);

    _synth.chain(..._effects, Tone.Destination);

    return _synth;
  }

  function createSynthSequence(synth, progression, bars, subdivisions) {
    const totalTiles = bars * subdivisions;

    const sequence = new Tone.Sequence(
      (time, col) => {
        if (!progression[col]) return;
        synth.triggerAttackRelease(progression[col], '8n', time);
      },

      createArr(totalTiles, null, (_, idx) => idx),
      `${subdivisions}n`
    );

    sequence.loop = true;
    sequence.start(0);

    return sequence;
  }

  function setNewPitchToChords(chords, pitch) {
    return chords.map((chord) =>
      chord.map((el) => el.replace(/[0-9]/g, pitch))
    );
  }

  function mapEffects(effects) {
    return effects.map((_effect) => _effect.method);
  }
}

// const savedPattern = [
//   ['D#2'],
//   [],
//   [],
//   ['C2'],
//   [],
//   [],
//   ['G2'],
//   [],
//   [],
//   [],
//   ['D#2'],
//   [],
//   ['C2'],
//   [],
//   [],
//   [],
// ];

// const savedMatrix = [
//   [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];
