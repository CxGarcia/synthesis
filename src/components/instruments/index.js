import Synth from './Synth/Synth';
import Sampler from './Sampler/Sampler';
import PolySynth from './PolySynth/PolySynth';

const instrumentComponents = {
  sampler: Sampler,
  synth: Synth,
  polySynth: PolySynth,
};

const synths = [
  { category: 'synth', subCategory: 'synth', instrument: 'Synth' },
  { category: 'synth', subCategory: 'synth', instrument: 'AMSynth' },
  { category: 'synth', subCategory: 'synth', instrument: 'FMSynth' },
  { category: 'synth', subCategory: 'synth', instrument: 'MembraneSynth' },
  { category: 'synth', subCategory: 'synth', instrument: 'MonoSynth' },
];

const polySynths = [
  { category: 'polySynth', subCategory: 'polySynth', instrument: 'Synth' },
  { category: 'polySynth', subCategory: 'polySynth', instrument: 'AMSynth' },
  { category: 'polySynth', subCategory: 'polySynth', instrument: 'FMSynth' },
  {
    category: 'polySynth',
    subCategory: 'polySynth',
    instrument: 'MembraneSynth',
  },
];

export { instrumentComponents, synths, polySynths };
