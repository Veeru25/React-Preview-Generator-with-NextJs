import React from 'react';
import { FaReact } from 'react-icons/fa'; // React logo from react-icons
import styles from './ReactLogoWithText.module.css'; // Import the CSS module for animations

const ReactLogoWithText = () => {
  return (
    <div className={styles.logoContainer}>
      <div className={styles.logoAnimation}>
        <FaReact size={80} className={styles.reactLogo} />
      </div>
      <div className={styles.textAnimation}>
        <span>React Code and Preview Generator</span>
      </div>
    </div>
  );
};

export default ReactLogoWithText;
