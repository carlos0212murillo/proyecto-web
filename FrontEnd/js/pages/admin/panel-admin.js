document.addEventListener("DOMContentLoaded", () => {
  // Datos de demostración por período (luego vendrán de GET /api/admin/reports/sections)
  const datosPorPeriodo = {
    "2027-I": [
      {
        codigo: "IS-401",
        nombre: "Ingeniería de software",
        uv: 4,
        secciones: 3,
        matriculados: 110,
        cuposTotales: 120,
        enEspera: 0,
        activa: true
      },
      {
        codigo: "IS-302",
        nombre: "Bases de datos II",
        uv: 3,
        secciones: 2,
        matriculados: 90,
        cuposTotales: 90,
        enEspera: 4,
        activa: true
      },
      {
        codigo: "IS-303",
        nombre: "Redes de Datos",
        uv: 3,
        secciones: 2,
        matriculados: 64,
        cuposTotales: 90,
        enEspera: 0,
        activa: true
      },
      {
        codigo: "IS-304",
        nombre: "Teoría de la Computación",
        uv: 3,
        secciones: 2,
        matriculados: 52,
        cuposTotales: 80,
        enEspera: 0,
        activa: true
      },
      {
        codigo: "IS-305",
        nombre: "Programación Web",
        uv: 3,
        secciones: 3,
        matriculados: 80,
        cuposTotales: 100,
        enEspera: 0,
        activa: true
      },
      {
        codigo: "IS-210",
        nombre: "Electiva Técnica I",
        uv: 3,
        secciones: 0,
        matriculados: 0,
        cuposTotales: 0,
        enEspera: 0,
        activa: false
      }
    ],
    "2026-II": [
      {
        codigo: "IS-401",
        nombre: "Ingeniería de software",
        uv: 4,
        secciones: 2,
        matriculados: 78,
        cuposTotales: 80,
        enEspera: 0,
        activa: true
      },
      {
        codigo: "IS-302",
        nombre: "Bases de datos II",
        uv: 3,
        secciones: 2,
        matriculados: 60,
        cuposTotales: 60,
        enEspera: 0,
        activa: true
      },
      {
        codigo: "IS-303",
        nombre: "Redes de Datos",
        uv: 3,
        secciones: 2,
        matriculados: 55,
        cuposTotales: 60,
        enEspera: 0,
        activa: true
      }
    ]
  };

  // Referencias DOM
  const selectPeriodoAdmin = document.getElementById("selectPeriodoAdmin");
  const inputBuscarAdmin = document.getElementById("inputBuscarAdmin");
  const filtroEstadoAdmin = document.getElementById("filtroEstadoAdmin");
  const tablaResumenAdminBody = document.getElementById("tablaResumenAdminBody");
  const contadorAsignaturasTabla = document.getElementById("contadorAsignaturasTabla");

  // KPIs
  const kpiAsignaturasActivas = document.getElementById("kpiAsignaturasActivas");
  const kpiSeccionesAbiertas = document.getElementById("kpiSeccionesAbiertas");
  const kpiDetalleSecciones = document.getElementById("kpiDetalleSecciones");
  const kpiCuposDisponibles = document.getElementById("kpiCuposDisponibles");
  const kpiCuposTotales = document.getElementById("kpiCuposTotales");
  const kpiPorcentajeOcupacion = document.getElementById("kpiPorcentajeOcupacion");
  const kpiEstudiantesMatriculados = document.getElementById("kpiEstudiantesMatriculados");

  // Reportes resumen
  const subtituloTablaAdmin = document.getElementById("subtituloTablaAdmin");
  const subtituloReportesAdmin = document.getElementById("subtituloReportesAdmin");
  const reporteMayorDemanda = document.getElementById("reporteMayorDemanda");
  const reporteSinCupos = document.getElementById("reporteSinCupos");
  const pieReportesAdmin = document.getElementById("pieReportesAdmin");

  // Fecha actual formateada
  const hoy = new Date();
  document.getElementById("fechaActualAdmin").textContent = hoy
    .toLocaleDateString("es-HN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .toUpperCase();

  function obtenerEstadoMateria(item) {
    if (!item.activa) return "Inactiva";
    if (item.cuposTotales - item.matriculados <= 0) return "Completo";
    return "Disponible";
  }

  function actualizarDashboard() {
    const periodo = selectPeriodoAdmin.value;
    const asignaturas = datosPorPeriodo[periodo] || [];
    const activas = asignaturas.filter((a) => a.activa);

    // Cálculo de KPIs globales del período
    const totalSecciones = activas.reduce((acc, a) => acc + a.secciones, 0);
    const totalMatriculados = activas.reduce((acc, a) => acc + a.matriculados, 0);
    const totalCupos = activas.reduce((acc, a) => acc + a.cuposTotales, 0);
    const totalDisponibles = Math.max(0, totalCupos - totalMatriculados);
    const porcentaje = totalCupos > 0 ? ((totalMatriculados / totalCupos) * 100).toFixed(1).replace(".", ",") : "0";

    kpiAsignaturasActivas.textContent = activas.length;
    kpiSeccionesAbiertas.textContent = totalSecciones;
    kpiDetalleSecciones.textContent = `Distribuidas en ${activas.length} asignaturas`;
    kpiCuposDisponibles.textContent = totalDisponibles;
    kpiCuposTotales.textContent = `De ${totalCupos} cupos ofertados`;
    kpiPorcentajeOcupacion.textContent = `${porcentaje} %`;
    kpiEstudiantesMatriculados.textContent = `${totalMatriculados} cupos ocupados`;

    subtituloTablaAdmin.textContent = `Ingeniería en Sistemas · Período ${periodo}`;
    subtituloReportesAdmin.textContent = `Resumen ejecutivo de matrícula y demanda del período ${periodo}.`;
    pieReportesAdmin.textContent = `Datos del período seleccionado · ${totalSecciones} secciones`;

    // Resumen de reportes básicos
    if (activas.length > 0) {
      const masDemandada = [...activas].sort((a, b) => b.matriculados - a.matriculados)[0];
      const sinCupo = activas.filter((a) => a.cuposTotales - a.matriculados <= 0).length;
      reporteMayorDemanda.textContent = `${masDemandada.codigo} (${masDemandada.matriculados} insc.)`;
      reporteSinCupos.textContent = `${sinCupo} ${sinCupo === 1 ? "asignatura" : "asignaturas"}`;
    } else {
      reporteMayorDemanda.textContent = "Sin datos";
      reporteSinCupos.textContent = "0 asignaturas";
    }

    // Filtrado de tabla
    const texto = inputBuscarAdmin.value.trim().toLowerCase();
    const estadoFiltro = filtroEstadoAdmin.value;

    const filtradas = asignaturas.filter((item) => {
      const estado = obtenerEstadoMateria(item);
      const coincideTexto =
        !texto ||
        item.nombre.toLowerCase().includes(texto) ||
        item.codigo.toLowerCase().includes(texto);
      const coincideEstado = estadoFiltro === "todos" || estado === estadoFiltro;
      return coincideTexto && coincideEstado;
    });

    contadorAsignaturasTabla.textContent = `${filtradas.length} ${filtradas.length === 1 ? "asignatura" : "asignaturas"}`;

    if (filtradas.length === 0) {
      tablaResumenAdminBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-body-secondary small">
            No se encontraron asignaturas que coincidan con el filtro aplicado.
          </td>
        </tr>
      `;
      return;
    }

    tablaResumenAdminBody.innerHTML = filtradas
      .map((item) => {
        const estado = obtenerEstadoMateria(item);
        const disponibles = Math.max(0, item.cuposTotales - item.matriculados);
        const pct = item.cuposTotales > 0 ? Math.min(100, Math.round((item.matriculados / item.cuposTotales) * 100)) : 0;

        let badgeEstado = `<span class="badge bg-success-subtle text-success rounded-pill px-3 py-1">Disponible</span>`;
        let colorBarra = "bg-success";
        let textoDisponibles = `<span class="fw-bold text-success">${disponibles}</span>`;

        if (estado === "Completo") {
          badgeEstado = `<span class="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-1">Completo</span>`;
          colorBarra = "bg-warning";
          textoDisponibles = `
            <span class="fw-bold text-warning-emphasis">0</span>
            ${item.enEspera > 0 ? `<div class="text-body-secondary" style="font-size: 0.72rem;">${item.enEspera} en espera</div>` : ""}
          `;
        } else if (estado === "Inactiva") {
          badgeEstado = `<span class="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1">Inactiva</span>`;
          colorBarra = "bg-secondary";
          textoDisponibles = `<span class="text-body-secondary">—</span>`;
        }

        return `
          <tr>
            <td>
              <div class="fw-semibold text-body small">${item.nombre}</div>
              <div class="text-body-secondary" style="font-size: 0.75rem;">${item.codigo} · ${item.uv} UV</div>
            </td>
            <td class="text-center small fw-semibold">${item.secciones}</td>
            <td>
              <div class="small fw-semibold text-body mb-1">${item.matriculados} / ${item.cuposTotales}</div>
              <div class="progress" style="height: 5px; max-width: 150px;">
                <div class="progress-bar ${colorBarra}" role="progressbar" style="width: ${pct}%;" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </td>
            <td class="text-center small">${textoDisponibles}</td>
            <td class="text-end">${badgeEstado}</td>
          </tr>
        `;
      })
      .join("");
  }

  // Eventos de filtrado y cambio de período
  selectPeriodoAdmin.addEventListener("change", actualizarDashboard);
  inputBuscarAdmin.addEventListener("input", actualizarDashboard);
  filtroEstadoAdmin.addEventListener("change", actualizarDashboard);

  // Inicializar
  actualizarDashboard();
});