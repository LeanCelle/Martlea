# Talent Bridge DB

Talent Bridge DB es una aplicación web que conecta a talentos en búsqueda de empleo con empresas y reclutadores que necesitan cubrir puestos laborales. 

Permite a los usuarios crear un perfil completo con su información profesional, mientras que las empresas pueden buscar candidatos mediante filtros avanzados, todo desde una interfaz intuitiva y responsiva.

---

## 🛠️ Tecnologías utilizadas

- **Next.js** – Framework React para SSR y SSG
- **CSS Modules** – Estilos encapsulados por componente
- **Supabase** – Base de datos como servicio, autenticación y almacenamiento

---

## 🚀 Funcionalidades principales

### Para candidatos:
- Registro y login
- Creación de perfil profesional: experiencia, educación, habilidades, idiomas, links (LinkedIn, GitHub, portfolio)
- Edición de perfil en cualquier momento

### Para reclutadores:
- Búsqueda de candidatos mediante barra de búsqueda
- Aplicación de filtros: experiencia, tecnologías, idiomas, ubicación y más
- Visualización rápida de perfiles y contacto directo

---

## 📦 Instalación local

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/LeanCelle/TalentBridgeDB.git


2. Instalá las dependencias: 
    ```bash 
    npm install

3. Ejecutá el proyecto:
    ```bash 
    npm run dev

---

### 🔒 Seguridad y privacidad
- Los datos de los usuarios están gestionados con Supabase Auth y su sistema de permisos.

- El acceso a la base de datos está protegido por reglas de Row Level Security (RLS).

- La información de los candidatos no es pública sin autorización explícita.

### 🌐 Despliegue
- La app puede desplegarse fácilmente en plataformas como Vercel.
Solo asegurate de configurar correctamente las variables de entorno desde el dashboard.

### 📫 Contacto
¿Tenés dudas, sugerencias o querés colaborar?
¡Estoy disponible para charlar!

Leandro Celle<br>
*Web & Mobile Developer*<br>
📧 leangerman13@gmail.com