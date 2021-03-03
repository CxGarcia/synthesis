import React from 'react';
import styles from './EffectsPanel.module.scss';
import Switch from '../Switch/Switch';

function EffectsPanel({ activeInstrumentEffects, dispatch, effectsList }) {
  function handleEffect(effect, active) {
    active ? handleRemoveEffect(effect) : handleAddEffect(effect);
  }

  function handleAddEffect(effect) {
    dispatch({ type: 'ADD_EFFECT_TO_INSTRUMENT', effect });
  }

  function handleRemoveEffect(effect) {
    dispatch({ type: 'REMOVE_EFFECT_FROM_INSTRUMENT', effect });
  }

  function renderEffects() {
    return effectsList.map((_effect, idx) => {
      const active =
        activeInstrumentEffects &&
        activeInstrumentEffects.some((_eff) => _eff.name === _effect);

      return (
        <div className={styles.effect} key={idx}>
          <Switch
            active={active}
            handleEffect={handleEffect}
            effect={_effect}
          />
          <h3
            onClick={() => handleEffect(_effect, active)}
            className={active ? styles.activeTitle : null}
          >
            {_effect}
          </h3>
        </div>
      );
    });
  }

  return <>{renderEffects()}</>;
}

export default EffectsPanel;
