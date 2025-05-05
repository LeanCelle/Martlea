"use client";

import { useState } from "react";
import styles from "@/styles/instructions.module.css";

const stepsCandidate = [
  {
    title: "1. Creá tu perfil",
    description: `Registrate completando tu nombre, apellido, correo electrónico y creando una contraseña segura.
  
  🧠 Consejo: usá una contraseña que incluya letras y números. Asegurate de usar un correo que revises con frecuencia: es donde recibirás las oportunidades.`,
  },
  {
    title: "2. Completá tu información",
    description: `Subí tu CV actualizado y agregá tu foto de perfil para generar confianza.
    
    También vas a poder completar:
  - Experiencia laboral previa
  - Tipo de empleo que buscas actualmente
  - Formación académica
  - Idiomas que hablás
  - Habilidades técnicas y blandas
  - Enlaces a tu LinkedIn, portfolio, GitHub, otros
  
  💡 Consejo: cuanto más completo esté tu perfil, más atractivo será para los reclutadores. Sé específico en tus logros y usa palabras clave relacionadas con el puesto que buscás, para de esta manera lograr llegar a más personas.`,
  },
  {
    title: "3. Verificá tus datos",
    description: `Entrá a la sección "Mi perfil" y asegurate de que toda la información esté bien escrita y actualizada.
  
  📝 Consejo: revisá errores ortográficos y asegurate de que tu descripción personal refleje quién sos y qué buscás.`,
  },
  {
    title: "4. ¡Listo!",
    description: `Ahora tu perfil está activo y listo para que las empresas puedan encontrarte.
  
  🚀 Consejo: actualizá tu perfil regularmente y usá palabras clave estratégicas que las empresas suelen buscar para aparecer en más resultados.`,
  },
];

const stepsRecruiter = [
  {
    title: "1. Buscá talentos",
    description: `Usá la barra de búsqueda para ingresar el título del puesto que querés cubrir o habilidades específicas que estés buscando.
  
  🔍 Consejo: si queres encontrar un analista contable que tenga experiencia en liquidación de impuestos, podes buscar "Contable impuestos" o "contador impuestos" usá estratégicamente las palabras, combinándolas como quieras, de esa forma vas a ser más preciso y encontrarás con mayor facilidad al perfil que buscas!".`,
  },
  {
    title: "2. Aplicá filtros",
    description: `Recomendamos utilizar los filtros, logrando reducir el rango de búsqueda, logrando una mayor efectivad.
    
    Podés filtrar los resultados por:
  - Categoría de empleo y puesto
  - País
  - Región
  - Años de experiencia
  - Edad
  - Nivel educativo
  - Tipo de empleo
  - Género
  - Idiomas
  
  🎯 Consejo: usá múltiples filtros para encontrar el candidato ideal de forma más eficiente.`,
  },
  {
    title: "3. Contactá",
    description: `Una vez que encontrás un perfil interesante, podés:
  - Enviarle un correo directamente desde la plataforma
  - Ingresar a su perfil para ver más detalles
  - Contactarte con el cantidato a través de su número telefónico
  
  📬 Consejo: personalizá tu mensaje para aumentar las chances de recibir respuesta positiva.`,
  },
];

const InstructionStep = ({ step }) => (
  <div className={styles.stepCard}>
    <div className={styles.stepText}>
      <h4>{step.title}</h4>
      <p>{step.description}</p>
    </div>
  </div>
);

export default function InstructionSection() {
  const [role, setRole] = useState(null);

  const handleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <section className={styles.instructions}>
      {!role ? (
        <>
          <h1 className={styles.sectionTitle}>¿Cómo funciona?</h1>
          <div className={styles.roleSelector}>
            <button
              onClick={() => handleSelect("candidate")}
              className={styles.candidateButton}
            >
              Estoy buscando trabajo
            </button>
            <button
              onClick={() => handleSelect("recruiter")}
              className={styles.recruiterButton}
            >
              Soy una empresa o reclutador
            </button>
          </div>
        </>
      ) : (
        <div className={styles.selectedSteps}>
          <h3 className={styles.roleTitle}>
            {role === "candidate" ? "Talento" : "Empresa / Reclutador"}
          </h3>

          {(role === "candidate" ? stepsCandidate : stepsRecruiter).map(
            (step, i) => (
              <InstructionStep key={i} step={step} />
            )
          )}

          <div className={styles.resetContainer}>
            <button
              onClick={() => setRole(null)}
              className={styles.resetButton}
            >
              🔄 Elegir otro rol
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
