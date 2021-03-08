import { createArr } from '@utils';

export default function synthBuilder(Tone) {
  return {
    createSynth,
    createSynthSequence,
    createArpeggiatorSequence,
    setNewOctaveToChords,
  };

  function createSynth(
    instrument,
    envelope,
    volume,
    effects,
    oscillator,
    mute
  ) {
    const [attack, decay, sustain, release] = envelope;
    const { oscVol, oscType } = oscillator;

    const _synth = new Tone[instrument]({
      volume: volume,
      portamento: 0.1,
      oscillator: oscType ? { volume: oscVol, type: oscType } : null,
      envelope: { attack, decay, sustain, release },
    });

    let _effects = mapEffects(effects);

    if (mute) {
      console.log('hiya');

      const vol = new Tone.Volume();
      vol.mute = true;
      _effects = [vol];
    }

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

  // function createArpeggiatorSequence(synth, progression) {
  //   const sequence = new Tone.Pattern(
  //     (time, note) => {
  //       synth.triggerAttackRelease(note, '8n', time);
  //     },
  //     progression,
  //     'upDown'
  //   );

  //   sequence.playbackRate = 4;
  //   sequence.loop = true;
  //   sequence.start(0);

  //   return sequence;
  // }

  function createArpeggiatorSequence(synth, progression) {
    const sequence = new Tone.Sequence((time, note) => {
      synth.triggerAttackRelease(note, '8n', time);
    }, progression);

    // sequence.playbackRate = 2;
    sequence.loop = true;
    sequence.start(0);

    return sequence;
  }

  function setNewOctaveToChords(chords, octave) {
    return chords.map((chord) =>
      chord.map((el) => el.replace(/[0-9]/g, octave))
    );
  }

  function mapEffects(effects) {
    return effects.map((_effect) => _effect.method);
  }
}
