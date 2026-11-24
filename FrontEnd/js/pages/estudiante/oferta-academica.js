document.addEventListener("DOMContentLoaded", () => {
  const MAX_UV = 18;

  // Catálogo simulado que representa la respuesta única del backend (GET /api/oferta)
  // con las asignaturas que el estudiante ya tiene habilitadas según sus requisitos aprobados.
  const catalogoHabilitado = [
    {
      id: "IS-601",
      codigo: "IS-601",
      nombre: "Ingeniería de software",
      uv: 4,
      requisito: "IS-501 · Bases de datos I",
      carrera: "Ingeniería en Sistemas",
      campus: "Ciudad Universitaria",
      secciones: [
        {
          idSec: "IS-601-0800",
          codigoSeccion: "0800",
          docente: "Ing. Carlos Alberto López",
          dias: ["Lun", "Jue"],
          horaInicio: 8,
          horaFin: 10,
          horarioTexto: "Lun · Jue 08:00–10:00",
          aula: "Aula 303",
          modalidad: "Presencial",
          jornada: "Matutina",
          cuposDisponibles: 12,
          cupoMaximo: 30
        },
        {
          idSec: "IS-601-1400",
          codigoSeccion: "1400",
          docente: "Ing. Mariana Castro",
          dias: ["Mar", "Jue"],
          horaInicio: 14,
          horaFin: 16,
          horarioTexto: "Mar · Jue 14:00–16:00",
          aula: "Aula 305",
          modalidad: "Presencial",
          jornada: "Vespertina",
          cuposDisponibles: 4,
          cupoMaximo: 30
        }
      ]
    },
    {
      id: "IS-502",
      codigo: "IS-502",
      nombre: "Bases de datos II",
      uv: 3,
      requisito: "IS-501 · Bases de datos I",
      carrera: "Ingeniería en Sistemas",
      campus: "Ciudad Universitaria",
      secciones: [
        {
          idSec: "IS-502-1000",
          codigoSeccion: "1000",
          docente: "Ing. Roberto Méndez",
          dias: ["Lun", "Mie"],
          horaInicio: 10,
          horaFin: 12,
          horarioTexto: "Lun · Mie 10:00–12:00",
          aula: "Laboratorio 3",
          modalidad: "Presencial",
          jornada: "Matutina",
          cuposDisponibles: 3,
          cupoMaximo: 25
        },
        {
          idSec: "IS-502-1800",
          codigoSeccion: "1800",
          docente: "Msc. Andrea Solórzano",
          dias: ["Lun", "Mie"],
          horaInicio: 18,
          horaFin: 20,
          horarioTexto: "Lun · Mie 18:00–20:00",
          aula: "Aula Virtual",
          modalidad: "Virtual",
          jornada: "Nocturna",
          cuposDisponibles: 14,
          cupoMaximo: 35
        }
      ]
    },
    {
      id: "IS-603",
      codigo: "IS-603",
      nombre: "Redes de Datos",
      uv: 3,
      requisito: "IS-402 · Arquitectura de Computadoras",
      carrera: "Ingeniería en Sistemas",
      campus: "Ciudad Universitaria",
      secciones: [
        {
          idSec: "IS-603-1400",
          codigoSeccion: "1400",
          docente: "Ing. Laura Gómez",
          dias: ["Lun", "Mie"],
          horaInicio: 14,
          horaFin: 16,
          horarioTexto: "Lun · Mie 14:00–16:00",
          aula: "Laboratorio 2",
          modalidad: "Presencial",
          jornada: "Vespertina",
          cuposDisponibles: 8,
          cupoMaximo: 25
        },
        {
          idSec: "IS-603-0800",
          codigoSeccion: "0800",
          docente: "Ing. Fernando Pineda",
          dias: ["Lun", "Jue"],
          horaInicio: 8,
          horaFin: 10,
          horarioTexto: "Lun · Jue 08:00–10:00",
          aula: "Laboratorio 1",
          modalidad: "Presencial",
          jornada: "Matutina",
          cuposDisponibles: 0,
          cupoMaximo: 25
        }
      ]
    },
    {
      id: "IS-701",
      codigo: "IS-701",
      nombre: "Teoría de la Computación",
      uv: 3,
      requisito: "MM-420 · Matemática Discreta",
      carrera: "Ingeniería en Sistemas",
      campus: "Ciudad Universitaria",
      secciones: [
        {
          idSec: "IS-701-0800",
          codigoSeccion: "0800",
          docente: "Dr. Héctor Zelaya",
          dias: ["Mar", "Jue"],
          horaInicio: 8,
          horaFin: 10,
          horarioTexto: "Mar · Jue 08:00–10:00",
          aula: "Aula 309",
          modalidad: "Presencial",
          jornada: "Matutina",
          cuposDisponibles: 0,
          cupoMaximo: 30
        }
      ]
    },
    {
      id: "IS-602",
      codigo: "IS-602",
      nombre: "Programación Web",
      uv: 3,
      requisito: "IS-410 · Programación Orientada a Objetos",
      carrera: "Ingeniería en Sistemas",
      campus: "Ciudad Universitaria",
      secciones: [
        {
          idSec: "IS-602-1000",
          codigoSeccion: "1000",
          docente: "Ing. Sofía Mejía",
          dias: ["Mar", "Jue"],
          horaInicio: 10,
          horaFin: 12,
          horarioTexto: "Mar · Jue 10:00–12:00",
          aula: "Aula Virtual",
          modalidad: "Virtual",
          jornada: "Matutina",
          cuposDisponibles: 15,
          cupoMaximo: 35
        },
        {
          idSec: "IS-602-1700",
          codigoSeccion: "1700",
          docente: "Ing. Daniel Ortega",
          dias: ["Lun", "Mie"],
          horaInicio: 17,
          horaFin: 19,
          horarioTexto: "Lun · Mie 17:00–19:00",
          aula: "Laboratorio 4",
          modalidad: "Presencial",
          jornada: "Nocturna",
          cuposDisponibles: 0,
          cupoMaximo: 25
        }
      ]
    }
  ];

  // Estado de selección provisional (se conserva en sessionStorage)
  let seleccionProvisional = JSON.parse(sessionStorage.getItem("seleccionMatricula")) || [];

  // Referencias del DOM
  const contenedorAsignaturas = document.getElementById("contenedorAsignaturas");
  const badgeTotalMaterias = document.getElementById("badgeTotalMaterias");
  const textoPaginacion = document.getElementById("textoPaginacion");

  const inputBusqueda = document.getElementById("inputBusqueda");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");
  const filtroCarrera = document.getElementById("filtroCarrera");
  const filtroCampus = document.getElementById("filtroCampus");
  const filtroModalidad = document.getElementById("filtroModalidad");
  const filtroJornada = document.getElementById("filtroJornada");
  const checkSoloCupos = document.getElementById("checkSoloCupos");

  const resumenCantidadSeleccion = document.getElementById("resumenCantidadSeleccion");
  const resumenUvSeleccion = document.getElementById("resumenUvSeleccion");
  const btnVerSeleccion = document.getElementById("btnVerSeleccion");

  // =========================================================================
  // 1. FILTRADO Y RENDERIZADO DE ASIGNATURAS CON SECCIONES DESPLEGABLES
  // =========================================================================
  function obtenerAsignaturasFiltradas() {
    const texto = inputBusqueda.value.trim().toLowerCase();
    const carrera = filtroCarrera.value;
    const campus = filtroCampus.value;
    const modalidad = filtroModalidad.value;
    const jornada = filtroJornada.value;
    const soloCupos = checkSoloCupos.checked;

    return catalogoHabilitado
      .map((materia) => {
        const coincideTexto =
          !texto ||
          materia.nombre.toLowerCase().includes(texto) ||
          materia.codigo.toLowerCase().includes(texto);

        const coincideCarrera = carrera === "Todas" || materia.carrera === carrera;
        const coincideCampus = campus === "Todos" || materia.campus === campus;

        if (!coincideTexto || !coincideCarrera || !coincideCampus) return null;

        // Filtrar las secciones internas según modalidad, jornada y cupos
        const seccionesFiltradas = materia.secciones.filter((sec) => {
          const okModalidad = modalidad === "Todas" || sec.modalidad === modalidad;
          const okJornada = jornada === "Todas" || sec.jornada === jornada;
          const okCupos = !soloCupos || sec.cuposDisponibles > 0;
          return okModalidad && okJornada && okCupos;
        });

        if (seccionesFiltradas.length === 0) return null;

        return { ...materia, secciones: seccionesFiltradas };
      })
      .filter(Boolean);
  }

  function renderizarCatalogo() {
    const lista = obtenerAsignaturasFiltradas();
    badgeTotalMaterias.textContent = `${lista.length} ${lista.length === 1 ? "materia" : "materias"}`;
    textoPaginacion.textContent = `Mostrando ${lista.length} de ${catalogoHabilitado.length} materias habilitadas`;

    if (lista.length === 0) {
      contenedorAsignaturas.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-journal-x fs-1 text-body-secondary"></i>
          <p class="fw-semibold text-body mt-2 mb-1">No se encontraron materias con esos filtros</p>
          <p class="text-body-secondary small mb-0">Prueba limpiando los filtros o desmarcando "Solo con cupos".</p>
        </div>
      `;
      return;
    }

    contenedorAsignaturas.innerHTML = lista
      .map((materia, index) => {
        const collapseId = `collapse-${materia.codigo}`;
        const seleccionDeEstaMateria = seleccionProvisional.find((item) => item.codigoMateria === materia.codigo);
        const abiertoPorDefecto = index === 0 || Boolean(seleccionDeEstaMateria);

        const badgeSeleccion = seleccionDeEstaMateria
          ? `<span class="badge ${seleccionDeEstaMateria.enEspera ? "bg-warning text-dark" : "bg-success text-white"} ms-2">
               ${seleccionDeEstaMateria.enEspera ? "En espera" : "Sección " + seleccionDeEstaMateria.codigoSeccion}
             </span>`
          : "";

        const filasSecciones = materia.secciones
          .map((sec) => {
            const estaSeleccionada = seleccionProvisional.some((s) => s.idSec === sec.idSec);
            const sinCupos = sec.cuposDisponibles === 0;
            const pocosCupos = sec.cuposDisponibles > 0 && sec.cuposDisponibles <= 5;

            let estadoCupoHTML = `
              <div class="fw-semibold text-success small">${sec.cuposDisponibles} de ${sec.cupoMaximo}</div>
              <div class="text-body-secondary" style="font-size: 0.72rem;">Disponibles</div>
            `;

            if (sinCupos) {
              estadoCupoHTML = `
                <div class="fw-semibold text-danger small">0 de ${sec.cupoMaximo}</div>
                <div class="text-danger" style="font-size: 0.72rem;">Sin cupos</div>
              `;
            } else if (pocosCupos) {
              estadoCupoHTML = `
                <div class="fw-semibold text-warning-emphasis small">${sec.cuposDisponibles} de ${sec.cupoMaximo}</div>
                <div class="text-warning-emphasis" style="font-size: 0.72rem;">Últimos cupos</div>
              `;
            }

            let botonAccionHTML = "";
            if (estaSeleccionada) {
              botonAccionHTML = `
                <button type="button" class="btn ${sinCupos ? "btn-warning" : "btn-success"} btn-sm rounded-3 px-3 fw-semibold btn-toggle-seccion" data-materia="${materia.codigo}" data-seccion="${sec.idSec}">
                  <i class="bi bi-check2 me-1"></i> ${sinCupos ? "En lista de espera" : "Seleccionada"}
                </button>
              `;
            } else if (sinCupos) {
              botonAccionHTML = `
                <button type="button" class="btn btn-outline-warning text-body btn-sm rounded-3 px-3 fw-semibold btn-toggle-seccion" data-materia="${materia.codigo}" data-seccion="${sec.idSec}">
                  <i class="bi bi-hourglass-split me-1"></i> Lista de espera
                </button>
              `;
            } else {
              botonAccionHTML = `
                <button type="button" class="btn btn-outline-success btn-sm rounded-3 px-3 fw-semibold btn-toggle-seccion" data-materia="${materia.codigo}" data-seccion="${sec.idSec}">
                  <i class="bi bi-plus-lg me-1"></i> Seleccionar
                </button>
              `;
            }

            return `
              <div class="row align-items-center py-3 px-2 border-top g-2 ${estaSeleccionada ? "bg-success-subtle bg-opacity-25 rounded-3" : ""}">
                <div class="col-12 col-md-4">
                  <div class="fw-semibold text-body small">
                    Sección ${sec.codigoSeccion}
                    <span class="badge bg-body-secondary text-body-secondary fw-normal ms-1">${sec.modalidad}</span>
                  </div>
                  <div class="text-body-secondary small">
                    <i class="bi bi-person-video3 me-1"></i> ${sec.docente}
                  </div>
                </div>

                <div class="col-6 col-md-3">
                  <div class="text-body small fw-medium">${sec.horarioTexto}</div>
                  <div class="text-body-secondary" style="font-size: 0.75rem;">${sec.aula}</div>
                </div>

                <div class="col-6 col-md-2 text-md-center">
                  ${estadoCupoHTML}
                </div>

                <div class="col-12 col-md-3 text-md-end">
                  ${botonAccionHTML}
                </div>
              </div>
            `;
          })
          .join("");

        return `
          <div class="border rounded-3 overflow-hidden bg-body">
            <!-- Cabecera de Asignatura -->
            <div class="p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
              <div class="col-md-5">
                <div class="fw-bold text-body">
                  ${materia.nombre} ${badgeSeleccion}
                </div>
                <div class="text-body-secondary small">${materia.codigo} · ${materia.campus}</div>
              </div>

              <div class="col-md-1 text-md-center">
                <span class="badge bg-body-secondary text-body fw-semibold">${materia.uv} UV</span>
              </div>

              <div class="col-md-3">
                <span class="text-success small fw-medium">
                  <i class="bi bi-check-circle me-1"></i> ${materia.requisito}
                </span>
              </div>

              <div class="col-md-3 text-md-end">
                <button
                  class="btn btn-sm btn-outline-secondary rounded-3 fw-semibold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#${collapseId}"
                  aria-expanded="${abiertoPorDefecto}"
                >
                  Ver secciones (${materia.secciones.length}) <i class="bi bi-chevron-down ms-1"></i>
                </button>
              </div>
            </div>

            <!-- Lista desplegable de secciones -->
            <div class="collapse ${abiertoPorDefecto ? "show" : ""}" id="${collapseId}">
              <div class="bg-body-tertiary px-3 pb-2">
                ${filasSecciones}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    asignarEventosBotonesSeccion();
  }

  // =========================================================================
  // 2. SELECCIÓN DE SECCIONES Y VALIDACIONES PREVENTIVAS
  // =========================================================================
  function asignarEventosBotonesSeccion() {
    document.querySelectorAll(".btn-toggle-seccion").forEach((btn) => {
      btn.addEventListener("click", () => {
        const codigoMateria = btn.dataset.materia;
        const idSec = btn.dataset.seccion;
        alternarSeleccion(codigoMateria, idSec);
      });
    });
  }

  function alternarSeleccion(codigoMateria, idSec) {
    ocultarAlerta();

    // Si ya estaba seleccionada, quitarla
    const indiceExistente = seleccionProvisional.findIndex((s) => s.idSec === idSec);
    if (indiceExistente !== -1) {
      seleccionProvisional.splice(indiceExistente, 1);
      guardarYActualizar();
      return;
    }

    const materia = catalogoHabilitado.find((m) => m.codigo === codigoMateria);
    const seccion = materia.secciones.find((s) => s.idSec === idSec);
    const enEspera = seccion.cuposDisponibles === 0;

    // Regla 1: No permitir dos secciones de la misma materia
    const otraSeccionMismaMateria = seleccionProvisional.find((s) => s.codigoMateria === codigoMateria);
    if (otraSeccionMismaMateria) {
      mostrarAlerta(
        `Ya seleccionaste la sección ${otraSeccionMismaMateria.codigoSeccion} de ${materia.nombre}. Quítala primero si deseas cambiar de horario.`,
        "alert-warning"
      );
      return;
    }

    // Regla 2: Límite máximo de 18 UV (incluye clases con cupo y en lista de espera)
    const uvActuales = calcularUvTotales();
    if (uvActuales + materia.uv > MAX_UV) {
      mostrarAlerta(
        `No puedes superar el límite máximo de ${MAX_UV} UV (actualmente llevas ${uvActuales} UV entre matriculables y lista de espera, y ${materia.nombre} suma ${materia.uv} UV).`,
        "alert-danger"
      );
      return;
    }

    // Regla 3: Verificar choque de horario contra todas las secciones seleccionadas
    const conflicto = verificarChoqueHorario(seccion);
    if (conflicto) {
      mostrarAlerta(
        `Choque de horario: ${materia.nombre} (${seccion.horarioTexto}) se traslapa con ${conflicto.nombreMateria} (${conflicto.horarioTexto}).`,
        "alert-danger"
      );
      return;
    }

    seleccionProvisional.push({
      codigoMateria: materia.codigo,
      nombreMateria: materia.nombre,
      uv: materia.uv,
      idSec: seccion.idSec,
      codigoSeccion: seccion.codigoSeccion,
      docente: seccion.docente,
      dias: seccion.dias,
      horaInicio: seccion.horaInicio,
      horaFin: seccion.horaFin,
      horarioTexto: seccion.horarioTexto,
      aula: seccion.aula,
      modalidad: seccion.modalidad,
      enEspera
    });

    guardarYActualizar();
  }

  function verificarChoqueHorario(nuevaSeccion) {
    for (const item of seleccionProvisional) {
      const compartenDia = item.dias.some((dia) => nuevaSeccion.dias.includes(dia));
      if (compartenDia) {
        const traslapeHoras =
          nuevaSeccion.horaInicio < item.horaFin && nuevaSeccion.horaFin > item.horaInicio;
        if (traslapeHoras) return item;
      }
    }
    return null;
  }

  function calcularUvTotales() {
    return seleccionProvisional.reduce((acc, item) => acc + item.uv, 0);
  }

  function guardarYActualizar() {
    sessionStorage.setItem("seleccionMatricula", JSON.stringify(seleccionProvisional));
    actualizarBarraInferior();
    renderizarCatalogo();
  }

  function actualizarBarraInferior() {
    const total = seleccionProvisional.length;
    const uvTotales = calcularUvTotales();
    const totalEspera = seleccionProvisional.filter((s) => s.enEspera).length;

    resumenCantidadSeleccion.textContent = `${total} ${total === 1 ? "materia seleccionada" : "materias seleccionadas"}`;
    resumenUvSeleccion.textContent = `${uvTotales} de ${MAX_UV} UV${totalEspera > 0 ? ` (incluye ${totalEspera} en lista de espera)` : ""} · Seleccionar no confirma tu matrícula.`;

    btnVerSeleccion.disabled = total === 0;
    btnVerSeleccion.innerHTML = `Ver selección (${total}) <i class="bi bi-arrow-right ms-1"></i>`;
  }

  // =========================================================================
  // 3. MODAL DE REVISIÓN Y CONFIRMACIÓN DE MATRÍCULA
  // =========================================================================
  const modalConfirmarEl = document.getElementById("modalConfirmarMatricula");
  const listaModalMatricular = document.getElementById("listaModalMatricular");
  const seccionModalEspera = document.getElementById("seccionModalEspera");
  const listaModalEspera = document.getElementById("listaModalEspera");
  const modalTextoUv = document.getElementById("modalTextoUv");
  const modalBarraUv = document.getElementById("modalBarraUv");
  const btnConfirmarMatriculaFinal = document.getElementById("btnConfirmarMatriculaFinal");

  function renderizarContenidoModal() {
    const regulares = seleccionProvisional.filter((s) => !s.enEspera);
    const espera = seleccionProvisional.filter((s) => s.enEspera);
    const uv = calcularUvTotales();
    const porcentaje = Math.min(100, Math.round((uv / MAX_UV) * 100));

    modalTextoUv.textContent = `${uv} / ${MAX_UV} UV`;
    modalBarraUv.style.width = `${porcentaje}%`;

    // Renderizar materias con cupo
    if (regulares.length === 0) {
      listaModalMatricular.innerHTML = `<div class="list-group-item text-body-secondary small">No has seleccionado secciones con cupo disponible.</div>`;
    } else {
      listaModalMatricular.innerHTML = regulares
        .map(
          (item) => `
          <div class="list-group-item d-flex justify-content-between align-items-center gap-2">
            <div>
              <div class="fw-bold text-body small">${item.codigoMateria} · ${item.nombreMateria} <span class="badge bg-success-subtle text-success ms-1">${item.uv} UV</span></div>
              <div class="text-body-secondary small">Sección ${item.codigoSeccion} · ${item.docente} · ${item.horarioTexto}</div>
            </div>
            <button type="button" class="btn btn-outline-danger btn-sm btn-quitar-modal" data-idsec="${item.idSec}" title="Quitar sección">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `
        )
        .join("");
    }

    // Renderizar lista de espera si existe
    if (espera.length > 0) {
      seccionModalEspera.classList.remove("d-none");
      listaModalEspera.innerHTML = espera
        .map(
          (item) => `
          <div class="list-group-item d-flex justify-content-between align-items-center gap-2">
            <div>
              <div class="fw-bold text-body small">${item.codigoMateria} · ${item.nombreMateria} <span class="badge bg-warning text-dark ms-1">Lista de espera · ${item.uv} UV</span></div>
              <div class="text-body-secondary small">Sección ${item.codigoSeccion} · ${item.docente} · ${item.horarioTexto}</div>
            </div>
            <button type="button" class="btn btn-outline-danger btn-sm btn-quitar-modal" data-idsec="${item.idSec}" title="Quitar solicitud">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `
        )
        .join("");
    } else {
      seccionModalEspera.classList.add("d-none");
    }

    // Eventos para quitar desde el modal
    document.querySelectorAll(".btn-quitar-modal").forEach((btn) => {
      btn.addEventListener("click", () => {
        seleccionProvisional = seleccionProvisional.filter((s) => s.idSec !== btn.dataset.idsec);
        guardarYActualizar();
        if (seleccionProvisional.length === 0) {
          bootstrap.Modal.getInstance(modalConfirmarEl).hide();
        } else {
          renderizarContenidoModal();
        }
      });
    });
  }

  if (modalConfirmarEl) {
    modalConfirmarEl.addEventListener("show.bs.modal", renderizarContenidoModal);
  }

  if (btnConfirmarMatriculaFinal) {
    btnConfirmarMatriculaFinal.addEventListener("click", () => {
      const regulares = seleccionProvisional.filter((s) => !s.enEspera);
      const espera = seleccionProvisional.filter((s) => s.enEspera);

      // Guardar matrícula confirmada en sessionStorage para consultarla luego en Forma 03
      sessionStorage.setItem("matriculaConfirmada", JSON.stringify(regulares));
      sessionStorage.setItem("listaEsperaConfirmada", JSON.stringify(espera));

      // Limpiar selección provisional
      seleccionProvisional = [];
      guardarYActualizar();

      // Cerrar modal de revisión y abrir modal de éxito
      bootstrap.Modal.getInstance(modalConfirmarEl).hide();

      const detalle = document.getElementById("detalleMatriculaExitosa");
      detalle.textContent = `Se matricularon ${regulares.length} asignaturas${espera.length > 0 ? ` y se registraron ${espera.length} solicitudes en lista de espera` : ""} para el período 2027-I.`;

      const modalExito = new bootstrap.Modal(document.getElementById("modalMatriculaExitosa"));
      modalExito.show();
    });
  }

  // =========================================================================
  // 4. EVENTOS DE FILTROS Y ALERTAS
  // =========================================================================
  btnBuscar.addEventListener("click", renderizarCatalogo);
  inputBusqueda.addEventListener("input", renderizarCatalogo);
  filtroCarrera.addEventListener("change", renderizarCatalogo);
  filtroCampus.addEventListener("change", renderizarCatalogo);
  filtroModalidad.addEventListener("change", renderizarCatalogo);
  filtroJornada.addEventListener("change", renderizarCatalogo);
  checkSoloCupos.addEventListener("change", renderizarCatalogo);

  btnLimpiarFiltros.addEventListener("click", () => {
    inputBusqueda.value = "";
    filtroCarrera.value = "Todas";
    filtroCampus.value = "Todos";
    filtroModalidad.value = "Todas";
    filtroJornada.value = "Todas";
    checkSoloCupos.checked = false;
    ocultarAlerta();
    renderizarCatalogo();
  });

  function mostrarAlerta(mensaje, claseBootstrap) {
    const alerta = document.getElementById("alertaOferta");
    const texto = document.getElementById("textoAlertaOferta");
    texto.textContent = mensaje;
    alerta.className = `alert ${claseBootstrap} alert-dismissible fade show py-2 small mb-4`;
  }

  function ocultarAlerta() {
    document.getElementById("alertaOferta").classList.add("d-none");
  }

  // Inicializar vista
  actualizarBarraInferior();
  renderizarCatalogo();
});