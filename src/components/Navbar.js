"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import styles from "@/styles/navbar.module.css";
import { FiSearch, FiUser } from "react-icons/fi";
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
  const [users, setUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const showSearchBar = pathname !== "/";
  const [isMobile, setIsMobile] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setHamburgerOpen(false);
      }
    };

    if (hamburgerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hamburgerOpen]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/getData");
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          console.error("Error al obtener usuarios:", data.error);
        }
      } catch (err) {
        console.error("Error al conectar con la API:", err.message);
      }
    };

    fetchUsers();
  }, []);

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
        syncSession();
      }
    };

    const handleStorageChange = (event) => {
      if (event.key?.includes("supabase")) {
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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setDropdownOpen(false);
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Error cerrando sesión:", err.message);
      alert("Ocurrió un error al cerrar sesión. Intentá de nuevo.");
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        {isMobile ? (
          <div className={styles.mobileIcons}>
            <button
              className={`${styles.hamburger} ${
                hamburgerOpen ? styles.open : ""
              }`}
              aria-label="Abrir o cerrar menú"
            >
              <span
                onClick={() => {
                  setHamburgerOpen((prev) => !prev);
                }}
              />
              <span
                onClick={() => {
                  setHamburgerOpen((prev) => !prev);
                }}
              />
              <span />
            </button>

            <div className={styles.logo}>
              <Link href="/">
                <img
                  src="/talent-bridge-db.png"
                  alt="Logo"
                  className={styles.logoImage}
                />
              </Link>
            </div>

            <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
              <FiSearch size={20} color="black" />
            </button>
          </div>
        ) : (
          <>
            <div className={styles.logo}>
              <Link href="/">
                <img
                  src="/talent-bridge-db.png"
                  alt="Logo"
                  className={styles.logoImage}
                />
              </Link>
            </div>
            {showSearchBar && !isMobile && <SearchBar users={users} />}
            <ul className={styles.navLinks}>
              <li>
                <Link href="/top-10-empleos">Top 10 empleos</Link>
              </li>
              <li>
                <Link href="/instructivo">Instructivo</Link>
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
                        Mi perfil
                      </Link>
                      <button className={styles.logOut} onClick={handleSignOut}>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </>
        )}
      </nav>

      {isMobile && showMobileSearch && (
        <div className={styles.mobileSearchDropdown}>
          <SearchBar
            users={users}
            onSearch={() => setShowMobileSearch(false)}
          />
        </div>
      )}

      {isMobile && (
        <div
          ref={hamburgerRef}
          className={`${styles.mobileMenu} ${
            hamburgerOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          <ul>
            <li>
              <Link href="/" onClick={() => setHamburgerOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/top-10-empleos"
                onClick={() => setHamburgerOpen(false)}
              >
                Top 10 empleos
              </Link>
            </li>
            <li>
              <Link href="/instructivo" onClick={() => setHamburgerOpen(false)}>
                Instructivo
              </Link>
            </li>
            <li>
              <Link href="/faq" onClick={() => setHamburgerOpen(false)}>
                F.A.Q
              </Link>
            </li>
            {!user ? (
              <>
                <li>
                  <button
                    className={styles.loginLink}
                    onClick={() => {
                      setHamburgerOpen(false);
                      setShowLoginModal(true);
                    }}
                  >
                    Iniciar sesión
                  </button>
                </li>
                <li>
                  <button
                    className={styles.register}
                    onClick={() => {
                      setHamburgerOpen(false);
                      setShowRegisterModal(true);
                    }}
                  >
                    Registrate
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/ver-perfil"
                    onClick={() => setHamburgerOpen(false)}
                  >
                    Mi perfil
                  </Link>
                </li>
                <li>
                  <button className={styles.logOut} onClick={handleSignOut}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

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
