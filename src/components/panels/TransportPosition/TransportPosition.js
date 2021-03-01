import React, { useState, useEffect } from 'react';
import { createArr } from 'utils/index';

import styles from './TransportPosition.module.scss';

function TransportPosition({ Tone, maxBars }) {
  const [activeCol, setActiveCol] = useState(Tone.Transport.position);
  const tiles = maxBars * 16;

  useEffect(() => {
    const sequence = new Tone.Sequence(
      (_, col) => {
        setActiveCol(col);
      },
      createArr(tiles, null, (_, idx) => idx),
      `16n`
    );

    sequence.loop = true;
    sequence.start(0);

    return () => {
      console.log(`disposing TransportPosition sequence`);
      sequence.dispose();
    };
  }, [Tone.Sequence, Tone.Transport.position, tiles]);

  return (
    <div className={styles.container}>
      <div className={styles.separator}></div>
      <div className={styles.noteSeparator}></div>
      <div className={styles.sequence}>
        {createArr(tiles, null, (_, idx) => {
          return (
            <div
              className={`${styles.tile} ${
                idx === activeCol ? styles.active : null
              }`}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TransportPosition;
