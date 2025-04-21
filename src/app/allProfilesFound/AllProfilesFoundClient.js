"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import styles from "@/styles/allProfilesFound.module.css";
import Loading from "@/components/Loading";
import { FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import ProfileFilters from "@/components/ProfileFilters";

const AllProfilesFoundClient = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [profiles, setProfiles] = useState([]); // Se inicializa como un array vacío
  const [loading, setLoading] = useState(true);
  const [paramsReady, setParamsReady] = useState(false);

  const normalizeText = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");

  const nivelesOrden = ["Básico", "Intermedio", "Avanzado", "Nativo"];

  function cumpleConIdiomas(usuarioIdiomas, filtrosIdiomas) {
    return filtrosIdiomas.every((filtro) => {
      const idiomaUsuario = usuarioIdiomas.find(
        (ui) => ui.idioma === filtro.idioma
      );
      if (!idiomaUsuario) return false;

      const nivelUsuario = nivelesOrden.indexOf(idiomaUsuario.nivel);
      const nivelRequerido = nivelesOrden.indexOf(filtro.nivel);

      return nivelUsuario >= nivelRequerido;
    });
  }

  const fetchCandidates = async (filters = null) => {
    setProfiles([]); // Limpiar resultados previos
    setLoading(true);

    let queryBuilder = supabase
      .from("profiles")
      .select("*"); // Incluye idiomas relacionados

    if (filters) {
      const hoy = new Date();

      const fechaMax = new Date(
        hoy.getFullYear() - filters.edad[0],
        hoy.getMonth(),
        hoy.getDate()
      );

      const fechaMin = new Date(
        hoy.getFullYear() - filters.edad[1] - 1,
        hoy.getMonth(),
        hoy.getDate() + 1
      );

      const fechaMinISO = fechaMin.toISOString().split("T")[0];
      const fechaMaxISO = fechaMax.toISOString().split("T")[0];

      queryBuilder = queryBuilder
        .gte("fecha_nacimiento", fechaMinISO)
        .lte("fecha_nacimiento", fechaMaxISO);

      if (filters.genero) {
        queryBuilder = queryBuilder.eq("genero", filters.genero);
      }

      if (filters.experiencia && !isNaN(parseInt(filters.experiencia))) {
        queryBuilder = queryBuilder.gte(
          "experiencia",
          parseInt(filters.experiencia)
        );
      }

      if (filters.nivelEducativo && filters.nivelEducativo !== "Todos") {
        queryBuilder = queryBuilder.eq(
          "nivel_educativo",
          filters.nivelEducativo
        );
      }

      if (
        filters.tipoEmpleo &&
        filters.tipoEmpleo !== "Todos" &&
        filters.tipoEmpleo !==
          "Todos (Tiempo completo, Medio tiempo o Freelance)"
      ) {
        queryBuilder = queryBuilder.eq("tipo_empleo", filters.tipoEmpleo);
      }

      if (filters.pais && filters.pais !== "Todos") {
        queryBuilder = queryBuilder.eq("country", filters.pais);
      }

      if (filters.region && filters.region !== "Todas") {
        queryBuilder = queryBuilder.eq("region", filters.region);
      }

      if (filters.categoria && filters.categoria !== "Todas") {
        queryBuilder = queryBuilder.eq("puesto_Empleo", filters.categoria);
      }
      
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
      return;
    }

    let filtered = data || []; // Aseguramos que filtered siempre sea un array

    if (filters?.idiomas?.length > 0) {
      filtered = filtered.filter((profile) =>
        cumpleConIdiomas(profile.idiomas, filters.idiomas)
      );
    }

    const normalizedQuery = normalizeText(searchQuery);
    filtered = filtered.filter((profile) => {
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

    setProfiles(filtered); // Guardamos los resultados en el estado
    setLoading(false);
  };

  // Buscar al cargar la página
  useEffect(() => {
    const getFiltersFromParams = () => {
      const edadStr = searchParams.get("edad");
      const filtros = {
        genero: searchParams.get("genero") || "",
        edad: edadStr ? edadStr.split("-").map(Number) : [18, 99],
        experiencia: searchParams.get("exp") || "",
        nivelEducativo: searchParams.get("edu") || "",
        tipoEmpleo: searchParams.get("tipo") || "",
        pais: searchParams.get("pais") || "",
        region: searchParams.get("region") || "",
        categoria: searchParams.get("cat") || "",
        idiomas: [],
      };

      const idiomasStr = searchParams.get("idiomas");
      if (idiomasStr) {
        try {
          filtros.idiomas = JSON.parse(idiomasStr);
        } catch (e) {
          console.error("Error parsing idiomas:", e);
        }
      }

      return filtros;
    };

    const filtros = getFiltersFromParams();
    fetchCandidates(filtros).then(() => {
      setParamsReady(true);
    });
  }, [searchQuery, searchParams]);

  if (!paramsReady) return <Loading />;

  return (
    <div className={styles.resultsContainer}>
      <h1>Resultados para: &quot;{searchQuery}&quot;</h1>
      <ProfileFilters onFilterChange={fetchCandidates} />

      {loading ? (
        <Loading />
      ) : profiles.length === 0 ? (
        <div className={styles.notFound}>
          <p>No se encontraron candidatos.</p>
        </div>
      ) : (
        <div className={styles.profileList}>
          {profiles.map((profile) => (
            <div key={profile.id} className={styles.profileCard}>
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
                  {profile.cv_url ? (
                    <a
                      href={profile.cv_url}
                      className={styles.seeCv}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver CV
                    </a>
                  ) : (
                    <span className={styles.noCv}>CV no disponible</span>
                  )}
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

export default AllProfilesFoundClient;
