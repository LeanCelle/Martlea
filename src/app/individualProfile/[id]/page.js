"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import styles from "@/styles/individualProfile.module.css";
import Loading from "@/components/Loading";
import { FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";

const IndividualProfile = () => {
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
    links: [],
    country: "",
    region: "",
  });
  const [loading, setLoading] = useState(true);
  const [edad, setEdad] = useState(null); // Estado para la edad
  const params = useParams();
  const id = params.id;

  const fetchData = async () => {
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
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
        foto_url: data.foto_url,
        cv_url: data.cv_url,
      });
      calcularEdad(data.fecha_nacimiento);
    }

    setLoading(false);
  };

  const calcularEdad = (fechaNacimiento) => {
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const hoy = new Date();
    let edadCalculada = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
    const mes = hoy.getMonth();
    const dia = hoy.getDate();

    if (
      mes < fechaNacimientoDate.getMonth() ||
      (mes === fechaNacimientoDate.getMonth() &&
        dia < fechaNacimientoDate.getDate())
    ) {
      edadCalculada--;
    }

    setEdad(edadCalculada);
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className={styles.perfilContainer}>
      <form className={styles.perfilForm}>
        <div className={styles.labelImgNameContainer}>
          <div className={styles.labelImgNameRoleContainer}>
            <div className={styles.labelImgContainer}>
              {formData.foto_url ? (
                <img
                  src={formData.foto_url}
                  alt={`${formData.nombre} ${formData.apellido}`}
                  className={styles.profileImage}
                />
              ) : (
                <FaUserCircle className={styles.defaultProfileIcon} />
              )}
            </div>

            <div className={styles.labelNameContainer}>
              <div className={styles.labelContainer}>
                <h1>{formData.nombre}</h1>
                <h2>{formData.apellido}</h2>
              </div>
              <div className={styles.labelContainer}>
                <h3>{formData.titulo}</h3>
              </div>

              <div className={styles.labelContainer}>
                <FaMapMarkerAlt className={styles.locationIcon} />
                <p>{formData.region},</p>
                <p>{formData.country}</p>
              </div>
            </div>
          </div>

          <div className={styles.cvAllContainer}>
            <div className={styles.cvContainer}>
              {formData.cv_url ? (
                <a
                  href={formData.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver CV
                </a>
              ) : (
                <p className={styles.notAvailableText}>CV no disponible</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.contactAndJobContainer}>
          <div className={styles.contactContainer}>
            <h3 className={styles.sectionTitle}>Datos de contacto</h3>

            <div className={styles.labelContainer}>
              <label>Mail:</label>
              <a href={`mailto:${formData.mail}`}>{formData.mail}</a>
            </div>

            <div className={styles.labelContainer}>
              <label>Teléfono:</label>
              <p>{formData.telefono}</p>
            </div>

            <div className={styles.labelContainer}>
              <label>Fecha de Nacimiento:</label>
              <p>{formData.fechaNacimiento}</p>
            </div>

            <div className={styles.labelContainer}>
              <label>Edad:</label>
              <p>{edad !== null ? edad : "Cargando..."}</p>{" "}
              {/* Mostramos la edad calculada */}
            </div>

            <div className={styles.labelContainer}>
              <label>Género:</label>
              <p>{formData.genero}</p>
            </div>
          </div>

          <div className={styles.jobContainer}>
            <h3 className={styles.sectionTitle}>Información Laboral</h3>

            <div className={styles.labelContainer}>
              <label>Experiencia:</label>
              <p>{formData.experiencia} años</p>
            </div>

            <div className={styles.labelContainer}>
              <label>Tipo de Empleo:</label>
              <p>{formData.tipoEmpleo}</p>
            </div>

            <div className={styles.labelContainer}>
              <label>Descripción:</label>
              <p>{formData.descripcion}</p>
            </div>

            <div className={styles.labelContainer}>
              <label>Habilidades:</label>
              <p>{formData.habilidades}</p>
            </div>
          </div>
        </div>

        <div className={styles.studyAndOthersContainer}>
          <div className={styles.studyContainer}>
            <h3 className={styles.sectionTitle}>Estudios</h3>

            <div className={styles.labelContainer}>
              <label>Nivel Educativo:</label>
              <p>{formData.nivelEducativo}</p>
            </div>

            <div className={styles.labelContainer}>
              <label>Título Educativo:</label>
              <p>{formData.tituloEducativo}</p>
            </div>

            <div className={styles.labelContainer}>
              <label>Idiomas:</label>
              <ul>
                {Array.isArray(formData.idiomas) &&
                  formData.idiomas.map((item, index) => (
                    <li key={index}>
                      {item.idioma} ({item.nivel})
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className={styles.othersContainer}>
            <h3 className={styles.sectionTitle}>Otros</h3>

            <div className={styles.labelContainer}>
              <label>Links:</label>
              <ul>
                {Array.isArray(formData.links) &&
                  formData.links.map((item, index) => {
                    const isLink = /^https?:\/\//.test(item);
                    return (
                      <li key={index}>
                        {isLink ? (
                          <a
                            href={item}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item}
                          </a>
                        ) : (
                          item
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IndividualProfile;
