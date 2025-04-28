"use client";

import { useEffect, useRef, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { FaFilter, FaTimes } from "react-icons/fa";
import styles from "@/styles/profileFilters.module.css";
import { useRouter, useSearchParams } from "next/navigation";

const idiomasDisponibles = [
  "Español",
  "Inglés",
  "Francés",
  "Alemán",
  "Italiano",
  "Portugués",
  "Chino",
  "Japonés",
  "Árabe",
  "Hindi",
  "Ruso",
  "Otro",
];

const nivelesIdioma = ["Básico", "Intermedio", "Avanzado", "Nativo"];

const categoriasCalificadas = [
  "Ciencias económicas",
  "Personal de tecnología",
  "Ingeniero",
  "Técnicos de oficios (electricistas, gasistas, plomeros, etc.)",
  "Personal de salud",
  "Recursos humanos",
  "Abogado/a",
  "Técnico mecánico",
  "Arquitecto/a",
  "Marketing",
  "Otros",
];

const categoriasNoCalificadas = [
  "Peón de obra",
  "Personal de limpieza",
  "Mantenimiento",
  "Cadete o mensajero",
  "Mozo/a",
  "Operario",
  "Sereno",
  "Vendedor en comercio",
  "Auxiliar de cocina",
  "Repositor",
  "Otros",
];

const ProfileFilters = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [closing, setClosing] = useState(false);
  const filtersRef = useRef(null);

  const [filters, setFilters] = useState({
    edad: [18, 60],
    genero: "",
    idiomas: [],
    experiencia: "",
    nivel_educativo: "",
    tipo_empleo: "",
    pais: "",
    region: "",
    categoria_Empleo: "",
    puesto_Empleo: "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        closeFilters();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleIdioma = (idioma, nivel) => {
    const newIdiomas = [...filters.idiomas];
    const exists = newIdiomas.find(
      (i) => i.idioma === idioma && i.nivel === nivel
    );
    if (exists) {
      setFilters({
        ...filters,
        idiomas: newIdiomas.filter(
          (i) => !(i.idioma === idioma && i.nivel === nivel)
        ),
      });
    } else {
      setFilters({
        ...filters,
        idiomas: [...newIdiomas, { idioma, nivel }],
      });
    }
  };

  const handleChange = (key, value) => {
    if (key === "categoria_Empleo" && value === "") {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        puesto_Empleo: "",
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const closeFilters = () => {
    setClosing(true);
    setTimeout(() => {
      setShowFilters(false);
      setClosing(false);
    }, 300);
  };

  const quitarFiltros = () => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());

    params.delete("genero");
    params.delete("edad");
    params.delete("exp");
    params.delete("edu");
    params.delete("tipo");
    params.delete("pais");
    params.delete("region");
    params.delete("cat");
    params.delete("idiomas");

    router.push(`?${params.toString()}`);

    setFilters({
      edad: [18, 60],
      genero: "",
      idiomas: [],
      experiencia: "",
      nivel_educativo: "",
      tipo_empleo: "",
      pais: "",
      region: "",
      categoria_Empleo: "",
      puesto_Empleo: "",
    });

    onFilterChange?.({
      edad: [18, 60],
      genero: "",
      idiomas: [],
      experiencia: "",
      nivel_educativo: "",
      tipo_empleo: "",
      pais: "",
      region: "",
      categoria_Empleo: "",
      puesto_Empleo: "",
    });

    setShowFilters(false);
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const aplicarFiltros = () => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());

    filters.genero
      ? params.set("genero", filters.genero)
      : params.delete("genero");
    filters.edad
      ? params.set("edad", filters.edad.join("-"))
      : params.delete("edad");
    filters.experiencia
      ? params.set("exp", filters.experiencia)
      : params.delete("exp");
    filters.nivel_educativo
      ? params.set("edu", filters.nivel_educativo)
      : params.delete("edu");
    filters.tipo_empleo
      ? params.set("tipo", filters.tipo_empleo)
      : params.delete("tipo");
    filters.pais ? params.set("pais", filters.pais) : params.delete("pais");
    filters.region
      ? params.set("region", filters.region)
      : params.delete("region");
    filters.puesto_Empleo
      ? params.set("cat", filters.puesto_Empleo)
      : params.delete("cat");

    if (filters.idiomas.length > 0) {
      params.set("idiomas", JSON.stringify(filters.idiomas));
    } else {
      params.delete("idiomas");
    }

    router.push(`?${params.toString()}`);

    onFilterChange?.(filters);
    setShowFilters(false);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => {
          if (showFilters) {
            closeFilters();
          } else {
            setShowFilters(true);
          }
        }}
      >
        <FaFilter />
        Filtros
      </button>

      {showFilters && (
        <div
          className={`${styles.filtersPanel} ${closing ? styles.closing : ""}`}
          ref={filtersRef}
        >
          <button className={styles.closeButton} onClick={closeFilters}>
            <FaTimes />
          </button>
          <div>
            <label className={styles.mainLabels}>Categoría de empleo:</label>
            <select
              onChange={(e) => handleChange("categoria_Empleo", e.target.value)}
              value={filters.categoria_Empleo}
            >
              <option value="">Seleccionar</option>
              <option value="Calificado">Calificado</option>
              <option value="No calificado">No calificado</option>
            </select>
            {filters.categoria_Empleo && (
              <select
                onChange={(e) => handleChange("puesto_Empleo", e.target.value)}
                value={filters.puesto_Empleo}
              >
                <option value="">Seleccionar</option>
                {(filters.categoria_Empleo === "Calificado"
                  ? categoriasCalificadas
                  : categoriasNoCalificadas
                ).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className={styles.mainLabels}>País:</label>
            <CountryDropdown
              value={filters.pais}
              onChange={(val) => handleChange("pais", val)}
              defaultOptionLabel="Selecciona un país"
            />
            <label className={styles.mainLabels}>Región:</label>
            <RegionDropdown
              country={filters.pais}
              value={filters.region}
              onChange={(val) => handleChange("region", val)}
            />
          </div>

          <div>
            <label className={styles.mainLabels}>Años de experiencia:</label>
            <input
              type="number"
              min="0"
              value={filters.experiencia}
              onChange={(e) =>
                handleChange("experiencia", parseInt(e.target.value))
              }
              className={styles.experienceInput}
            />
          </div>

          <div>
            <label className={styles.mainLabels}>
              Edad: {filters.edad[0]} - {filters.edad[1]}
            </label>
            <input
              type="range"
              min="18"
              max="100"
              value={filters.edad[0]}
              onChange={(e) => {
                const newMin = parseInt(e.target.value);
                if (newMin < filters.edad[1]) {
                  handleChange("edad", [newMin, filters.edad[1]]);
                }
              }}
              className={styles.rangeInput}
            />

            <input
              type="range"
              min="18"
              max="100"
              value={filters.edad[1]}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                if (newMax > filters.edad[0]) {
                  handleChange("edad", [filters.edad[0], newMax]);
                }
              }}
              className={styles.rangeInput}
            />
          </div>

          <div>
            <label className={styles.mainLabels}>Nivel educativo:</label>
            <select
              onChange={(e) => handleChange("nivel_educativo", e.target.value)}
              value={filters.nivel_educativo}
            >
              <option value="">Seleccionar</option>
              <option value="Secundaria">Secundaria</option>
              <option value="Terciario">Terciario</option>
              <option value="Universitario">Universitario</option>
              <option value="Ninguno">Ninguno</option>
            </select>
          </div>

          <div>
            <label className={styles.mainLabels}>Tipo de empleo:</label>
            <select
              onChange={(e) => handleChange("tipo_empleo", e.target.value)}
              value={filters.tipo_empleo}
            >
              <option value="">Seleccionar</option>
              <option value="Tiempo Completo">Tiempo Completo</option>
              <option value="Medio Tiempo">Medio Tiempo</option>
              <option value="Freelance">Freelance</option>
              <option value="Todos (Tiempo completo, Medio tiempo o Freelance)">
                Todos (Tiempo completo, Medio tiempo o Freelance)
              </option>
            </select>
          </div>

          <div>
            <label className={styles.mainLabels}>Género:</label>
            <select
              onChange={(e) => handleChange("genero", e.target.value)}
              value={filters.genero}
            >
              <option value="">Seleccionar</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="No especificado">No especificado</option>
            </select>
          </div>

          <div>
            <label className={styles.mainLabels}>Idiomas:</label>
            {idiomasDisponibles.map((idioma) => (
              <div key={idioma}>
                <strong>{idioma}</strong>
                {nivelesIdioma.map((nivel) => (
                  <label key={`${idioma}-${nivel}`}>
                    <input
                      type="checkbox"
                      checked={filters.idiomas.some(
                        (i) => i.idioma === idioma && i.nivel === nivel
                      )}
                      onChange={() => toggleIdioma(idioma, nivel)}
                    />
                    {nivel}
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.applyButtonContainer}>
            <button className={styles.applyButton} onClick={aplicarFiltros}>
              Aplicar
            </button>
            <button className={styles.clearButton} onClick={quitarFiltros}>
              Quitar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFilters;
