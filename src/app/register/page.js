"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/styles/register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    mail: "",
    foto: null,
    telefono: "",
    cv: null,
    titulo: "",
    descripcion: "",
    fechaNacimiento: "",
    genero: "",
    idiomas: [{ idioma: "", nivel: "" }],
    ubicacion: "",
    habilidades: "",
    experiencia: "",
    nivelEducativo: "",
    tipoEmpleo: "",
    links: [""],
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (formData.foto) {
      const objectUrl = URL.createObjectURL(formData.foto);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl); // Limpia cuando se desmonta o cambia
      };
    } else {
      setPreviewUrl(null);
    }
  }, [formData.foto]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleIdiomaChange = (index, field, value) => {
    const nuevosIdiomas = [...formData.idiomas];
    nuevosIdiomas[index][field] = value;
    setFormData({ ...formData, idiomas: nuevosIdiomas });
  };

  const handleEliminarIdioma = (index) => {
    const nuevosIdiomas = [...formData.idiomas];
    nuevosIdiomas.splice(index, 1);
    setFormData({ ...formData, idiomas: nuevosIdiomas });
  };

  const addIdioma = () => {
    setFormData({
      ...formData,
      idiomas: [...formData.idiomas, { idioma: "", nivel: "" }],
    });
  };

  const handleLinkChange = (index, value) => {
    const nuevosLinks = [...formData.links];
    nuevosLinks[index] = value;
    setFormData({ ...formData, links: nuevosLinks });
  };

  const addLink = () => {
    setFormData({ ...formData, links: [...formData.links, ""] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const removeLink = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      links: prevData.links.filter((_, i) => i !== index),
    }));
  };

  const cvInputRef = useRef(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Formulario de Registro</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.photoUpload}>
          <input
            type="file"
            id="foto"
            accept="image/*"
            name="foto"
            onChange={handleChange}
            className={styles.fileInput}
          />
          <label htmlFor="foto" className={styles.photoLabel}>
            {formData.foto ? (
              <img src={previewUrl} alt="preview" className={styles.preview} />
            ) : (
              <>
                <div className={styles.placeholder}>
                  <span className={styles.plus}>+</span>
                </div>
                <p>Subí tu foto</p>
              </>
            )}
          </label>
        </div>

        <div className={styles.cvUpload}>
          <input
            type="file"
            id="cv"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            ref={cvInputRef}
            className={styles.fileInput}
          />
          {formData.cv ? (
            <div className={styles.cvFileContainer}>
              <span className={styles.cvFileName}>📄 {formData.cv.name}</span>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, cv: "" });
                  if (cvInputRef.current) {
                    cvInputRef.current.value = null;
                  }
                }}
                className={styles.deleteCvBtn}
              >
                Eliminar
              </button>
            </div>
          ) : (
            <label htmlFor="cv" className={styles.cvLabel}>
              📄 Cargar CV
            </label>
          )}
        </div>

        <div className={styles.information}>
          {/* --- INFORMACIÓN PERSONAL --- */}
          <h2 className={styles.sectionTitle}>Información Personal</h2>

          <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            name="apellido"
            placeholder="Apellido"
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            name="mail"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            onChange={handleChange}
            className={styles.input}
          />

          <div className={styles.inputGroup}>
            <label htmlFor="fechaNacimiento" className={styles.label}>
              Fecha de nacimiento
            </label>
            <input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <select
            name="genero"
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Género</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="no aclaro">Prefiero no especificar</option>
          </select>

          <input
            name="ubicacion"
            placeholder="Ubicación actual"
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        {/* --- INFORMACIÓN LABORAL --- */}

        <div className={styles.information}>
          <h2 className={styles.sectionTitle}>Información Laboral</h2>

          <input
            name="titulo"
            placeholder="Título laboral (Desarrollador Frontend, Diseñador UX/UI...)"
            onChange={handleChange}
            className={styles.input}
          />
          <textarea
            name="descripcion"
            placeholder="Descripción..."
            onChange={handleChange}
            className={`${styles.textarea} ${styles.full}`}
          />
          <input
            name="habilidades"
            placeholder="Habilidades (separadas por coma)"
            onChange={handleChange}
            className={`${styles.input} ${styles.full}`}
          />
          <input
            name="experiencia"
            type="number"
            min="0"
            placeholder="Años de experiencia"
            onChange={handleChange}
            className={styles.input}
          />
          <select
            name="tipoEmpleo"
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Preferencia de empleo</option>
            <option value="tiempo completo">Tiempo completo</option>
            <option value="medio tiempo">Medio tiempo</option>
            <option value="freelance">Freelance</option>
            <option value="todos">Todos</option>
          </select>
        </div>

        {/* --- EDUCACIÓN Y EXPERIENCIA --- */}

        <div className={styles.information}>
          <h2 className={styles.sectionTitle}>Educación</h2>

          <select
            name="nivelEducativo"
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Nivel educativo alcanzado</option>
            <option value="graduado">Graduado</option>
            <option value="estudiante">Estudiante</option>
            <option value="ninguno">Ninguno</option>
          </select>

          <div className={styles.languages}>
            {formData.idiomas.map((item, index) => (
              <div key={index} className={styles.idiomaNivelRow}>
                <select
                  value={item.idioma}
                  onChange={(e) =>
                    handleIdiomaChange(index, "idioma", e.target.value)
                  }
                  className={styles.input}
                >
                  <option value="">Seleccionar idioma</option>
                  <option value="Español">Español</option>
                  <option value="Inglés">Inglés</option>
                  <option value="Francés">Francés</option>
                  <option value="Alemán">Alemán</option>
                  <option value="Italiano">Italiano</option>
                  <option value="Portugués">Portugués</option>
                  <option value="Chino">Chino</option>
                  <option value="Japonés">Japonés</option>
                  <option value="Árabe">Árabe</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Ruso">Ruso</option>
                  <option value="Otro">Otro</option>
                </select>

                <select
                  value={item.nivel}
                  onChange={(e) =>
                    handleIdiomaChange(index, "nivel", e.target.value)
                  }
                  className={styles.input}
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Nativo">Nativo</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleEliminarIdioma(index)}
                  className={styles.deleteBtn}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIdioma}
              className={styles.buttonSecondary}
            >
              + Añadir idioma
            </button>
          </div>
        </div>

        {/* --- LINKS --- */}
        <div className={styles.information}>
          <h2 className={styles.sectionTitle}>Links</h2>
          {formData.links.map((link, index) => (
            <div key={index} className={styles.linkContainer}>
              <input
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder="Link (Portfolio, LinkedIn, GitHub...)"
                className={`${styles.input} ${styles.full}`}
              />
              <button
                type="button"
                onClick={() => removeLink(index)}
                className={styles.removeButton}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addLink}
            className={styles.buttonSecondary}
          >
            + Añadir link
          </button>
        </div>

        {/* --- SUBMIT --- */}
        <button type="submit" className={styles.button}>
          Crear Perfil
        </button>
      </form>
    </div>
  );
};

export default Register;
