import React, { useState, useRef } from 'react';

import Select from '@components/Select/Select';

import { Mute, Sound } from '@resources/icons';
import styles from './InstrumentContainer.module.scss';

function InstrumentContainer({
  handleSetActiveInstrument,
  handleDeleteInstrument,
  setActiveTilesByStep,
  menuOptions,
  handleMute,
  active,
  name,
  mute,
}) {
  const [menu, setMenu] = useState(false);

  const timeoutRef = useRef(null);

  function renderMenu() {
    return menuOptions.map((option, idx) => {
      const { name, method, args = [] } = option;
      return (
        <>
          <div className={styles.menuOption} onClick={() => method(...args)}>
            <p className={styles.menuOptionName}>{name}</p>
          </div>
        </>
      );
    });
  }

  //Wait for some time before closing the menu to prevent closing on accidentally leaving the container
  function handleCloseMenu() {
    timeoutRef.current = setTimeout(() => {
      setMenu(false);
    }, 250);
  }

  function handleMenuTimeout() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  return (
    <div
      className={styles.instrumentContainer}
      onMouseLeave={handleCloseMenu}
      onMouseEnter={handleMenuTimeout}
    >
      <div
        className={`${styles.panel} ${active && styles.activePanel}`}
        onClick={handleSetActiveInstrument}
      >
        <h1 className={styles.delete} onClick={handleDeleteInstrument}>
          X
        </h1>
        <p>{name.replace('.wav', '')}</p>

        {setActiveTilesByStep && (
          <Select
            onChangeFn={setActiveTilesByStep}
            options={[1, 2, 4, 8, 16]}
          />
        )}

        <div
          onClick={handleMute}
          className={`${styles.muteButton} ${active && styles.activeButton}`}
        >
          {mute === true ? (
            <Mute className={styles.svg} />
          ) : (
            <Sound className={styles.svg} />
          )}
        </div>
        <div
          className={`${styles.fxButton} ${active && styles.activeButton}`}
          onClick={() => setMenu(!menu)}
        >
          +
        </div>
      </div>

      {menu && (
        <div className={styles.menu}>
          <h1 className={styles.closePanel} onClick={() => setMenu(false)}>
            X
          </h1>
          {renderMenu()}
        </div>
      )}
    </div>
  );
}

export default InstrumentContainer;
