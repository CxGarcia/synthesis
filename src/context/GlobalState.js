import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Tone from 'tone';

const StateContext = createContext();
StateContext.displayName = 'StateContext';

function StateProvider({ children }) {
  // const { projects, tasks } = useAuth(); Fetch initial projects from db

  const [state, dispatch] = useReducer(stateReducer, {
    instruments: [],
    activeInstrumentId: null,
    Tone: Tone,
    effectsList: [
      { name: 'distortion', method: new Tone.Distortion(0.8) },
      {
        name: 'phaser',
        method: new Tone.Phaser({
          frequency: 15,
          octaves: 5,
          baseFrequency: 1000,
        }),
      },
      { name: 'compressor', method: new Tone.Compressor(-30, 3) },
      { name: 'hipass', method: new Tone.Filter(1500, 'highpass') },
    ],
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

function stateReducer(state, action) {
  switch (action.type) {
    case 'CREATE_INSTRUMENT': {
      //TODO replace with DB _id to get the configs, etc.
      const id = uuidv4();
      const { selectedInstrument } = action;
      const defaultSettings = { effects: [] };

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
      return { ...state, projects: [...state.projects, action.project] };
    }

    case 'DELETE_INSTRUMENT': {
      const projectsCopy = [...state.projects];
      const tasksCopy = [...state.tasks];

      const filteredProjects = projectsCopy.filter((project) => {
        return project.projectId !== action.projectId;
      });

      const filteredTasks = tasksCopy.filter((task) => {
        return task.projectId !== action.projectId;
      });

      return {
        ...state,
        projects: [...filteredProjects],
        tasks: [...filteredTasks],
      };
    }

    case 'ADD_EFFECT_TO_INSTRUMENT': {
      const { effect } = action;
      const { instruments, activeInstrumentId: id } = state;

      const _instruments = instruments.map((_instrument) => {
        if (_instrument.id !== id) return _instrument;
        const { effects } = _instrument;

        return { ..._instrument, effects: [...effects, effect] };
      });

      return {
        ...state,
        instruments: _instruments,
      };
    }

    case 'TOGGLE_INSTRUMENT_EFFECT': {
      const { effect } = action;
      const { instruments, activeInstrumentId: id } = state;

      const _instruments = instruments.map((_instrument) => {
        if (_instrument.id !== id) return _instrument;
        const { effects } = _instrument;

        const effectObj = state.effectsList.find(
          (_effect) => _effect.name === effect
        );

        return { ..._instrument, effects: [...effects, effectObj] };
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

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export { StateProvider, useGlobalState };
