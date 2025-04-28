"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import styles from "@/styles/verPerfil.module.css";
import Loading from "@/components/Loading";
import { FaEdit, FaUserCircle, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

export default function VerPerfil() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    mail: "",
    telefono: "",
    foto_url: "",
    cv_url: "",
    titulo: "",
    tituloEducativo: "",
    descripcion: "",
    fechaNacimiento: "",
    genero: "",
    idiomas: [],
    habilidades: "",
    experiencia: 0,
    nivelEducativo: "",
    tipoEmpleo: "",
    categoriaEmpleo: "",
    puestoEmpleo: "",
    links: [],
    country: "",
    region: "",
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFoto, setEditFoto] = useState(false);
  const [editCV, setEditCV] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  const fetchData = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("No se pudo obtener el usuario");
      return;
    }

    setUser(user);

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error al obtener el perfil:", profileError.message);
    } else {
      setFormData({
        ...data,
        tituloEducativo: data.titulo_educativo || "",
        fechaNacimiento: data.fecha_nacimiento || "",
        nivelEducativo: data.nivel_educativo || "",
        tipoEmpleo: data.tipo_empleo || "",
        categoriaEmpleo: data.categoria_Empleo || "",
        puestoEmpleo: data.puesto_Empleo || "",
        foto_url: data.foto_url,
        cv_url: data.cv_url,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      if (name === "idiomas") {
        try {
          const parsed = JSON.parse(value);
          setFormData((prev) => ({ ...prev, idiomas: parsed }));
        } catch {
          setFormData((prev) => ({ ...prev, idiomas: value }));
        }
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditFoto(false);
    setEditCV(false);
    fetchData();
  };

  const handleCountryChange = (val) => {
    setFormData((prev) => ({ ...prev, country: val, region: "" }));
  };

  const handleRegionChange = (val) => {
    setFormData((prev) => ({ ...prev, region: val }));
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
    const updatedLinks = [...formData.links];
    updatedLinks[index] = value;
    setFormData((prev) => ({
      ...prev,
      links: updatedLinks,
    }));
  };

  const removeLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, ""],
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    let fotoUrl = formData.foto_url;
    let cvUrl = formData.cv_url;
  
    if (formData.foto_url instanceof File) {
      const { data, error } = await supabase.storage
        .from("fotos")
        .upload(`foto-${user.id}-${Date.now()}`, formData.foto_url, {
          cacheControl: "3600",
          upsert: true,
        });
  
      if (error) {
        console.error("Error subiendo foto:", error.message);
      } else {
        fotoUrl = `https://jaaedrbelvfwxangyslm.supabase.co/storage/v1/object/public/fotos/${data.path}`;
      }
    }
  
    if (formData.cv_url instanceof File) {
      const { data, error } = await supabase.storage
        .from("cvs")
        .upload(`cv-${user.id}-${Date.now()}`, formData.cv_url, {
          cacheControl: "3600",
          upsert: true,
        });
  
      if (error) {
        console.error("Error subiendo CV:", error.message);
      } else {
        cvUrl = `https://jaaedrbelvfwxangyslm.supabase.co/storage/v1/object/public/cvs/${data.path}`;
      }
    }
  
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
  
    const profilePayload = {
      id: user.id,
      nombre: formData.nombre,
      apellido: formData.apellido,
      mail: formData.mail,
      telefono: formData.telefono,
      foto_url: fotoUrl,
      cv_url: cvUrl,
      titulo: formData.titulo,
      titulo_educativo: formData.tituloEducativo,
      descripcion: formData.descripcion,
      fecha_nacimiento: formData.fechaNacimiento || null,
      genero: formData.genero,
      idiomas:
        typeof formData.idiomas === "string"
          ? JSON.parse(formData.idiomas)
          : formData.idiomas,
      habilidades: formData.habilidades,
      experiencia: parseInt(formData.experiencia),
      nivel_educativo: formData.nivelEducativo,
      tipo_empleo: formData.tipoEmpleo,
      categoria_Empleo: formData.categoriaEmpleo,
      puesto_Empleo: formData.puestoEmpleo,
      links: formData.links,
      country: formData.country,
      region: formData.region,
    };
  
    if (fetchError || !existingProfile) {
      const { error: createError } = await supabase
        .from("profiles")
        .insert(profilePayload)
        .single();
  
      if (createError) {
        console.error("Error creando perfil:", createError.message);
      } else {
        setSuccessMessage("Perfil creado correctamente ✅");
      }
    } else {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(profilePayload)
        .eq("id", user.id);
  
      if (updateError) {
        console.error("Error actualizando perfil:", updateError.message);
      } else {
        setSuccessMessage("Perfil actualizado correctamente ✅");
      }
    }
  
    setTimeout(() => setSuccessMessage(""), 4000);
    await fetchData();
    setEditMode(false);
    setLoading(false);
  };
  

  if (loading) return <Loading />;

  return (
    <div className={styles.perfilContainer}>
      <form onSubmit={handleUpdate} className={styles.perfilForm}>
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}
        <div className={styles.labelImgNameContainer}>
          <div className={styles.labelImgNameRoleContainer}>
            <div className={styles.labelImgContainer}>
              {editMode ? (
                editFoto ? (
                  <input
                    type="file"
                    name="foto_url"
                    accept="image/*"
                    onChange={handleChange}
                    className={styles.input}
                  />
                ) : (
                  <>
                    {formData.foto_url ? (
                      <div className={styles.editableImage}>
                        <img
                          src={formData.foto_url}
                          alt="Foto de perfil"
                          className={styles.profileImage}
                        />
                        <FaEdit
                          className={styles.editIcon}
                          onClick={() => setEditFoto(true)}
                        />
                      </div>
                    ) : (
                      <FaUserCircle
                        className={styles.defaultProfileIcon}
                        onClick={() => setEditFoto(true)}
                      />
                    )}
                  </>
                )
              ) : formData.foto_url ? (
                <img
                  src={formData.foto_url}
                  alt="Foto de perfil"
                  className={styles.profileImage}
                />
              ) : (
                <FaUserCircle className={styles.defaultProfileIcon} />
              )}
            </div>

            <div className={styles.labelNameContainer}>
              <div className={styles.labelContainer}>
                {editMode ? (
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={styles.input}
                  />
                ) : (
                  <h1>{formData.nombre}</h1>
                )}{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={styles.input}
                  />
                ) : (
                  <h2>{formData.apellido}</h2>
                )}
              </div>
              <div className={styles.labelContainer}>
                {editMode ? (
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    className={styles.input}
                  />
                ) : (
                  <h3>{formData.titulo}</h3>
                )}
              </div>

              <div className={styles.labelContainer}>
                {editMode ? (
                  <RegionDropdown
                    country={formData.country}
                    value={formData.region}
                    onChange={handleRegionChange}
                    className={styles.input}
                    defaultOptionLabel="Selecciona una región"
                  />
                ) : (
                  <>
                    <FaMapMarkerAlt className={styles.locationIcon} />
                    <p>{formData.region},</p>
                  </>
                )}
                {editMode ? (
                  <CountryDropdown
                    value={formData.country}
                    onChange={handleCountryChange}
                    className={styles.input}
                    defaultOptionLabel="Selecciona un país"
                  />
                ) : (
                  <p>{formData.country}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.cvAllContainer}>
            <div className={styles.cvContainer}>
              {editMode ? (
                editCV ? (
                  <input
                    type="file"
                    name="cv_url"
                    accept=".pdf"
                    onChange={handleChange}
                    className={styles.input}
                  />
                ) : formData.cv_url ? (
                  <div className={styles.cvLinkEditable}>
                    <a
                      href={formData.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver CV
                    </a>
                    <FaEdit
                      className={styles.editIconCv}
                      onClick={() => setEditCV(true)}
                    />
                  </div>
                ) : (
                  <div
                    className={styles.noCvContainer}
                    onClick={() => setEditCV(true)}
                  >
                    <FaFileAlt className={styles.noCvIcon} />
                    <span className={styles.noCvText}>
                      Todavía no subiste tu CV
                    </span>
                  </div>
                )
              ) : formData.cv_url ? (
                <a
                  href={formData.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver CV
                </a>
              ) : (
                <div className={styles.noCvContainer}>
                  <FaFileAlt className={styles.noCvIcon} />
                  <span className={styles.noCvText}>CV no disponible</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.contactAndJobContainer}>
          <div className={styles.contactContainer}>
            <h3 className={styles.sectionTitle}>Datos de contacto</h3>

            <div className={styles.labelContainer}>
              <label>Mail:</label>
              {editMode ? (
                <input
                  type="mail"
                  name="mail"
                  value={formData.mail}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <p>{formData.mail}</p>
              )}
            </div>

            <div className={styles.labelContainer}>
              <label>Teléfono:</label>
              {editMode ? (
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <p>{formData.telefono}</p>
              )}
            </div>

            <div className={styles.labelContainer}>
              <label>Fecha de Nacimiento:</label>
              {editMode ? (
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <p>{formData.fechaNacimiento}</p>
              )}
            </div>

            <div className={styles.labelContainer}>
              <label>Género:</label>
              {editMode ? (
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="No especifico">Prefiero no especificar</option>
                </select>
              ) : (
                <p>{formData.genero}</p>
              )}
            </div>
          </div>

          <div className={styles.jobContainer}>
            <h3 className={styles.sectionTitle}>Información Laboral</h3>

            <div className={styles.labelContainer}>
              <label>Experiencia:</label>
              {editMode ? (
                <input
                  name="experiencia"
                  type="number"
                  min="0"
                  value={formData.experiencia}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              ) : (
                <p>{formData.experiencia} años</p>
              )}
            </div>

            <div className={styles.labelContainer}>
              <label>Categoría de empleo: </label>
              {editMode ? (
                <select
                  id="categoriaEmpleo"
                  name="categoriaEmpleo"
                  value={formData.categoriaEmpleo}
                  className={styles.input}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoriaEmpleo: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccioná una categoría</option>
                  <option value="Calificado">Calificado</option>
                  <option value="No Calificado">No calificado</option>
                </select>
              ) : (
                <p>{formData.categoriaEmpleo}</p>
              )}
            </div>

            {formData.categoriaEmpleo && (
              <div className={styles.labelContainer}>
                <label>Puesto: </label>
                {editMode ? (
                  <select
                    id="puestoEmpleo"
                    name="puestoEmpleo"
                    value={formData.puestoEmpleo}
                    className={styles.input}
                    onChange={(e) =>
                      setFormData({ ...formData, puestoEmpleo: e.target.value })
                    }
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
                ) : (
                  <p>{formData.puestoEmpleo}</p>
                )}
              </div>
            )}

            <div className={styles.labelContainer}>
              <label>Tipo de Empleo:</label>
              {editMode ? (
                <select
                  value={formData.tipoEmpleo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoEmpleo: e.target.value })
                  }
                  className={styles.input}
                >
                  <option value="Tiempo Completo">Tiempo completo</option>
                  <option value="Medio Tiempo">Medio tiempo</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Tiempo completo, Medio tiempo o Freelance">
                    Todos (Tiempo completo, Medio tiempo o Freelance)
                  </option>
                </select>
              ) : (
                <p>{formData.tipoEmpleo}</p>
              )}
            </div>

            <div className={styles.labelContainer}>
              <label>Descripción:</label>
              {editMode ? (
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              ) : (
                <p>{formData.descripcion}</p>
              )}
            </div>

            <div className={styles.labelContainer}>
              <label>Habilidades:</label>
              {editMode ? (
                <input
                  type="text"
                  name="habilidades"
                  value={formData.habilidades}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <p>{formData.habilidades}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.studyAndOthersContainer}>
          <div className={styles.studyContainer}>
            <h3 className={styles.sectionTitle}>Estudios</h3>

            <div className={styles.labelContainer}>
              <label>Nivel Educativo:</label>
              {editMode ? (
                <select
                  value={formData.nivelEducativo}
                  onChange={(e) =>
                    setFormData({ ...formData, nivelEducativo: e.target.value })
                  }
                  className={styles.input}
                >
                  <option value="Secundaria">Secundaria</option>
                  <option value="Terciario">Terciario</option>
                  <option value="Universitario">Universitario</option>
                  <option value="Ninguno">Ninguno</option>
                </select>
              ) : (
                <p>{formData.nivelEducativo}</p>
              )}
            </div>

            <div className={styles.labelContainer}>
              <label>Título Educativo:</label>
              {editMode ? (
                <input
                  type="text"
                  name="tituloEducativo"
                  value={formData.tituloEducativo}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <p>{formData.tituloEducativo}</p>
              )}
            </div>

            <div className={styles.labelContainer}>
              <label>Idiomas:</label>
              {editMode ? (
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
              ) : (
                <ul>
                  {Array.isArray(formData.idiomas) &&
                    formData.idiomas.map((item, index) => (
                      <li key={index}>
                        {item.idioma} ({item.nivel})
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
          <div className={styles.othersContainer}>
            <h3 className={styles.sectionTitle}>Otros</h3>

            <div className={styles.labelContainer}>
              <label>Links:</label>
              {editMode ? (
                <>
                  {Array.isArray(formData.links) &&
                    formData.links.map((item, index) => (
                      <div key={index} className={styles.idiomaNivelRow}>
                        <input
                          type="text"
                          name={`link-${index}`}
                          value={item}
                          onChange={(e) =>
                            handleLinkChange(index, e.target.value)
                          }
                          placeholder="Link (Portfolio, LinkedIn, GitHub...)"
                          className={`${styles.input} ${styles.full}`}
                        />

                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className={styles.deleteBtn}
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
                </>
              ) : (
                <ul>
                  {Array.isArray(formData.links) &&
                    formData.links.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          {editMode ? (
            <>
              <button type="submit" className={styles.saveButton}>
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
            </>
          ) : (
            <div>
              {" "}
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className={styles.editButton}
              >
                Editar
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
