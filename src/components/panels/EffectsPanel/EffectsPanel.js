import React from 'react';
import styles from './EffectsPanel.module.scss';
// import Switch from 'react-switch';
import Switch from '../Switch/Switch';

function EffectsPanel({ activeInstrumentEffects, dispatch, effectsList }) {
  function handleAddEffect(effect) {
    const _effect = effectsList.find((_eff) => _eff.name === effect);
    dispatch({ type: 'ADD_EFFECT_TO_INSTRUMENT', effect: _effect });
  }

  const handleRemoveEffect = (effect) => {
    console.log(effect);
  };

  function renderEffects() {
    // const effectNames = effectsList.map((_effect) => _effect.name);

    return effectsList.map((_effect, idx) => {
      const active =
        activeInstrumentEffects &&
        activeInstrumentEffects.some((_eff) => _eff.name === _effect.name);

      return (
        <div className={styles.effect} key={idx}>
          <Switch active={active} handleAddEffect={handleAddEffect} />
          <h3
            onClick={() =>
              active ? handleRemoveEffect(_effect) : handleAddEffect(_effect)
            }
            className={active && styles.activeTitle}
          >
            {_effect.name}
          </h3>
        </div>
      );
    });
  }

  return <>{renderEffects()}</>;
}

export default EffectsPanel;
