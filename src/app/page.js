"use client";

import { useState } from "react";
import styles from "@/styles/page.module.css";
import { FiSearch, FiUser } from "react-icons/fi";
import profiles from "@/data/proofProfiles";
import BlurText from "@/components/BlurText";
import RegisterModal from "@/components/RegisterModal";
import SearchBar from "@/components/SearchBar";


export default function Home() {

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <BlurText
              text="Nombre de la App"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-2xl mb-8"
            />
            <h2 className={styles.welcomeMessage}>
              Base de talentos, donde empresas y candidatos pueden explorar y
              conectarse de manera rápida y efectiva.
            </h2>
            <p className={styles.searchingJob}>
              ¿Estás buscando trabajo?{" "}
              <button
                onClick={() => setShowRegisterModal(true)}
                className={styles.createProfile}
              >
                Crear perfil
              </button>
            </p>
            {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
          </header>

          <SearchBar/>
        </div>

        <div
          className={styles.graphicContainer}
          style={{ flexDirection: "column", gap: "60px" }}
        >
          <div className={styles.textGraphic}>
            <h3>
              ¿Sos reclutador, dueño de una empresa o estás buscando talento
              para tu equipo?
            </h3>
            <p style={{ textAlign: "center" }}>
              <b>Encontrá</b> al <b>candidato</b> ideal y hacé <b>crecer</b> tu{" "}
              <b>negocio, empresa o emprendimiento</b> con los mejores
              empleados.
            </p>
          </div>
          <div className={styles.profilesGrid}>
            {profiles.map((profile) => (
              <div key={profile.id} className={styles.profilesIntoGrid}>
                <div>
                  <h3 className={styles.profileName}>{profile.name}</h3>
                </div>
                <div className={styles.profileCard}>
                  <div className={styles.profileImageContainer}>
                    <FiUser
                      size={60}
                      color="#777"
                      className={styles.profileIcon}
                    />
                  </div>
                  <h4 className={styles.profileTitle}>{profile.title}</h4>
                  <p className={styles.profileExperience}>
                    {profile.experience}
                  </p>
                  <p className={styles.profileDescription}>
                    {profile.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.graphicContainer}>
          <div className={styles.textGraphic}>
            <h3>Conectamos Talento y Oportunidades</h3>
            <p>
              1️⃣ <b>Plataformas:</b> Conectamos talento y empresas a través de
              una plataforma innovadora que simplifica la búsqueda y el
              reclutamiento.<br></br>
              <br></br>
              2️⃣ <b>Identificación:</b> Facilitamos la identificación del
              candidato ideal mediante un sistema eficiente que resalta
              habilidades y experiencia.<br></br>
              <br></br>
              3️⃣ <b>Estrategia:</b> Optimizamos el proceso de contratación con
              una estrategia ágil y efectiva, adaptada a las necesidades del
              mercado.<br></br>
              <br></br>
              4️⃣ <b>Oportunidades:</b> Abrimos las puertas a nuevas
              oportunidades, permitiendo que empresas y profesionales encuentren
              su mejor camino al éxito.
            </p>
          </div>
          <div className={styles.graphic}>
            <img src="/connecting.png" alt="Graphic." />
          </div>
        </div>
      </div>
    </>
  );
}
