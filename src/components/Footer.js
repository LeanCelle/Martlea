"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import styles from '@/styles/footer.module.css';
import { supabase } from "@/app/utils/supabaseClient";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";

const Footer = () => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <img src="/logo.png" alt="Logo" width={120} height={40} />
            </Link>
            <p className={styles.appName}>Nombre de la App</p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Secciones</h4>
            <ul>
              <li><Link href="/" className={styles.footerLink}>Inicio</Link></li>
              <li><Link href="/top-10-empleos" className={styles.footerLink}>Top 10 Empleos</Link></li>
              <li><Link href="/instructivo" className={styles.footerLink}>Instructivo</Link></li>
              <li><Link href="/faq" className={styles.footerLink}>F.A.Q</Link></li>
            </ul>
          </div>

          {!user && (
            <div className={styles.footerSection}>
              <h4 className={styles.footerTitle}>Cuenta</h4>
              <ul>
                <li>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className={styles.footerLink}
                  >
                    Iniciar sesión
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className={styles.footerLink}
                  >
                    Registrate
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <hr className={styles.hrFooter} />

        <div className={styles.footerBottom}>
          <p>&copy; 2025 Nombre de la App. Todos los derechos reservados.</p>
        </div>
      </footer>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
};

export default Footer;
