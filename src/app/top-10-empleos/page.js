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
      nombre: 'Repartidor',
      descripcion:
        'Los repartidores se encargan de entregar paquetes o alimentos a domicilio. Este trabajo requiere agilidad, rapidez, y conocimiento de las rutas locales, sin la necesidad de una formación universitaria específica, pero sí de experiencia en el manejo de vehículos o bicicletas.',
    },
    {
      id: 2,
      nombre: 'Cajero de Supermercado',
      descripcion:
        'El cajero de supermercado es responsable de procesar las compras de los clientes, cobrar los productos y proporcionar servicio al cliente. Este trabajo no requiere formación académica avanzada, pero sí atención al detalle y habilidad para manejar efectivo o tarjetas de pago.',
    },
    {
      id: 3,
      nombre: 'Trabajador de Construcción',
      descripcion:
        'Los trabajadores de construcción realizan diversas tareas en proyectos de construcción, como levantar estructuras, reparar edificios o preparar terrenos. Este trabajo se basa principalmente en la habilidad manual, experiencia práctica y conocimiento en el uso de herramientas de construcción.',
    },
    {
      id: 4,
      nombre: 'Vendedor en Tienda',
      descripcion:
        'El vendedor en tienda ayuda a los clientes a elegir productos y realizar compras. Aunque no se requiere una educación formal avanzada, tener conocimientos sobre el producto y habilidades de atención al cliente son esenciales para tener éxito en este puesto.',
    },
    {
      id: 5,
      nombre: 'Barbero/Peluquero',
      descripcion:
        'Los barberos y peluqueros proporcionan servicios de corte de cabello, peinados y afeitados. Este trabajo requiere destreza manual y creatividad, pero la mayoría de las veces no es necesario un título universitario, solo formación profesional o experiencia en el oficio.',
    },
    {
      id: 6,
      nombre: 'Conductor de Camión',
      descripcion:
        'El conductor de camión es responsable de transportar mercancías de un lugar a otro. Este puesto requiere habilidades de conducción y familiaridad con el manejo de vehículos grandes, pero no necesariamente requiere educación universitaria.',
    },
    {
      id: 7,
      nombre: 'Personal de Limpieza',
      descripcion:
        'El personal de limpieza realiza tareas de mantenimiento y limpieza en oficinas, edificios comerciales y viviendas. Si bien no requiere una formación académica avanzada, el puesto demanda responsabilidad, atención al detalle y capacidad para realizar tareas físicas.',
    },
    {
      id: 8,
      nombre: 'Mesero/Restaurador',
      descripcion:
        'Los meseros en restaurantes se encargan de servir comida y bebidas a los clientes. Aunque no es necesario un título universitario, se requiere una excelente habilidad de comunicación y un buen manejo del servicio al cliente.',
    },
    {
      id: 9,
      nombre: 'Jardinero',
      descripcion:
        'Los jardineros se encargan de mantener jardines y paisajes, plantando y cuidando de plantas y árboles. Este trabajo requiere conocimientos prácticos sobre el cuidado de las plantas, pero no necesariamente un título académico.',
    },
    {
      id: 10,
      nombre: 'Operador de Maquinaria',
      descripcion:
        'Los operadores de maquinaria son responsables de manejar equipos pesados para la construcción, minería, agricultura u otros sectores. Aunque no se requiere formación universitaria, sí se necesita capacitación específica para manejar la maquinaria de manera segura.',
    },
  ];

  const topCalificadosFive = topCalificados.slice(0, 10);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ranking de Empleos <span style={{color:"#48649c"}}>más demandados</span></h1>
      <p className={styles.intro}>
      En esta sección, presentamos una lista de los 10 empleos más solicitados, tanto calificados como no calificados, basándonos en la demanda actual del mercado laboral y las habilidades requeridas para desempeñarse con éxito en cada uno de estos roles. Nuestro objetivo es ofrecer a los usuarios una visión clara sobre las oportunidades laborales más demandadas en los diversos sectores.
      </p>

      <h2 className={styles.subtitle}>Top 10 Empleos Calificados más Solicitados</h2>
      <div className={styles.topContainer}>
        <div className={styles.jobs}>
            <ul className={styles.jobList}>
                {topCalificadosFive.map((empleo) => (
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

      <h2 className={styles.subtitle}>Top 10 Empleos No Calificados más Solicitados</h2>
      <ul className={styles.jobList}>
        {topNoCalificados.map((empleo) => (
          <li key={empleo.id} className={styles.jobItem}>
            <h3>{empleo.nombre}</h3>
            <p>{empleo.descripcion}</p>
            <hr className={styles.hrTop}></hr>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopEmpleos;
