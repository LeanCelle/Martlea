"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/page.module.css";
import BlurText from "@/components/BlurText";
import RegisterModal from "@/components/RegisterModal";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/app/utils/supabaseClient"; // o como lo tengas vos
import { FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProfiles, setTotalProfiles] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800, // duración de la animación
      once: true, // si querés que se anime solo una vez
    });
  }, []);

  const profileIds = [
    "c1c4ab38-c941-4184-b60a-9472bb87d3f8",
    "d3c2cff6-ecb8-47e2-815e-ebd4eb839170",
  ]; // IDs específicos que querés mostrar

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles") // Nombre de tu tabla
        .select("*")
        .in("id", profileIds); // Buscar solo los que coincidan con los IDs

      if (error) {
        console.error("Error fetching profiles:", error);
      } else {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    const fetchTotalProfiles = async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true }); // Solo cuenta, no trae datos

      if (error) {
        console.error("Error fetching total profiles:", error);
      } else {
        setTotalProfiles(count);
      }
    };

    fetchTotalProfiles();
  }, []);

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
            {showRegisterModal && (
              <RegisterModal onClose={() => setShowRegisterModal(false)} />
            )}
          </header>

          <SearchBar />
        </div>

        <div className={styles.textGraphic}>
          <h3>
            ¿Sos reclutador, dueño de una empresa o estás buscando talento para
            tu equipo?
          </h3>
          <p style={{ textAlign: "center" }}>
            <b>Encontrá</b> al <b>candidato</b> ideal y hacé <b>crecer</b> tu{" "}
            <b>negocio, empresa o emprendimiento</b> con los mejores empleados.
          </p>
        </div>

        <div className={styles.graphicContainer}>
          <div className={styles.graphic}>
            <img
              src="/connectingTalent.jpg"
              alt="Graphic."
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-once="true"
            />
          </div>
          <div className={styles.textGraphic}>
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
        </div>

        {totalProfiles > 0 && (
          <div className={styles.totalProfiles}>
            <p style={{}}>
              🎉 +{totalProfiles} perfiles ya forman parte de nuestra red de
              talentos
            </p>
          </div>
        )}

        <div className={styles.profilesGrid}>
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className={styles.profileCard}
              data-aos="fade-up"
              data-aos-delay={index * 100} // animación escalonada
            >
              <div className={styles.fotoContainer}>
                {profile.foto_url ? (
                  <img
                    src={profile.foto_url}
                    alt={`${profile.nombre} ${profile.apellido}`}
                    className={styles.profileImage}
                  />
                ) : (
                  <FaUserCircle className={styles.defaultProfileIcon} />
                )}
                <h3>
                  {profile.nombre} {profile.apellido}
                </h3>
                <h4>{profile.titulo}</h4>
                <h5>
                  <FaMapMarkerAlt className={styles.locationIcon} />
                  {profile.country}, {profile.region}
                </h5>
              </div>
              <div className={styles.descritionContainer}>
                <h6>{profile.descripcion}</h6>
                <p>
                  <strong>Habilidades:</strong> {profile.habilidades}
                </p>
                <p>
                  <strong>Años de experiencia:</strong> {profile.experiencia}
                </p>
              </div>
              <div className={styles.contactContainer}>
                <div className={styles.cvContainer}>
                  <a
                    href={profile.cv_url}
                    className={styles.seeCv}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver CV
                  </a>
                </div>
                <div className={styles.ProfileEmailContainer}>
                  <a
                    href={`/individualProfile/${profile.id}`}
                    className={styles.goToMail}
                  >
                    Ir a perfil
                  </a>
                  <a
                    href={`mailto:${profile.mail}`}
                    className={styles.goToMail}
                  >
                    Contactar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
