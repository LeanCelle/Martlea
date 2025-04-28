"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/loginModal.module.css";
import { supabase } from "@/utils/supabaseClient";

export default function LoginModal({ onClose }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { email, password } = credentials;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
    } else {
      onClose();
      router.push("/");
    }
  };

  return (
    <div className={styles.loginModalOverlay}>
      <div className={styles.modalContent}>
        <button
          aria-label="Cerrar modal"
          className={styles.closeButton}
          onClick={onClose}
        >
          ×
        </button>
        <form onSubmit={handleLogin}>
          <h2>Iniciar sesión</h2>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={credentials.email}
            onChange={handleChange}
            name="email"
            className={styles.input}
            required
            aria-label="Correo electrónico"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={handleChange}
            name="password"
            className={styles.input}
            required
            aria-label="Contraseña"
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
