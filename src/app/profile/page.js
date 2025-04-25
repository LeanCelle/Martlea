"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/styles/profile.module.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    mail: "",
    foto: null,
    telefono: "",
    cv: null,
    titulo: "",
    tituloEducativo: "",
    descripcion: "",
    fechaNacimiento: "",
    genero: "",
    idiomas: [{ idioma: "", nivel: "" }],
    habilidades: "",
    experiencia: "",
    nivelEducativo: "",
    tipoEmpleo: "",
    links: [""],
    country: "",
    region: "",
    categoriaEmpleo: "",
    puestoEmpleo: "",
  });

  const empleosNoCalificados = [
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

  const empleosCalificados = [
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

  const router = useRouter();

  const [previewUrl, setPreviewUrl] = useState(null);
  const cvInputRef = useRef(null);

  let fotoUrl = null;

  useEffect(() => {
    if (!formData.foto) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.foto);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.foto]);

  // Maneja los inputs normales (texto, select, etc.)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja los archivos
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    // Validar tipos si querés limitar extensiones
    const validFotoTypes = ["image/jpeg", "image/png", "image/jpg"];
    const validCvTypes = ["application/pdf"];

    if (name === "foto" && validFotoTypes.includes(file.type)) {
      setFormData((prev) => ({ ...prev, foto: file }));
    }

    if (name === "cv" && validCvTypes.includes(file.type)) {
      setFormData((prev) => ({ ...prev, cv: file }));
    }
  };

  const validarFormulario = () => {
    const camposObligatorios = [
      "nombre",
      "apellido",
      "mail",
      "telefono",
      "titulo",
      "tituloEducativo",
      "descripcion",
      "fechaNacimiento",
      "genero",
      "habilidades",
      "experiencia",
      "nivelEducativo",
      "tipoEmpleo",
      "country",
      "region",
      "categoriaEmpleo",
      "puestoEmpleo",
    ];

    for (let campo of camposObligatorios) {
      if (!formData[campo] || formData[campo].toString().trim() === "") {
        setErrorMessage(`El campo "${campo}" es obligatorio.`);
        return false;
      }
    }

    // Validar idiomas
    for (let i = 0; i < formData.idiomas.length; i++) {
      const idioma = formData.idiomas[i];
      if (!idioma.idioma || !idioma.nivel) {
        setErrorMessage(
          `Completa todos los campos del idioma #${i + 1} o eliminálo`
        );
        return false;
      }
    }

    // Validar links (si están)
    for (let link of formData.links) {
      if (!link || link.trim() === "") {
        setErrorMessage("Hay un link vacío, completalo o eliminálo.");
        return false;
      }
    }

    // Validar que el usuario tenga al menos 18 años
    const fechaNacimiento = new Date(formData.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();

    const tiene18 =
      edad > 18 || (edad === 18 && (mes > 0 || (mes === 0 && dia >= 0)));

    if (!tiene18) {
      setErrorMessage("Debés tener al menos 18 años para registrarte.");
      return false;
    }

    return true;
  };

  const handleIdiomaChange = (index, field, value) => {
    const nuevosIdiomas = [...formData.idiomas];
    nuevosIdiomas[index][field] = value;
    setFormData({ ...formData, idiomas: nuevosIdiomas });
  };

  const handleEliminarIdioma = (index) => {
    const nuevosIdiomas = formData.idiomas.filter((_, i) => i !== index);
    setFormData({ ...formData, idiomas: nuevosIdiomas });
  };

  const addIdioma = () => {
    setFormData((prev) => ({
      ...prev,
      idiomas: [...prev.idiomas, { idioma: "", nivel: "" }],
    }));
  };

  const handleLinkChange = (index, value) => {
    const nuevosLinks = [...formData.links];
    nuevosLinks[index] = value;
    setFormData({ ...formData, links: nuevosLinks });
  };

  const addLink = () => {
    setFormData((prev) => ({ ...prev, links: [...prev.links, ""] }));
  };

  const removeLink = (index) => {
    const nuevosLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: nuevosLinks });
  };

  const handleCountryChange = (val) => {
    setFormData((prev) => ({ ...prev, country: val, region: "" }));
  };

  const handleRegionChange = (val) => {
    setFormData((prev) => ({ ...prev, region: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setIsSubmitting(true);
    setSubmitError(false);

    try {
      if (formData.foto) {
        const file = formData.foto;

        // Validación adicional
        if (!(file instanceof File)) {
          console.error("El archivo no es válido:", file);
          return;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `foto-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from("fotos")
          .upload(filePath, file, {
            contentType: file.type, // <- Esto es clave
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        fotoUrl = supabase.storage.from("fotos").getPublicUrl(data.path)
          .data.publicUrl;
      }

      // 2. Subir el CV (si hay)
      let cvUrl = null;
      if (formData.cv) {
        const { data, error } = await supabase.storage
          .from("cvs")
          .upload(`cv-${Date.now()}`, formData.cv);

        if (error) throw error;
        cvUrl = supabase.storage.from("cvs").getPublicUrl(data.path)
          .data.publicUrl;
      }

      const user = await supabase.auth.getUser();
      const { id } = user.data.user;

      // 3. Insertar los datos
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id, // este es clave
          nombre: formData.nombre,
          apellido: formData.apellido,
          mail: formData.mail,
          telefono: formData.telefono,
          foto_url: fotoUrl,
          cv_url: cvUrl,
          titulo: formData.titulo,
          titulo_educativo: formData.tituloEducativo,
          descripcion: formData.descripcion,
          fecha_nacimiento: formData.fechaNacimiento,
          genero: formData.genero,
          idiomas:
            formData.idiomas.length > 0
              ? formData.idiomas
              : [{ idioma: "(Vacío)", nivel: "(Vacío)" }],
          habilidades: formData.habilidades,
          experiencia: parseInt(formData.experiencia),
          nivel_educativo: formData.nivelEducativo,
          tipo_empleo: formData.tipoEmpleo,
          categoria_Empleo: formData.categoriaEmpleo,
          puesto_Empleo: formData.puestoEmpleo,
          links:
            formData.links.length > 0
              ? formData.links.map((l) => (l.trim() === "" ? "(Vacío)" : l))
              : ["(Vacío)"],
          country: formData.country,
          region: formData.region,
        },
      ]);

      if (insertError) throw insertError;

      router.push("/ver-perfil");
    } catch (err) {
      console.error("Error al crear el perfil:", err.message);
      setSubmitError(true);
      alert("Hubo un error. Revisá la consola.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Formulario de Registro</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* --- FOTO --- */}
        <div className={styles.photoUpload}>
          <input
            type="file"
            id="foto"
            accept="image/*"
            name="foto"
            onChange={handleFileChange}
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

        {/* --- CV --- */}
        <div className={styles.cvUpload}>
          <input
            type="file"
            id="cv"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            ref={cvInputRef}
            className={styles.fileInput}
          />
          {formData.cv ? (
            <div className={styles.cvFileContainer}>
              <span className={styles.cvFileName}>📄 {formData.cv.name}</span>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, cv: null }));
                  if (cvInputRef.current) cvInputRef.current.value = null;
                }}
                className={styles.deleteCvBtn}
              >
                Eliminar
              </button>
            </div>
          ) : (
            <label htmlFor="cv" className={styles.cvLabel}>
              Cargar CV 📄
            </label>
          )}
        </div>

        {/* --- INFORMACIÓN PERSONAL --- */}
        <div className={styles.information}>
          <h2 className={styles.sectionTitle}>Información Personal</h2>
          <div className={styles.nameLastname}>
            <input
              name="nombre"
              placeholder="Nombre"
              onChange={handleInputChange}
              className={styles.input}
              required
            />
            <input
              name="apellido"
              placeholder="Apellido"
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          <input
            name="mail"
            type="email"
            placeholder="Email"
            onChange={handleInputChange}
            className={styles.input}
            required
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            onChange={handleInputChange}
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
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <select
            name="genero"
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">Género</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="No especifico">Prefiero no especificar</option>
          </select>
          <label className={styles.label}>País</label>
          <CountryDropdown
            value={formData.country}
            onChange={handleCountryChange}
            className={styles.input}
            defaultOptionLabel="Selecciona un país"
          />
          <label className={styles.label}>Región / Provincia</label>
          <RegionDropdown
            country={formData.country}
            value={formData.region}
            onChange={handleRegionChange}
            className={styles.input}
            defaultOptionLabel="Selecciona una región"
          />
        </div>

        {/* --- INFORMACIÓN LABORAL --- */}
        <div className={styles.information}>
          <h2 className={styles.sectionTitle}>Información Laboral</h2>
          <input
            name="titulo"
            placeholder="Título laboral"
            onChange={handleInputChange}
            className={styles.input}
          />
          <textarea
            name="descripcion"
            placeholder="Descripción..."
            onChange={handleInputChange}
            className={`${styles.textarea} ${styles.full}`}
          />
          <input
            name="habilidades"
            placeholder="Habilidades (separadas por coma)"
            onChange={handleInputChange}
            className={`${styles.input} ${styles.full}`}
          />
          <input
            name="experiencia"
            type="number"
            min="0"
            placeholder="Años de experiencia"
            onChange={handleInputChange}
            className={styles.input}
          />
          <select
            name="tipoEmpleo"
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">Preferencia de empleo</option>
            <option value="Tiempo Completo">Tiempo completo</option>
            <option value="Medio Tiempo">Medio tiempo</option>
            <option value="Freelance">Freelance</option>
            <option value="Todos (Tiempo completo, Medio tiempo o Freelance)">
              Todos (Tiempo completo, Medio tiempo o Freelance)
            </option>
          </select>
        </div>

        {/* --- SEARCHING FOR --- */}
        <div className={styles.searchingFor}>
          <h2 className={styles.sectionTitle}>
            ¿Qué tipo de empleo estás buscando?
          </h2>

          {/* Tipo de empleo: categoría */}
          <div className={styles.formGroup}>
            <select
              id="categoriaEmpleo"
              name="categoriaEmpleo"
              value={formData.categoriaEmpleo}
              className={styles.select}
              onChange={handleInputChange}
            >
              <option value="">Seleccioná una categoría</option>
              <option value="Calificado">Calificado</option>
              <option value="No Calificado">No calificado</option>
            </select>
          </div>

          {/* Tipo de empleo: puesto específico */}
          {formData.categoriaEmpleo && (
            <div className={styles.formGroup}>
              <select
                id="puestoEmpleo"
                name="puestoEmpleo"
                value={formData.puestoEmpleo}
                className={styles.select}
                onChange={handleInputChange}
              >
                <option value="">Seleccioná un puesto</option>
                {(formData.categoriaEmpleo === "No Calificado"
                  ? empleosNoCalificados
                  : empleosCalificados
                ).map((empleo, index) => (
                  <option key={index} value={empleo}>
                    {empleo}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* --- EDUCACIÓN --- */}
        <div className={styles.information}>
          <h2 className={styles.sectionTitle}>Educación</h2>
          <select
            name="nivelEducativo"
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">Nivel educativo alcanzado</option>
            <option value="Secundaria">Secundaria</option>
            <option value="Terciario">Terciario</option>
            <option value="Universitario">Universitario</option>
            <option value="Ninguno">Ninguno</option>
          </select>

          {formData.nivelEducativo !== "Ninguno" && (
            <input
              name="tituloEducativo"
              placeholder="Título educativo"
              onChange={handleInputChange}
              className={styles.input}
            />
          )}

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

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        {/* --- SUBMIT --- */}
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting
            ? "Creando perfil..."
            : submitError
            ? "Hubo un error"
            : "Crear perfil"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
