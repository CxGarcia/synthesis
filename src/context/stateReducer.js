import { v4 as uuidv4 } from 'uuid';

export default function stateReducer(state, action) {
  switch (action.type) {
    case 'CREATE_INSTRUMENT': {
      //TODO replace with DB _id to get the configs, etc.
      const id = uuidv4();
      const { selectedInstrument } = action;
      const defaultSettings = {
        effects: [],
        volume: -25,
        subdivisions: 16,
        bars: 1,
        pitch: 4,
        envelope: [0.1, 0.5, 0.25, 0.5],
        oscillators: 'LFO',
      };

      const instrument = {
        instrument: selectedInstrument,
        id,
        ...defaultSettings,
      };

      return {
        ...state,
        instruments: [...state.instruments, instrument],
      };
    }

    case 'UPDATE_INSTRUMENT': {
      return {
        ...state,
        instruments: [...state.intruments, action.intruments],
      };
    }

    case 'DELETE_INSTRUMENT': {
      const { id } = action;
      const _instruments = [...state.instruments];

      const filteredInstruments = _instruments.filter((instrument) => {
        return instrument.id !== id;
      });

      return {
        ...state,
        instruments: filteredInstruments,
        activeInstrumentId: state.activeInstrumentId === id && null,
      };
    }

    case 'UPDATE_INSTRUMENT_VOLUME': {
      const { volume } = action;
      const { instruments, activeInstrumentId } = state;

      const _instruments = instruments.map((_instrument) => {
        if (_instrument.id !== activeInstrumentId) return _instrument;

        return { ..._instrument, volume: volume };
      });

      return {
        ...state,
        instruments: _instruments,
      };
    }

    case 'SET_ACTIVE_INSTRUMENT': {
      const { id } = action;

      return {
        ...state,
        activeInstrumentId: id,
      };
    }

    case 'SET_BARS': {
      const { bars } = action;
      const { instruments, activeInstrumentId, maxBars } = state;
      const _bars = fractionStrToDecimal(bars);

      const _instruments = instruments.map((_instrument) => {
        if (_instrument.id !== activeInstrumentId) return _instrument;

        return { ..._instrument, bars: _bars };
      });

      return {
        ...state,
        instruments: _instruments,
        maxBars: _bars > maxBars ? _bars : maxBars,
      };
    }

    case 'SET_PITCH': {
      const { pitch } = action;
      const { instruments, activeInstrumentId } = state;

      const _instruments = instruments.map((_instrument) => {
        if (_instrument.id !== activeInstrumentId) return _instrument;

        return { ..._instrument, pitch: pitch };
      });

      return {
        ...state,
        instruments: _instruments,
      };
    }

    case 'SET_ENVELOPE': {
      const { values } = action;
      const { instruments, activeInstrumentId } = state;

      const _instruments = instruments.map((_instrument) => {
        if (_instrument.id !== activeInstrumentId) return _instrument;

        return { ..._instrument, envelope: values };
      });

      return {
        ...state,
        instruments: _instruments,
      };
    }

    case 'ADD_EFFECT_TO_INSTRUMENT': {
      const { effect } = action;
      const { instruments, activeInstrumentId, effectsList } = state;

      const _effect = { name: effect, method: effectsList[effect] };

      // console.log(_effect);

      const _instruments = instruments.map((_instrument) => {
        if (_instrument.id !== activeInstrumentId) return _instrument;
        const { effects } = _instrument;

        return { ..._instrument, effects: [...effects, _effect] };
      });

      return {
        ...state,
        instruments: _instruments,
      };
    }

    case 'REMOVE_EFFECT_FROM_INSTRUMENT': {
      const { effect } = action;
      const { instruments, activeInstrumentId } = state;

      const _instruments = instruments.map((_instrument) => {
        if (_instrument.id !== activeInstrumentId) return _instrument;
        const { effects } = _instrument;

        const _effects = effects.filter((_effect) => _effect.name !== effect);

        return { ..._instrument, effects: _effects };
      });

      return {
        ...state,
        instruments: _instruments,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function fractionStrToDecimal(str) {
  return str.split('/').reduce((p, c) => p / c);
}
