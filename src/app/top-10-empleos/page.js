import React from 'react';
import styles from '@/styles/top.module.css';

const TopEmpleos = () => {
  const topCalificados = [
    {
      id: 1,
      nombre: '★ Expertos en Inteligencia Artificial y Automatización',
      descripcion:
        'Los expertos en IA y automatización desarrollan sistemas que permiten a las máquinas realizar tareas de forma autónoma mediante algoritmos y machine learning.',
    },
    {
      id: 2,
      nombre: '★ Especialistas en Ciberseguridad',
      descripcion:
        'Los especialistas en ciberseguridad protegen sistemas y datos contra ataques, identificando vulnerabilidades y aplicando estrategias de protección.',
    },
    {
      id: 3,
      nombre: '★ Responsables de Analítica de Datos',
      descripcion:
        'Los responsables de analítica de datos extraen insights de grandes volúmenes de información para apoyar decisiones empresariales usando herramientas estadísticas y de machine learning.',
    },
    {
      id: 4,
      nombre: 'Desarrolladores de Aplicaciones y Software',
    },
    {
      id: 5,
      nombre: 'Diseñadores UX/UI',
    },
    {
      id: 6,
      nombre: 'Pickers y Preventistas',
    },
    {
      id: 7,
      nombre: 'Ejecutivos de Cuenta y Vendedores',
    },
    {
      id: 8,
      nombre: 'Profesionales en Marketing Digital',
    },
    {
      id: 9,
      nombre: 'Instrumentadores Quirúrgicos y Profesionales de Enfermería',
    },
    {
      id: 10,
      nombre: 'Técnicos y Operarios Especializados',
    },
  ];

  const topNoCalificados = [
    {
      id: 1,
      nombre: '★ Repartidor',
      descripcion:
        'Los repartidores se encargan de entregar paquetes o alimentos a domicilio. Este trabajo requiere agilidad, rapidez, y conocimiento de las rutas locales, sin la necesidad de una formación universitaria específica, pero sí de experiencia en el manejo de vehículos o bicicletas.',
    },
    {
      id: 2,
      nombre: '★ Cajero de Supermercado',
      descripcion:
        'El cajero de supermercado es responsable de procesar las compras de los clientes, cobrar los productos y proporcionar servicio al cliente. Este trabajo no requiere formación académica avanzada, pero sí atención al detalle y habilidad para manejar efectivo o tarjetas de pago.',
    },
    {
      id: 3,
      nombre: '★ Trabajador de Construcción',
      descripcion:
        'Los trabajadores de construcción realizan diversas tareas en proyectos de construcción, como levantar estructuras, reparar edificios o preparar terrenos. Este trabajo se basa principalmente en la habilidad manual, experiencia práctica y conocimiento en el uso de herramientas de construcción.',
    },
    {
      id: 4,
      nombre: 'Vendedor en Tienda',
    },
    {
      id: 5,
      nombre: 'Barbero/Peluquero',
    },
    {
      id: 6,
      nombre: 'Conductor de Camión',
    },
    {
      id: 7,
      nombre: 'Personal de Limpieza',
    },
    {
      id: 8,
      nombre: 'Mesero',
    },
    {
      id: 9,
      nombre: 'Jardinero',
    },
    {
      id: 10,
      nombre: 'Operador de Maquinaria',
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ranking de Empleos <span style={{color:"#48649c"}}>más demandados</span></h1>
      <p className={styles.intro}>
      En esta sección, presentamos una lista de los 10 empleos más solicitados, tanto calificados como no calificados, basándonos en la demanda actual del mercado laboral y las habilidades requeridas para desempeñarse con éxito en cada uno de estos roles.
      </p>

       <div className={styles.optionsContainer}>
        <div className={styles.optionBox}>
          <h3>Empleos Calificados</h3>
          <p>Requieren estudios, formación técnica o conocimientos especializados. Están asociados a mayores niveles de responsabilidad y mejores salarios.</p>
          <a href="#calificados" className={styles.optionLink}>Ir a Calificados</a>
        </div>
        <div className={styles.optionBox}>
          <h3>Empleos No Calificados</h3>
          <p>No requieren formación académica avanzada, pero son esenciales para el funcionamiento de muchos sectores productivos.</p>
          <a href="#noCalificados" className={styles.optionLink}>Ir a No Calificados</a>
        </div>
      </div>

      <h2 id="calificados" className={styles.subtitle}>Top 10 Empleos Calificados más Solicitados</h2>
      <div className={styles.topContainer}>
        <div className={styles.jobs}>
            <ul className={styles.jobList}>
                {topCalificados.map((empleo) => (
                <li key={empleo.id} className={styles.jobItem}>
                    <h3>{empleo.nombre}</h3>
                    <p>{empleo.descripcion}</p>
                    <hr className={styles.hrTop}></hr>
                </li>
                ))}
            </ul>
        </div>
      </div>

      <div className={styles.topContainerGraphic}>
      <div className={styles.jobsGraphicContainer}>
            <img className={styles.jobsGraphic} src="/top-rated-two.svg" alt="Top rated." />
        </div>
        <div className={styles.jobsGraphicContainer}>
            <img className={styles.jobsGraphic} src="/top-rated.svg" alt="Top rated." />
        </div>
      </div>

      <h2 id="noCalificados" className={styles.subtitle}>Top 10 Empleos No Calificados más Solicitados</h2>
      <ul className={styles.jobList}>
        {topNoCalificados.map((empleo) => (
          <li key={empleo.id} className={styles.jobItem}>
            <h3>{empleo.nombre}</h3>
            <p>{empleo.descripcion}</p>
            <hr className={styles.hrTop}></hr>
          </li>
        ))}
      </ul>

      <div className={styles.topContainerGraphic}>
      <div className={styles.jobsGraphicContainer}>
            <img className={styles.jobsGraphic} src="/lowrated-two.png" alt="Low rated." />
        </div>
      </div>
    </div>

    
  );
};

export default TopEmpleos;
