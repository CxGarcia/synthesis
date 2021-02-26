import React from 'react';
import styles from './EffectsPanel.module.scss';
// import Switch from 'react-switch';
import Switch from '../Switch/Switch';

function EffectsPanel({
  Tone,
  activeInstrumentId,
  activeInstrumentEffects,
  dispatch,
  effectsList,
}) {
  function handleAddEffect(effect) {
    const _effect = effectsList.find((_eff) => _eff.name === effect);
    dispatch({ type: 'ADD_EFFECT_TO_INSTRUMENT', effect: _effect });
  }

  const handleRemoveEffect = (effect) => {};

  function renderEffects() {
    const effectNames = effectsList.map((_effect) => _effect.name);

    return effectNames.map((_effect, idx) => {
      return (
        <div className={styles.effect}>
          <Switch
            active={
              activeInstrumentEffects &&
              activeInstrumentEffects.find((_eff) => _eff.name === _effect)
            }
            handleAddEffect={handleAddEffect}
          />
          <h3 onClick={() => handleAddEffect(_effect)}>{_effect}</h3>
        </div>
      );
    });
  }

  return (
    <div className={styles.container}>
      {activeInstrumentId ? (
        <div>{renderEffects()}</div>
      ) : (
        <h1>Select your instrument</h1>
      )}
    </div>
  );
}

export default EffectsPanel;
