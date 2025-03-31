// src/components/Navbar.js
import Link from 'next/link';
import styles from '@/styles/navbar.module.css'; // Opcional, para los estilos

const Navbar = () => {
  return (
    <>
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/logo.png" alt="Logo" className={styles.logoImage} />
        </Link>
      </div>
      <div className={styles.sections}>
        <ul className={styles.navLinks}>
            <li>
            <Link href="/top-10-empleos">Top 10 empleos</Link>
            </li>
            <li>
            <Link href="/faq">F.A.Q</Link>
            </li>
            <li>
            <Link href="/contact">Contacto</Link>
            </li>
            <li>
            <Link href="/login">Iniciar sesión</Link>
            </li>
            <li className={styles.register}>
            <Link href="/register">Registrate</Link>
            </li>
        </ul>
      </div>
    </nav>
    <hr className={styles.hr}></hr>
    </>
  );
};

export default Navbar;
