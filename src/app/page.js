"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/page.module.css";
import BlurText from "@/components/BlurText";
import RegisterModal from "@/components/RegisterModal";
import { supabase } from "@/utils/supabaseClient";
import SearchBar from "@/components/SearchBar";
import { FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import profiles from "@/data/proofProfiles";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [totalProfiles, setTotalProfiles] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles") // La tabla que contiene los perfiles
        .select("id", { count: "exact" }); // Seleccionamos solo el ID para contar los registros

      if (error) {
        console.error("Error al obtener perfiles:", error);
      } else {
        setTotalProfiles(data.length); // Guardamos el número de perfiles
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800, // duración de la animación
      once: true, // si querés que se anime solo una vez
    });
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
            <p>
              🎉 +{totalProfiles} perfiles ya forman parte de nuestra red de
              talentos
            </p>
          </div>
        )}

        <div className={styles.carouselWrapper}>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              1024: {
                slidesPerView: 2,
              },
            }}
          >
            {profiles.map((profile) => (
              <SwiperSlide key={profile.id}>
                <div className={styles.prueba}>
                  <div
                    className={styles.profileCard}
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="800"
                  >
                    <div className={styles.fotoContainer}>
                      <FaUserCircle className={styles.defaultProfileIcon} />
                      <h3>{profile.name}</h3>
                      <h4>{profile.title}</h4>
                      <h5>
                        <FaMapMarkerAlt className={styles.locationIcon} />
                        {profile.location}
                      </h5>
                    </div>
                    <div className={styles.descritionContainer}>
                      <h6>{profile.description}</h6>
                      <p>
                        <strong>Habilidades:</strong> {profile.skills}
                      </p>
                      <p>
                        <strong>Años de experiencia:</strong> {profile.experience}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
