import { supabase } from "@/utils/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("query") || "";

  const filters = JSON.parse(searchParams.get("filters") || "{}");

  const nivelesOrden = ["Básico", "Intermedio", "Avanzado", "Nativo"];

  const cumpleConIdiomas = (usuarioIdiomas, filtrosIdiomas) => {
    return filtrosIdiomas.every((filtro) => {
      const idiomaUsuario = usuarioIdiomas.find(
        (ui) => ui.idioma === filtro.idioma
      );
      if (!idiomaUsuario) return false;

      const nivelUsuario = nivelesOrden.indexOf(idiomaUsuario.nivel);
      const nivelRequerido = nivelesOrden.indexOf(filtro.nivel);

      return nivelUsuario >= nivelRequerido;
    });
  };

  try {
    let queryBuilder = supabase
      .from("profiles")
      .select("*");

    if (filters) {
      const hoy = new Date();

      const fechaMax = new Date(
        hoy.getFullYear() - filters.edad[0],
        hoy.getMonth(),
        hoy.getDate()
      );

      const fechaMin = new Date(
        hoy.getFullYear() - filters.edad[1] - 1,
        hoy.getMonth(),
        hoy.getDate() + 1
      );

      const fechaMinISO = fechaMin.toISOString().split("T")[0];
      const fechaMaxISO = fechaMax.toISOString().split("T")[0];

      queryBuilder = queryBuilder
        .gte("fecha_nacimiento", fechaMinISO)
        .lte("fecha_nacimiento", fechaMaxISO);

      if (filters.genero) {
        queryBuilder = queryBuilder.eq("genero", filters.genero);
      }

      if (filters.experiencia && !isNaN(parseInt(filters.experiencia))) {
        queryBuilder = queryBuilder.gte(
          "experiencia",
          parseInt(filters.experiencia)
        );
      }

      if (filters.nivelEducativo && filters.nivelEducativo !== "Todos") {
        queryBuilder = queryBuilder.eq(
          "nivel_educativo",
          filters.nivelEducativo
        );
      }

      if (
        filters.tipoEmpleo &&
        filters.tipoEmpleo !== "Todos" &&
        filters.tipoEmpleo !==
          "Todos (Tiempo completo, Medio tiempo o Freelance)"
      ) {
        queryBuilder = queryBuilder.eq("tipo_empleo", filters.tipoEmpleo);
      }

      if (filters.pais && filters.pais !== "Todos") {
        queryBuilder = queryBuilder.eq("country", filters.pais);
      }

      if (filters.region && filters.region !== "Todas") {
        queryBuilder = queryBuilder.eq("region", filters.region);
      }

      if (filters.categoria && filters.categoria !== "Todas") {
        queryBuilder = queryBuilder
          .eq("categoria_Empleo", filters.categoria)
          .eq("puesto_Empleo", filters.categoria);
      }
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
      return;
    }
    
    let filtered = data || [];
    
    if (filters?.idiomas?.length > 0) {
      filtered = filtered.filter((profile) =>
        cumpleConIdiomas(profile.idiomas, filters.idiomas)
      );
    }
    
    const normalizedQuery = normalizeText(searchQuery);
    filtered = filtered.filter((profile) => {
      const combined = `
        ${profile.nombre}
        ${profile.apellido}
        ${profile.titulo}
        ${profile.titulo_educativo}
        ${profile.habilidades}
        ${profile.puesto_Empleo}
      `;
      return normalizeText(combined).includes(normalizedQuery);
    });
    
    console.log(filtered);
    setProfiles(filtered);
    setLoading(false);
    

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
