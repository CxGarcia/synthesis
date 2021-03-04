import React from 'react';
import styles from './PanelModuleContainer.module.scss';

function PanelModuleContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default PanelModuleContainer;
