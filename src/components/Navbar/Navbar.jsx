import React from 'react';
import styles from './Navbar.module.css'; 

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <a href="#" className={styles.navbarLink}>PLAY</a>
        <a href="#" className={styles.navbarLink}>Market</a>
        <a href="#" className={`${styles.navbarLink} ${styles.active}`}>Perfil</a>
      </div>
    </nav>
  );
}

export default Navbar;
