import Link from 'next/link';
import Image from 'next/image';  // Usamos Image de Next.js para optimización de imágenes
import styles from '@/styles/footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Logo y nombre de la app */}
        <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/logo.png" alt="Logo" width={120} height={40} />
        </Link>
          <p className={styles.appName}>/* Nombre de la App */</p>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Secciones</h4>
          <ul>
            <li><Link href="/" className={styles.footerLink}>Inicio</Link></li>
            <li><Link href="/top-10-empleos" className={styles.footerLink}>Top 10 Empleos</Link></li>
            <li><Link href="/faq" className={styles.footerLink}>F.A.Q</Link></li>
            <li><Link href="/contacto" className={styles.footerLink}>Contacto</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Cuenta</h4>
          <ul>
            <li><Link href="/login" className={styles.footerLink}>Iniciar sesión</Link></li>
            <li><Link href="/register" className={styles.footerLink}>Registrate</Link></li>
          </ul>
        </div>
      </div>
      <hr className={styles.hrFooter}></hr>
      <div className={styles.footerBottom}>
        <p>&copy; 2025 /* Nombre de la App */. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
