"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabaseClient";
import styles from "@/styles/registerModal.module.css";

export default function RegisterModal({ onClose }) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/~`\\|-]{6,}$/;

    if (firstName.length < 2 || lastName.length < 2)
      return setError("Nombre y apellido deben tener al menos 2 caracteres.");
    if (!emailRegex.test(email))
      return setError("Por favor ingresa un email válido.");
    if (!passwordRegex.test(password))
      return setError(
        "La contraseña debe tener al menos 6 caracteres, incluyendo una letra y un número."
      );
    if (password !== confirmPassword)
      return setError("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          setError(
            "El correo ya está registrado. Por favor, intenta con otro."
          );
        } else
        if (signUpError.message.includes("Failed to fetch")) {
          setError(
            "Error al crear el usuario, por favor revise su conexión o inténtelo de nuevo más tarde."
          );
        } else {
          setError("Error al registrar: " + signUpError.message);
        }
        return;
      }

      // Si tuviste éxito:
      onClose();
      router.push("/profile"); // Redirigimos al perfil (podés cambiarlo)
    } catch (err) {
      setError("Error inesperado: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerModalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
        <form onSubmit={handleRegister} className={styles.registerForm}>
          <h1 className={styles.formTitle}>Crear cuenta</h1>
          <div className={styles.nameFields}>
            <input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.formInput}
            />
            <input
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.formInput}
            />
          </div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.formInput}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.formInput}
          />
          {error && <p className={styles.formError}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`${styles.formButton} ${loading ? styles.disabled : ""}`}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}
