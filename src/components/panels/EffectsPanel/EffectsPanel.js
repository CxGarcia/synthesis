import React, { useState } from 'react';
import Switch from '../Switch/Switch';

import { ArrowU, ArrowD } from '@resources/icons';

import styles from './EffectsPanel.module.scss';

function EffectsPanel({ activeInstrumentEffects, dispatch, effectsList }) {
  const [effects, setActiveEffects] = useState(effectsList);

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
    return effects.slice(0, 4).map((_effect, idx) => {
      const active =
        activeInstrumentEffects &&
        activeInstrumentEffects.some((_eff) => _eff.name === _effect);

      return (
        <div className={styles.effect} key={idx}>
          {/* <Switch
            active={active}
            handleEffect={handleEffect}
            effect={_effect}
          /> */}
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

  function handleUp() {
    const _effects = [...effects];
    const _effect = _effects.pop();
    _effects.unshift(_effect);

    setActiveEffects(_effects);
  }

  function handleDown() {
    const _effects = [...effects];
    const _effect = _effects.shift();
    _effects.push(_effect);

    setActiveEffects(_effects);
  }

  return (
    <>
      <ArrowU className={styles.svg} onClick={handleUp} style={{ top: -15 }} />
      {renderEffects()}

      <ArrowD
        className={styles.svg}
        onClick={handleDown}
        style={{ bottom: -15 }}
      />
    </>
  );
}

export default EffectsPanel;
