document.addEventListener("DOMContentLoaded", () => {
  const MAX_UV = 18;

  // Datos iniciales de demostración por si se abre forma-03.html directamente sin pasar antes por oferta-academica.html
  const matriculadasPorDefecto = [
    {
      codigoMateria: "IS-601",
      nombreMateria: "Ingeniería de software",
      uv: 4,
      idSec: "IS-601-0800",
      codigoSeccion: "0800",
      docente: "Ing. Carlos Alberto López",
      horarioTexto: "Lun · Jue 08:00–10:00",
      aula: "Aula 303",
      modalidad: "Presencial"
    },
    {
      codigoMateria: "IS-502",
      nombreMateria: "Bases de datos II",
      uv: 3,
      idSec: "IS-502-1000",
      codigoSeccion: "1000",
      docente: "Ing. Roberto Méndez",
      horarioTexto: "Lun · Mie 10:00–12:00",
      aula: "Laboratorio 3",
      modalidad: "Presencial"
    },
    {
      codigoMateria: "IS-603",
      nombreMateria: "Redes de Datos",
      uv: 3,
      idSec: "IS-603-1400",
      codigoSeccion: "1400",
      docente: "Ing. Laura Gómez",
      horarioTexto: "Lun · Mie 14:00–16:00",
      aula: "Laboratorio 2",
      modalidad: "Presencial"
    }
  ];

  const esperaPorDefecto = [
    {
      codigoMateria: "IS-701",
      nombreMateria: "Teoría de la Computación",
      uv: 3,
      idSec: "IS-701-0800",
      codigoSeccion: "0800",
      docente: "Dr. Héctor Zelaya",
      horarioTexto: "Mar · Jue 08:00–10:00",
      aula: "Aula 309",
      modalidad: "Presencial"
    }
  ];

  // Cargar datos desde sessionStorage si vienen de Oferta Académica
  const guardadasMatriculadas = sessionStorage.getItem("matriculaConfirmada");
  const guardadasEspera = sessionStorage.getItem("listaEsperaConfirmada");

  let clasesMatriculadas = guardadasMatriculadas ? JSON.parse(guardadasMatriculadas) : matriculadasPorDefecto;
  let clasesEnEspera = guardadasEspera ? JSON.parse(guardadasEspera) : esperaPorDefecto;

  // Estado de período habilitado por administrador
  let cancelacionHabilitada = true;
  let clasePendienteCancelar = null; // { tipo: 'matriculada' | 'espera', idSec: string }

  // Referencias DOM
  const tablaMatriculadasBody = document.getElementById("tablaMatriculadasBody");
  const tablaEsperaBody = document.getElementById("tablaEsperaBody");
  const badgeCountMatriculadas = document.getElementById("badgeCountMatriculadas");
  const badgeCountEspera = document.getElementById("badgeCountEspera");
  const resumenPieTabla = document.getElementById("resumenPieTabla");

  const kpiTotalClases = document.getElementById("kpiTotalClases");
  const kpiTotalUv = document.getElementById("kpiTotalUv");
  const kpiTotalEspera = document.getElementById("kpiTotalEspera");
  const kpiUvEspera = document.getElementById("kpiUvEspera");

  const switchPeriodoActivo = document.getElementById("switchPeriodoActivo");
  const badgeEstadoPeriodo = document.getElementById("badgeEstadoPeriodo");
  const textoEstadoPeriodo = document.getElementById("textoEstadoPeriodo");

  const modalCancelarEl = document.getElementById("modalConfirmarCancelacion");
  const modalCancelar = new bootstrap.Modal(modalCancelarEl);
  const btnConfirmarCancelarClase = document.getElementById("btnConfirmarCancelarClase");

  // Mostrar fecha actual en el comprobante
  const hoy = new Date();
  document.getElementById("fechaGeneracion").textContent =
    "Actualizado: " + hoy.toLocaleDateString("es-HN", { day: "2-digit", month: "short", year: "numeric" });

  // =========================================================================
  // 1. RENDERIZAR TABLAS E INDICADORES DE LA FORMA 03
  // =========================================================================
  function actualizarVista() {
    const uvMatriculadas = clasesMatriculadas.reduce((acc, c) => acc + c.uv, 0);
    const uvEspera = clasesEnEspera.reduce((acc, c) => acc + c.uv, 0);

    // Actualizar indicadores superiores
    kpiTotalClases.textContent = clasesMatriculadas.length;
    kpiTotalUv.textContent = `${clasesMatriculadas.length === 1 ? "asignatura" : "asignaturas"} · ${uvMatriculadas} de ${MAX_UV} UV`;

    kpiTotalEspera.textContent = clasesEnEspera.length;
    kpiUvEspera.textContent = `${clasesEnEspera.length === 1 ? "solicitud" : "solicitudes"} · ${uvEspera} UV reservadas`;

    badgeCountMatriculadas.textContent = `${clasesMatriculadas.length} ${clasesMatriculadas.length === 1 ? "asignatura" : "asignaturas"}`;
    badgeCountEspera.textContent = `${clasesEnEspera.length} en espera`;
    resumenPieTabla.textContent = `Total inscrito: ${uvMatriculadas} UV (Total con espera: ${uvMatriculadas + uvEspera} / ${MAX_UV} UV)`;

    // Renderizar Tabla 1: Asignaturas Matriculadas
    if (clasesMatriculadas.length === 0) {
      tablaMatriculadasBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center py-4 text-body-secondary small">
            No tienes asignaturas matriculadas actualmente. Ve a <a href="./oferta-academica.html" class="text-success fw-semibold">Oferta académica</a> para inscribir clases.
          </td>
        </tr>
      `;
    } else {
      tablaMatriculadasBody.innerHTML = clasesMatriculadas
        .map((clase) => {
          const botonCancelar = cancelacionHabilitada
            ? `<button type="button" class="btn btn-outline-danger btn-sm rounded-3 px-3 fw-semibold btn-solicitar-cancelar" data-tipo="matriculada" data-idsec="${clase.idSec}">
                 Cancelar
               </button>`
            : `<button type="button" class="btn btn-outline-secondary btn-sm rounded-3 px-3" disabled title="Período de cancelación cerrado por administración">
                 No disponible
               </button>`;

          return `
            <tr>
              <td class="fw-bold text-body small">${clase.codigoMateria}</td>
              <td>
                <div class="fw-semibold text-body small">${clase.nombreMateria}</div>
                <div class="text-body-secondary" style="font-size: 0.75rem;">${clase.docente}</div>
              </td>
              <td class="text-center small fw-semibold">${clase.codigoSeccion}</td>
              <td class="small">${clase.horarioTexto}</td>
              <td class="small text-body-secondary">${clase.aula}</td>
              <td class="text-center small fw-bold">${clase.uv}</td>
              <td class="small text-body-secondary">${clase.modalidad || "Presencial"}</td>
              <td class="text-center">
                <span class="badge bg-success-subtle text-success rounded-pill px-2 py-1">Matriculada</span>
              </td>
              <td class="text-end d-print-none">${botonCancelar}</td>
            </tr>
          `;
        })
        .join("");
    }

    // Renderizar Tabla 2: Asignaturas en Lista de Espera
    if (clasesEnEspera.length === 0) {
      tablaEsperaBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-4 text-body-secondary small">
            No tienes solicitudes en lista de espera.
          </td>
        </tr>
      `;
    } else {
      tablaEsperaBody.innerHTML = clasesEnEspera
        .map((clase) => {
          const botonCancelarEspera = cancelacionHabilitada
            ? `<button type="button" class="btn btn-outline-danger btn-sm rounded-3 px-3 fw-semibold btn-solicitar-cancelar" data-tipo="espera" data-idsec="${clase.idSec}">
                 Cancelar
               </button>`
            : `<button type="button" class="btn btn-outline-secondary btn-sm rounded-3 px-3" disabled>
                 No disponible
               </button>`;

          return `
            <tr>
              <td class="fw-bold text-body small">${clase.codigoMateria}</td>
              <td>
                <div class="fw-semibold text-body small">${clase.nombreMateria}</div>
                <div class="text-body-secondary" style="font-size: 0.75rem;">${clase.docente}</div>
              </td>
              <td class="text-center small fw-semibold">${clase.codigoSeccion}</td>
              <td class="small">${clase.horarioTexto}</td>
              <td class="small text-body-secondary">${clase.aula}</td>
              <td class="text-center small fw-bold">${clase.uv}</td>
              <td class="text-center">
                <span class="badge bg-warning-subtle text-warning-emphasis rounded-pill px-2 py-1">En espera</span>
              </td>
              <td class="text-end d-print-none">${botonCancelarEspera}</td>
            </tr>
          `;
        })
        .join("");
    }

    asignarEventosCancelar();
  }

  // =========================================================================
  // 2. MODAL DE CONFIRMACIÓN DE CANCELACIÓN
  // =========================================================================
  function asignarEventosCancelar() {
    document.querySelectorAll(".btn-solicitar-cancelar").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tipo = btn.dataset.tipo;
        const idSec = btn.dataset.idsec;
        const lista = tipo === "matriculada" ? clasesMatriculadas : clasesEnEspera;
        const clase = lista.find((c) => c.idSec === idSec);

        if (!clase) return;

        clasePendienteCancelar = { tipo, idSec };

        document.getElementById("mensajeModalCancelar").textContent =
          tipo === "matriculada"
            ? "¿Estás seguro de que deseas cancelar esta asignatura matriculada? Se liberará tu cupo en la sección."
            : "¿Deseas cancelar tu solicitud en lista de espera para esta sección?";

        document.getElementById("detalleClaseCancelar").innerHTML = `
          <div class="fw-bold text-body">${clase.codigoMateria} · ${clase.nombreMateria} (${clase.uv} UV)</div>
          <div class="text-body-secondary mt-1">Sección ${clase.codigoSeccion} · ${clase.docente} · ${clase.horarioTexto}</div>
        `;

        modalCancelar.show();
      });
    });
  }

  btnConfirmarCancelarClase.addEventListener("click", () => {
    if (!clasePendienteCancelar) return;

    const { tipo, idSec } = clasePendienteCancelar;

    if (tipo === "matriculada") {
      const eliminada = clasesMatriculadas.find((c) => c.idSec === idSec);
      clasesMatriculadas = clasesMatriculadas.filter((c) => c.idSec !== idSec);
      sessionStorage.setItem("matriculaConfirmada", JSON.stringify(clasesMatriculadas));
      mostrarAlerta(`Se canceló la asignatura ${eliminada.codigoMateria} (${eliminada.nombreMateria}) y se actualizó tu Forma 03.`, "alert-success");
    } else {
      const eliminada = clasesEnEspera.find((c) => c.idSec === idSec);
      clasesEnEspera = clasesEnEspera.filter((c) => c.idSec !== idSec);
      sessionStorage.setItem("listaEsperaConfirmada", JSON.stringify(clasesEnEspera));
      mostrarAlerta(`Se canceló tu solicitud en lista de espera para ${eliminada.codigoMateria} (${eliminada.nombreMateria}).`, "alert-success");
    }

    clasePendienteCancelar = null;
    modalCancelar.hide();
    actualizarVista();
  });

  // =========================================================================
  // 3. INTERRUPTOR DE PERÍODO HABILITADO / CERRADO E IMPRESIÓN
  // =========================================================================
  switchPeriodoActivo.addEventListener("change", () => {
    cancelacionHabilitada = switchPeriodoActivo.checked;

    if (cancelacionHabilitada) {
      badgeEstadoPeriodo.className = "badge bg-success-subtle text-success";
      badgeEstadoPeriodo.textContent = "Habilitado";
      textoEstadoPeriodo.textContent = "Período de matrícula activo";
    } else {
      badgeEstadoPeriodo.className = "badge bg-secondary-subtle text-secondary";
      badgeEstadoPeriodo.textContent = "Cerrado";
      textoEstadoPeriodo.textContent = "Cancelación deshabilitada por admin";
    }

    actualizarVista();
  });

  document.getElementById("btnImprimirForma03").addEventListener("click", () => {
    window.print();
  });

  function mostrarAlerta(mensaje, claseBootstrap) {
    const alerta = document.getElementById("alertaForma03");
    const texto = document.getElementById("textoAlertaForma03");
    texto.textContent = mensaje;
    alerta.className = `alert ${claseBootstrap} alert-dismissible fade show py-2 small mb-4 d-print-none`;
  }

  // Inicializar
  actualizarVista();
});