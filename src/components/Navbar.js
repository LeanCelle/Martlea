"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/app/utils/supabaseClient";
import styles from "@/styles/navbar.module.css";
import { FiUser } from "react-icons/fi";
import dynamic from "next/dynamic";
import SearchBar from "./SearchBar";

const RegisterModal = dynamic(() => import("@/components/RegisterModal"), {
  ssr: false,
});
const LoginModal = dynamic(() => import("@/components/LoginModal"), {
  ssr: false,
});

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const showSearchBar = pathname !== "/";

  useEffect(() => {
    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: perfiles, error } = await supabase
          .from("profiles")
          .select("foto_url")
          .eq("id", session.user.id);

        const perfil = perfiles?.[0] || null;

        setUser({
          ...session.user,
          foto: perfil?.foto_url ?? null,
        });
      } else {
        setUser(null);
      }
    };

    syncSession();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔄 Volviendo a la pestaña, chequeando sesión...");
        syncSession();
      }
    };

    const handleStorageChange = (event) => {
      if (event.key?.includes("supabase")) {
        console.log("🧭 Cambio de sesión detectado en otra pestaña");
        syncSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          syncSession();
        } else {
          console.log("🔓 Sesión cerrada (onAuthStateChange)");
          setUser(null);
        }
      }
    );

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    console.log("Cerrando sesión...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setDropdownOpen(false);
      setUser(null);
      router.push("/"); // Redirige al inicio
    } catch (err) {
      console.error("Error cerrando sesión:", err.message);
      alert("Ocurrió un error al cerrar sesión. Intentá de nuevo.");
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/logo.png" alt="Logo" className={styles.logoImage} />
          </Link>
        </div>
        {showSearchBar && <SearchBar />}{" "}
        <div className={styles.sections}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/top-10-empleos">Top 10 empleos</Link>
            </li>
            <li>
              <Link href="/contact">Instructivo</Link>
            </li>
            <li>
              <Link href="/faq">F.A.Q</Link>
            </li>
            {!user ? (
              <>
                <li>
                  <button
                    className={styles.loginLink}
                    onClick={() => setShowLoginModal(true)}
                  >
                    Iniciar sesión
                  </button>
                </li>
                <button
                  className={styles.register}
                  onClick={() => setShowRegisterModal(true)}
                >
                  Registrate
                </button>
              </>
            ) : (
              <li ref={dropdownRef} className={styles.profileWrapper}>
                {user?.foto ? (
                  <img
                    src={user.foto}
                    alt="Foto de perfil"
                    className={styles.profileImage}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  />
                ) : (
                  <FiUser
                    size={60}
                    color="#777"
                    className={styles.profileIcon}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  />
                )}

                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link
                      href="/ver-perfil"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Ver perfil
                    </Link>
                    <button className={styles.logOut} onClick={handleSignOut}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </nav>
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default Navbar;
