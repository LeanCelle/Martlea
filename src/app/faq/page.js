"use client";

import React, { useState } from 'react';
import styles from '@/styles/faq.module.css';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: '¿Para qué es esta plataforma y cómo me beneficia?',
      answer: 'Esta plataforma te permite crear un perfil profesional, destacando tus habilidades y experiencia, para que las empresas puedan encontrarte y ofrecerte oportunidades laborales.'
    },
    {
      question: '¿Cómo puedo registrarme como candidato?',
      answer: 'Solo necesitas completar un formulario con tu información personal y profesional, y podrás crear tu perfil en minutos. Una vez registrado, estarás listo para ser encontrado por empresas que buscan talento como el tuyo.'
    },
    {
      question: '¿Es gratuito registrarme en la plataforma?',
      answer: 'Sí, registrarse como candidato en nuestra plataforma es completamente gratuito.'
    },
    {
      question: '¿Cómo puedo destacar mis habilidades en la plataforma?',
      answer: 'Durante el proceso de registro, podrás añadir tus habilidades, experiencia laboral, educación y más. Asegúrate de completar todos los campos para que tu perfil sea lo más completo posible y aumentes tus oportunidades.'
    },
    {
      question: '¿Puedo postularme a trabajos desde la plataforma?',
      answer: 'Aunque en esta plataforma no puedes postularte a trabajos directamente, tu perfil estará disponible para que las empresas que buscan candidatos con tu perfil puedan contactarte.'
    },
    {
      question: '¿Cómo sabré si las empresas están interesadas en mi perfil?',
      answer: 'Si una empresa está interesada en tu perfil, te contactará directamente a través de tus datos de contactos previamente completados. Asegurate de que tus datos estén correctos.'
    },
    {
      question: '¿Cómo puedo actualizar mi perfil?',
      answer: 'Puedes actualizar tu perfil en cualquier momento. Simplemente ingresa a tu cuenta y edita la información que desees modificar para mantener tu perfil actualizado y atractivo para los reclutadores.'
    },
    {
      question: '¿Puedo agregar una foto de perfil?',
      answer: 'Sí, te recomendamos agregar una foto profesional para que tu perfil sea más atractivo y personal, lo que puede aumentar tus oportunidades de ser contactado.'
    },
    {
      question: '¿Cómo puedo contactar con las empresas?',
      answer: 'No tendrás la opción de contactar a las empresas por iniciativa propia; es un sistema basado en la visibilidad y el interés mutuo.'
    }
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <h1>Preguntas Frecuentes</h1>
      <p className={styles.faqIntro}>
        En esta sección, encontrarás respuestas a las preguntas más comunes sobre nuestra plataforma. 
        Si tienes alguna otra consulta, no dudes en contactarnos.
      </p>

      <div className={styles.faqList}>
        {faqData.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <div
              className={styles.faqQuestion}
              onClick={() => toggleAnswer(index)}
            >
              <h3>{item.question}</h3>
              <span>{activeIndex === index ? '−' : '+'}</span>
            </div>
            {activeIndex === index && (
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
