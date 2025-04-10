"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/loginModal.module.css";
import { supabase } from "@/app/utils/supabaseClient"; // asegúrate de tener este import bien

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
    } else {
      onClose();
      router.push("/"); // redirige al home
    }
  };

  return (
    <div className={styles.loginModalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <form onSubmit={handleLogin}>
          <h2>Iniciar sesión</h2>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginButton}>
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
