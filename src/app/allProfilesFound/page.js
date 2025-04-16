"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/utils/supabaseClient";
import styles from "@/styles/allProfilesFound.module.css";
import Loading from "@/components/Loading";
import { FaMapMarkerAlt } from "react-icons/fa";

const AllProfilesFound = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para normalizar texto
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD") // Quita acentos
      .replace(/[\u0300-\u036f]/g, "") // Remueve tildes
      .replace(/\s+/g, ""); // Quita espacios
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("Error fetching profiles:", error);
      } else {
        const normalizedQuery = normalizeText(query);

        const filtered = data.filter((profile) => {
          const combined = `
            ${profile.nombre}
            ${profile.apellido}
            ${profile.titulo}
            ${profile.titulo_educativo}
            ${profile.habilidades}
            ${profile.puesto_Empleo}
          `;
          return normalizeText(combined).includes(normalizedQuery);
        });

        setProfiles(filtered);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, [query]);

  return (
    <div className={styles.resultsContainer}>
      <h1>Resultados para: &quot;{query}&quot;</h1>

      {loading ? (
        <Loading />
      ) : profiles.length === 0 ? (
        <p>No se encontraron candidatos.</p>
      ) : (
        <div className={styles.profileList}>
          {profiles.map((profile) => (
            <div key={profile.id} className={styles.profileCard}>
              <div className={styles.fotoContainer}>
                <img
                  src={profile.foto_url}
                  alt={`${profile.nombre} ${profile.apellido}`}
                />
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
                    href={`${profile.cv_url}`}
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
      )}
    </div>
  );
};

export default AllProfilesFound;
