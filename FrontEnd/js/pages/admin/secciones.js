document.addEventListener("DOMContentLoaded", () => {
  // Catálogo simulado de asignaturas activas (luego vendrá de GET /api/admin/subjects)
  const asignaturasDisponibles = [
    { codigo: "IS-601", nombre: "Ingeniería de software", uv: 4 },
    { codigo: "IS-502", nombre: "Bases de datos II", uv: 3 },
    { codigo: "IS-603", nombre: "Redes de Datos", uv: 3 },
    { codigo: "IS-701", nombre: "Teoría de la Computación", uv: 3 },
    { codigo: "IS-602", nombre: "Programación Web", uv: 3 },
    { codigo: "MM-420", nombre: "Matemática Discreta", uv: 4 }
  ];

  // Datos simulados de secciones (luego vendrán de GET /api/sections)
  let secciones = [
    {
      id: "sec-1",
      periodo: "2027-I",
      codigoMateria: "IS-601",
      nombreMateria: "Ingeniería de software",
      uv: 4,
      codigoSeccion: "0800",
      docente: "Ing. Carlos Alberto López",
      dias: ["Lun", "Jue"],
      horaInicio: 8,
      horaFin: 10,
      aula: "Aula 303",
      modalidad: "Presencial",
      cupoMaximo: 30,
      matriculados: 18,
      activa: true
    },
    {
      id: "sec-2",
      periodo: "2027-I",
      codigoMateria: "IS-601",
      nombreMateria: "Ingeniería de software",
      uv: 4,
      codigoSeccion: "1400",
      docente: "Ing. Mariana Castro",
      dias: ["Mar", "Jue"],
      horaInicio: 14,
      horaFin: 16,
      aula: "Aula 305",
      modalidad: "Presencial",
      cupoMaximo: 30,
      matriculados: 26,
      activa: true
    },
    {
      id: "sec-3",
      periodo: "2027-I",
      codigoMateria: "IS-502",
      nombreMateria: "Bases de datos II",
      uv: 3,
      codigoSeccion: "1000",
      docente: "Ing. Roberto Méndez",
      dias: ["Lun", "Mie"],
      horaInicio: 10,
      horaFin: 12,
      aula: "Laboratorio 3",
      modalidad: "Presencial",
      cupoMaximo: 25,
      matriculados: 22,
      activa: true
    },
    {
      id: "sec-4",
      periodo: "2027-I",
      codigoMateria: "IS-502",
      nombreMateria: "Bases de datos II",
      uv: 3,
      codigoSeccion: "1800",
      docente: "Msc. Andrea Solórzano",
      dias: ["Lun", "Mie"],
      horaInicio: 18,
      horaFin: 20,
      aula: "Aula Virtual",
      modalidad: "Virtual",
      cupoMaximo: 35,
      matriculados: 21,
      activa: true
    },
    {
      id: "sec-5",
      periodo: "2027-I",
      codigoMateria: "IS-603",
      nombreMateria: "Redes de Datos",
      uv: 3,
      codigoSeccion: "1400",
      docente: "Ing. Laura Gómez",
      dias: ["Lun", "Mie"],
      horaInicio: 14,
      horaFin: 16,
      aula: "Laboratorio 2",
      modalidad: "Presencial",
      cupoMaximo: 25,
      matriculados: 17,
      activa: true
    },
    {
      id: "sec-6",
      periodo: "2027-I",
      codigoMateria: "IS-602",
      nombreMateria: "Programación Web",
      uv: 3,
      codigoSeccion: "1700",
      docente: "Ing. Daniel Ortega",
      dias: ["Vie"],
      horaInicio: 17,
      horaFin: 20,
      aula: "Laboratorio 4",
      modalidad: "Presencial",
      cupoMaximo: 25,
      matriculados: 0,
      activa: false
    },
    {
      id: "sec-7",
      periodo: "2026-II",
      codigoMateria: "IS-601",
      nombreMateria: "Ingeniería de software",
      uv: 4,
      codigoSeccion: "0800",
      docente: "Ing. Carlos Alberto López",
      dias: ["Lun", "Jue"],
      horaInicio: 8,
      horaFin: 10,
      aula: "Aula 303",
      modalidad: "Presencial",
      cupoMaximo: 30,
      matriculados: 30,
      activa: true
    }
  ];

  let seccionPendienteEstado = null;

  // Referencias DOM
  const selectPeriodoSecciones = document.getElementById("selectPeriodoSecciones");
  const inputBuscarSeccion = document.getElementById("inputBuscarSeccion");
  const filtroModalidadSeccion = document.getElementById("filtroModalidadSeccion");
  const filtroEstadoSeccion = document.getElementById("filtroEstadoSeccion");
  const tablaSeccionesBody = document.getElementById("tablaSeccionesBody");
  const contadorResultadosSecciones = document.getElementById("contadorResultadosSecciones");

  const kpiTotalSecciones = document.getElementById("kpiTotalSecciones");
  const kpiSeccionesActivas = document.getElementById("kpiSeccionesActivas");
  const kpiSeccionesInactivas = document.getElementById("kpiSeccionesInactivas");

  // Modal Formulario
  const modalFormEl = document.getElementById("modalFormSeccion");
  const modalForm = new bootstrap.Modal(modalFormEl);
  const formSeccion = document.getElementById("formSeccion");
  const tituloModalSeccion = document.getElementById("tituloModalSeccion");
  const alertaModalSeccion = document.getElementById("alertaModalSeccion");

  const seccionIdEdicion = document.getElementById("seccionIdEdicion");
  const selectAsignaturaModal = document.getElementById("selectAsignaturaModal");
  const inputCodigoSeccion = document.getElementById("inputCodigoSeccion");
  const inputDocenteSeccion = document.getElementById("inputDocenteSeccion");
  const selectModalidadModal = document.getElementById("selectModalidadModal");
  const inputAulaSeccion = document.getElementById("inputAulaSeccion");
  const selectHoraInicio = document.getElementById("selectHoraInicio");
  const selectHoraFin = document.getElementById("selectHoraFin");
  const inputCupoSeccion = document.getElementById("inputCupoSeccion");
  const textoAyudaCupo = document.getElementById("textoAyudaCupo");

  // Modal Estado
  const modalEstadoEl = document.getElementById("modalEstadoSeccion");
  const modalEstado = new bootstrap.Modal(modalEstadoEl);
  const btnConfirmarEstadoSec = document.getElementById("btnConfirmarEstadoSec");

  // =========================================================================
  // 1. INICIALIZAR SELECTORES DEL MODAL (ASIGNATURAS Y HORAS)
  // =========================================================================
  function poblarSelectoresModal() {
    selectAsignaturaModal.innerHTML = asignaturasDisponibles
      .map((a) => `<option value="${a.codigo}">${a.codigo} · ${a.nombre} (${a.uv} UV)</option>`)
      .join("");

    let opcionesInicio = "";
    let opcionesFin = "";
    for (let h = 7; h <= 20; h++) {
      const texto = `${String(h).padStart(2, "0")}:00`;
      opcionesInicio += `<option value="${h}">${texto}</option>`;
    }
    for (let h = 8; h <= 21; h++) {
      const texto = `${String(h).padStart(2, "0")}:00`;
      opcionesFin += `<option value="${h}">${texto}</option>`;
    }

    selectHoraInicio.innerHTML = opcionesInicio;
    selectHoraFin.innerHTML = opcionesFin;
  }

  function formatearHorario(dias, horaInicio, horaFin) {
    const ini = `${String(horaInicio).padStart(2, "0")}:00`;
    const fin = `${String(horaFin).padStart(2, "0")}:00`;
    return `${dias.join(" · ")} ${ini}–${fin}`;
  }

  // =========================================================================
  // 2. RENDERIZADO DE KPIs Y TABLA
  // =========================================================================
  function actualizarVista() {
    const periodo = selectPeriodoSecciones.value;
    const delPeriodo = secciones.filter((s) => s.periodo === periodo);
    const activas = delPeriodo.filter((s) => s.activa).length;
    const inactivas = delPeriodo.length - activas;

    kpiTotalSecciones.textContent = delPeriodo.length;
    kpiSeccionesActivas.textContent = activas;
    kpiSeccionesInactivas.textContent = inactivas;

    const texto = inputBuscarSeccion.value.trim().toLowerCase();
    const modalidad = filtroModalidadSeccion.value;
    const estado = filtroEstadoSeccion.value;

    const filtradas = delPeriodo.filter((sec) => {
      const coincideTexto =
        !texto ||
        sec.nombreMateria.toLowerCase().includes(texto) ||
        sec.codigoMateria.toLowerCase().includes(texto) ||
        sec.codigoSeccion.toLowerCase().includes(texto) ||
        sec.docente.toLowerCase().includes(texto);

      const coincideModalidad = modalidad === "Todas" || sec.modalidad === modalidad;
      const estadoSec = sec.activa ? "Activa" : "Inactiva";
      const coincideEstado = estado === "todos" || estadoSec === estado;

      return coincideTexto && coincideModalidad && coincideEstado;
    });

    contadorResultadosSecciones.textContent = `${filtradas.length} ${filtradas.length === 1 ? "sección" : "secciones"}`;

    if (filtradas.length === 0) {
      tablaSeccionesBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-4 text-body-secondary small">
            No se encontraron secciones programadas con los filtros actuales.
          </td>
        </tr>
      `;
      return;
    }

    tablaSeccionesBody.innerHTML = filtradas
      .map((sec) => {
        const badgeEstado = sec.activa
          ? `<span class="badge bg-success-subtle text-success rounded-pill px-2 py-1">Activa</span>`
          : `<span class="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1">Inactiva</span>`;

        const iconoEstado = sec.activa ? "bi-slash-circle" : "bi-check-circle";
        const tituloEstado = sec.activa ? "Desactivar sección" : "Activar sección";
        const colorBtnEstado = sec.activa ? "btn-outline-danger" : "btn-outline-success";

        return `
          <tr class="${sec.activa ? "" : "opacity-75"}">
            <td>
              <div class="fw-semibold text-body small">${sec.nombreMateria}</div>
              <div class="text-body-secondary" style="font-size: 0.75rem;">${sec.codigoMateria} · ${sec.uv} UV</div>
            </td>
            <td class="text-center fw-bold text-body small">${sec.codigoSeccion}</td>
            <td class="small text-body">${sec.docente}</td>
            <td>
              <div class="small fw-medium text-body">${formatearHorario(sec.dias, sec.horaInicio, sec.horaFin)}</div>
              <div class="text-body-secondary" style="font-size: 0.75rem;">
                ${sec.aula} · <span class="fw-medium">${sec.modalidad}</span>
              </div>
            </td>
            <td class="text-center small fw-semibold">
              ${sec.matriculados} / ${sec.cupoMaximo}
            </td>
            <td class="text-center">${badgeEstado}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-outline-secondary btn-editar-seccion" data-id="${sec.id}" title="Editar sección">
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn ${colorBtnEstado} btn-estado-seccion" data-id="${sec.id}" title="${tituloEstado}">
                  <i class="bi ${iconoEstado}"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");

    asignarEventosTabla();
  }

  // =========================================================================
  // 3. CREAR Y EDITAR SECCIÓN (CON VALIDACIONES DE HORARIO, AULA Y DOCENTE)
  // =========================================================================
  document.getElementById("btnAbrirNuevaSeccion").addEventListener("click", () => {
    formSeccion.reset();
    ocultarErrorModal();
    seccionIdEdicion.value = "";
    selectAsignaturaModal.disabled = false;
    selectHoraInicio.value = "8";
    selectHoraFin.value = "10";
    inputCupoSeccion.value = "30";
    inputCupoSeccion.min = "5";
    textoAyudaCupo.textContent = "Mínimo 5 estudiantes.";
    tituloModalSeccion.textContent = `Nueva sección · Período ${selectPeriodoSecciones.value}`;
    modalForm.show();
  });

  function asignarEventosTabla() {
    document.querySelectorAll(".btn-editar-seccion").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sec = secciones.find((s) => s.id === btn.dataset.id);
        if (!sec) return;

        ocultarErrorModal();
        seccionIdEdicion.value = sec.id;
        selectAsignaturaModal.value = sec.codigoMateria;
        selectAsignaturaModal.disabled = true;
        inputCodigoSeccion.value = sec.codigoSeccion;
        inputDocenteSeccion.value = sec.docente;
        selectModalidadModal.value = sec.modalidad;
        inputAulaSeccion.value = sec.aula;
        selectHoraInicio.value = String(sec.horaInicio);
        selectHoraFin.value = String(sec.horaFin);
        inputCupoSeccion.value = String(sec.cupoMaximo);
        inputCupoSeccion.min = String(Math.max(5, sec.matriculados));
        textoAyudaCupo.textContent =
          sec.matriculados > 0
            ? `No puede ser menor a ${sec.matriculados} (matriculados actuales).`
            : "Mínimo 5 estudiantes.";

        document.querySelectorAll(".check-dia-seccion").forEach((chk) => {
          chk.checked = sec.dias.includes(chk.value);
        });

        tituloModalSeccion.textContent = `Editar sección · ${sec.codigoMateria} (${sec.codigoSeccion})`;
        modalForm.show();
      });
    });

    document.querySelectorAll(".btn-estado-seccion").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sec = secciones.find((s) => s.id === btn.dataset.id);
        if (!sec) return;

        seccionPendienteEstado = sec;
        const accion = sec.activa ? "desactivar" : "activar";

        document.getElementById("tituloModalEstadoSec").textContent =
          sec.activa ? "Desactivar sección" : "Activar sección";

        document.getElementById("mensajeModalEstadoSec").textContent = sec.activa
          ? "Por integridad académica, las secciones no se eliminan físicamente. Al desactivarla dejará de estar disponible para nuevas matrículas."
          : "¿Deseas volver a habilitar esta sección en la oferta del período?";

        document.getElementById("detalleSeccionEstado").innerHTML = `
          <div class="fw-bold text-body">${sec.codigoMateria} · ${sec.nombreMateria} (Sección ${sec.codigoSeccion})</div>
          <div class="text-body-secondary mt-1">${sec.docente} · ${formatearHorario(sec.dias, sec.horaInicio, sec.horaFin)} · ${sec.aula}</div>
        `;

        btnConfirmarEstadoSec.className = sec.activa
          ? "btn btn-danger btn-sm rounded-3 px-3 fw-semibold"
          : "btn btn-success btn-sm rounded-3 px-3 fw-semibold";
        btnConfirmarEstadoSec.textContent = `Sí, ${accion}`;

        modalEstado.show();
      });
    });
  }

  formSeccion.addEventListener("submit", (e) => {
    e.preventDefault();
    ocultarErrorModal();

    const idEditando = seccionIdEdicion.value;
    const periodo = selectPeriodoSecciones.value;
    const codigoMateria = selectAsignaturaModal.value;
    const materiaObj = asignaturasDisponibles.find((a) => a.codigo === codigoMateria);
    const codigoSeccion = inputCodigoSeccion.value.trim();
    const docente = inputDocenteSeccion.value.trim();
    const modalidad = selectModalidadModal.value;
    const aula = inputAulaSeccion.value.trim();
    const horaInicio = parseInt(selectHoraInicio.value, 10);
    const horaFin = parseInt(selectHoraFin.value, 10);
    const cupoMaximo = parseInt(inputCupoSeccion.value, 10);

    const diasSeleccionados = Array.from(document.querySelectorAll(".check-dia-seccion:checked")).map(
      (chk) => chk.value
    );

    // Validaciones básicas
    if (!codigoSeccion || !docente || !aula || isNaN(cupoMaximo)) {
      mostrarErrorModal("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (diasSeleccionados.length === 0) {
      mostrarErrorModal("Selecciona al menos un día de clase.");
      return;
    }

    if (horaFin <= horaInicio) {
      mostrarErrorModal("La hora de finalización debe ser mayor que la hora de inicio.");
      return;
    }

    // Validar que el cupo no sea menor a los matriculados actuales al editar
    if (idEditando) {
      const actual = secciones.find((s) => s.id === idEditando);
      if (actual && cupoMaximo < actual.matriculados) {
        mostrarErrorModal(
          `El cupo máximo (${cupoMaximo}) no puede ser menor que los estudiantes ya matriculados (${actual.matriculados}).`
        );
        return;
      }
    }

    const otrasSeccionesPeriodo = secciones.filter(
      (s) => s.periodo === periodo && s.id !== idEditando && s.activa
    );

    // Regla 1: Código de sección único por asignatura en el período
    const codigoDuplicado = otrasSeccionesPeriodo.some(
      (s) => s.codigoMateria === codigoMateria && s.codigoSeccion.toLowerCase() === codigoSeccion.toLowerCase()
    );
    if (codigoDuplicado) {
      mostrarErrorModal(`Ya existe la sección ${codigoSeccion} para ${codigoMateria} en este período.`);
      return;
    }

    // Regla 2: Verificar choque de docente y de aula
    for (const s of otrasSeccionesPeriodo) {
      const compartenDia = s.dias.some((d) => diasSeleccionados.includes(d));
      const traslapeHoras = horaInicio < s.horaFin && horaFin > s.horaInicio;

      if (compartenDia && traslapeHoras) {
        if (s.docente.toLowerCase() === docente.toLowerCase()) {
          mostrarErrorModal(
            `Conflicto de docente: ${docente} ya imparte ${s.codigoMateria} (Sección ${s.codigoSeccion}) en ese horario.`
          );
          return;
        }
        if (modalidad === "Presencial" && s.modalidad === "Presencial" && s.aula.toLowerCase() === aula.toLowerCase()) {
          mostrarErrorModal(
            `Conflicto de aula: ${aula} ya está ocupada por ${s.codigoMateria} (Sección ${s.codigoSeccion}) en ese horario.`
          );
          return;
        }
      }
    }

    if (idEditando) {
      const idx = secciones.findIndex((s) => s.id === idEditando);
      if (idx !== -1) {
        secciones[idx] = {
          ...secciones[idx],
          codigoSeccion,
          docente,
          modalidad,
          aula,
          dias: diasSeleccionados,
          horaInicio,
          horaFin,
          cupoMaximo
        };
        mostrarAlertaGlobal(`Sección ${codigoSeccion} de ${codigoMateria} actualizada correctamente.`, "alert-success");
      }
    } else {
      secciones.unshift({
        id: "sec-" + Date.now(),
        periodo,
        codigoMateria,
        nombreMateria: materiaObj.nombre,
        uv: materiaObj.uv,
        codigoSeccion,
        docente,
        dias: diasSeleccionados,
        horaInicio,
        horaFin,
        aula,
        modalidad,
        cupoMaximo,
        matriculados: 0,
        activa: true
      });
      mostrarAlertaGlobal(`Sección ${codigoSeccion} de ${codigoMateria} creada y abierta para matrícula.`, "alert-success");
    }

    modalForm.hide();
    actualizarVista();
  });

  // =========================================================================
  // 4. CONFIRMAR ACTIVAR / DESACTIVAR SECCIÓN
  // =========================================================================
  btnConfirmarEstadoSec.addEventListener("click", () => {
    if (!seccionPendienteEstado) return;

    const idx = secciones.findIndex((s) => s.id === seccionPendienteEstado.id);
    if (idx !== -1) {
      secciones[idx].activa = !secciones[idx].activa;
      const textoEstado = secciones[idx].activa ? "activada" : "desactivada";
      mostrarAlertaGlobal(
        `La sección ${secciones[idx].codigoSeccion} de ${secciones[idx].codigoMateria} ha sido ${textoEstado}.`,
        "alert-success"
      );
    }

    seccionPendienteEstado = null;
    modalEstado.hide();
    actualizarVista();
  });

  // =========================================================================
  // 5. EVENTOS DE FILTROS Y ALERTAS
  // =========================================================================
  selectPeriodoSecciones.addEventListener("change", actualizarVista);
  inputBuscarSeccion.addEventListener("input", actualizarVista);
  filtroModalidadSeccion.addEventListener("change", actualizarVista);
  filtroEstadoSeccion.addEventListener("change", actualizarVista);

  function mostrarErrorModal(msg) {
    alertaModalSeccion.textContent = msg;
    alertaModalSeccion.classList.remove("d-none");
  }

  function ocultarErrorModal() {
    alertaModalSeccion.classList.add("d-none");
  }

  function mostrarAlertaGlobal(mensaje, claseBootstrap) {
    const alerta = document.getElementById("alertaSecciones");
    const texto = document.getElementById("textoAlertaSecciones");
    texto.textContent = mensaje;
    alerta.className = `alert ${claseBootstrap} alert-dismissible fade show py-2 small mb-4`;
  }

  // Inicializar
  poblarSelectoresModal();
  actualizarVista();
});