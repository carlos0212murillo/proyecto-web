document.addEventListener("DOMContentLoaded", () => {
  // Catálogo inicial simulado (alineado con colección subjects de MongoDB)
  const asignaturasIniciales = [
    {
      id: "sub-1",
      codigo: "IS-601",
      nombre: "Ingeniería de software",
      uv: 4,
      carrera: "Ingeniería en Sistemas",
      prerrequisitos: ["IS-501"],
      descripcion: "Metodologías ágiles, ciclo de vida del software y arquitectura de sistemas.",
      activa: true,
      tieneMatriculas: true
    },
    {
      id: "sub-2",
      codigo: "IS-502",
      nombre: "Bases de datos II",
      uv: 3,
      carrera: "Ingeniería en Sistemas",
      prerrequisitos: ["IS-501"],
      descripcion: "Optimización de consultas, transacciones, replicación y bases NoSQL.",
      activa: true,
      tieneMatriculas: true
    },
    {
      id: "sub-3",
      codigo: "IS-603",
      nombre: "Redes de Datos",
      uv: 3,
      carrera: "Ingeniería en Sistemas",
      prerrequisitos: ["IS-402"],
      descripcion: "Protocolos TCP/IP, enrutamiento, conmutación y seguridad perimetral.",
      activa: true,
      tieneMatriculas: true
    },
    {
      id: "sub-4",
      codigo: "IS-701",
      nombre: "Teoría de la Computación",
      uv: 3,
      carrera: "Ingeniería en Sistemas",
      prerrequisitos: ["MM-420"],
      descripcion: "Autómatas finitos, lenguajes formales y máquinas de Turing.",
      activa: true,
      tieneMatriculas: true
    },
    {
      id: "sub-5",
      codigo: "IS-602",
      nombre: "Programación Web",
      uv: 3,
      carrera: "Ingeniería en Sistemas",
      prerrequisitos: ["IS-410"],
      descripcion: "Desarrollo full stack con HTML5, Bootstrap, JavaScript, Node.js y MongoDB.",
      activa: true,
      tieneMatriculas: true
    },
    {
      id: "sub-6",
      codigo: "MM-420",
      nombre: "Matemática Discreta",
      uv: 4,
      carrera: "Ciencias Matemáticas",
      prerrequisitos: ["MM-201"],
      descripcion: "Lógica proposicional, teoría de grafos, combinatoria y relaciones.",
      activa: true,
      tieneMatriculas: false
    },
    {
      id: "sub-7",
      codigo: "IS-210",
      nombre: "Electiva Técnica I (Plan Anterior)",
      uv: 3,
      carrera: "Ingeniería en Sistemas",
      prerrequisitos: [],
      descripcion: "Asignatura desactivada por actualización curricular.",
      activa: false,
      tieneMatriculas: true
    }
  ];

  let asignaturas = JSON.parse(sessionStorage.getItem("catalogoAdminAsignaturas")) || asignaturasIniciales;
  let asignaturaPendienteEstado = null;

  // Referencias DOM
  const tablaAsignaturasBody = document.getElementById("tablaAsignaturasBody");
  const contadorResultadosAsignaturas = document.getElementById("contadorResultadosAsignaturas");
  const inputBuscarAsignatura = document.getElementById("inputBuscarAsignatura");
  const filtroCarreraAsignatura = document.getElementById("filtroCarreraAsignatura");
  const filtroEstadoAsignatura = document.getElementById("filtroEstadoAsignatura");

  const kpiTotalCatalogo = document.getElementById("kpiTotalCatalogo");
  const kpiActivasCatalogo = document.getElementById("kpiActivasCatalogo");
  const kpiInactivasCatalogo = document.getElementById("kpiInactivasCatalogo");

  // Modales y formulario
  const modalFormEl = document.getElementById("modalFormAsignatura");
  const modalForm = new bootstrap.Modal(modalFormEl);
  const formAsignatura = document.getElementById("formAsignatura");
  const tituloModalAsignatura = document.getElementById("tituloModalAsignatura");
  const asignaturaIdEdicion = document.getElementById("asignaturaIdEdicion");
  const inputCodigoAsignatura = document.getElementById("inputCodigoAsignatura");
  const inputNombreAsignatura = document.getElementById("inputNombreAsignatura");
  const inputUvAsignatura = document.getElementById("inputUvAsignatura");
  const selectCarreraModal = document.getElementById("selectCarreraModal");
  const inputPrerrequisitos = document.getElementById("inputPrerrequisitos");
  const inputDescripcionAsignatura = document.getElementById("inputDescripcionAsignatura");

  const modalEstadoEl = document.getElementById("modalConfirmarEstado");
  const modalEstado = new bootstrap.Modal(modalEstadoEl);
  const btnConfirmarCambioEstado = document.getElementById("btnConfirmarCambioEstado");

  // =========================================================================
  // 1. RENDERIZADO DE KPIs Y TABLA
  // =========================================================================
  function guardarYRenderizar() {
    sessionStorage.setItem("catalogoAdminAsignaturas", JSON.stringify(asignaturas));
    actualizarVista();
  }

  function actualizarVista() {
    const activas = asignaturas.filter((a) => a.activa).length;
    const inactivas = asignaturas.length - activas;

    kpiTotalCatalogo.textContent = asignaturas.length;
    kpiActivasCatalogo.textContent = activas;
    kpiInactivasCatalogo.textContent = inactivas;

    const texto = inputBuscarAsignatura.value.trim().toLowerCase();
    const carrera = filtroCarreraAsignatura.value;
    const estado = filtroEstadoAsignatura.value;

    const filtradas = asignaturas.filter((item) => {
      const coincideTexto =
        !texto ||
        item.codigo.toLowerCase().includes(texto) ||
        item.nombre.toLowerCase().includes(texto);
      const coincideCarrera = carrera === "Todas" || item.carrera === carrera;
      const estadoItem = item.activa ? "Activa" : "Inactiva";
      const coincideEstado = estado === "todos" || estadoItem === estado;

      return coincideTexto && coincideCarrera && coincideEstado;
    });

    contadorResultadosAsignaturas.textContent = `${filtradas.length} ${filtradas.length === 1 ? "registro" : "registros"}`;

    if (filtradas.length === 0) {
      tablaAsignaturasBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-4 text-body-secondary small">
            No se encontraron asignaturas con los filtros seleccionados.
          </td>
        </tr>
      `;
      return;
    }

    tablaAsignaturasBody.innerHTML = filtradas
      .map((item) => {
        const badgeEstado = item.activa
          ? `<span class="badge bg-success-subtle text-success rounded-pill px-2 py-1">Activa</span>`
          : `<span class="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1">Inactiva</span>`;

        const textoPrerrequisitos =
          item.prerrequisitos && item.prerrequisitos.length > 0
            ? item.prerrequisitos.map((p) => `<span class="badge bg-body-secondary text-body me-1">${p}</span>`).join("")
            : `<span class="text-body-secondary small">Ninguno</span>`;

        const iconoEstado = item.activa ? "bi-slash-circle" : "bi-check-circle";
        const tituloEstado = item.activa ? "Desactivar asignatura" : "Activar asignatura";
        const colorBtnEstado = item.activa ? "btn-outline-danger" : "btn-outline-success";

        return `
          <tr class="${item.activa ? "" : "opacity-75"}">
            <td class="fw-bold text-body small">${item.codigo}</td>
            <td>
              <div class="fw-semibold text-body small">${item.nombre}</div>
              <div class="text-body-secondary text-truncate" style="font-size: 0.75rem; max-width: 280px;">
                ${item.descripcion || "Sin descripción registrada"}
              </div>
            </td>
            <td class="text-center small fw-semibold">${item.uv}</td>
            <td class="small text-body-secondary">${item.carrera}</td>
            <td>${textoPrerrequisitos}</td>
            <td class="text-center">${badgeEstado}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-outline-secondary btn-editar-asignatura" data-id="${item.id}" title="Editar asignatura">
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn ${colorBtnEstado} btn-estado-asignatura" data-id="${item.id}" title="${tituloEstado}">
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
  // 2. CREAR Y EDITAR ASIGNATURA (MODAL)
  // =========================================================================
  document.getElementById("btnAbrirNuevaAsignatura").addEventListener("click", () => {
    formAsignatura.reset();
    formAsignatura.classList.remove("was-validated");
    asignaturaIdEdicion.value = "";
    inputCodigoAsignatura.disabled = false;
    tituloModalAsignatura.textContent = "Nueva asignatura";
    modalForm.show();
  });

  function asignarEventosTabla() {
    document.querySelectorAll(".btn-editar-asignatura").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = asignaturas.find((a) => a.id === btn.dataset.id);
        if (!item) return;

        formAsignatura.classList.remove("was-validated");
        asignaturaIdEdicion.value = item.id;
        inputCodigoAsignatura.value = item.codigo;
        inputNombreAsignatura.value = item.nombre;
        inputUvAsignatura.value = item.uv;
        selectCarreraModal.value = item.carrera;
        inputPrerrequisitos.value = item.prerrequisitos.join(", ");
        inputDescripcionAsignatura.value = item.descripcion || "";

        tituloModalAsignatura.textContent = `Editar asignatura · ${item.codigo}`;
        modalForm.show();
      });
    });

    document.querySelectorAll(".btn-estado-asignatura").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = asignaturas.find((a) => a.id === btn.dataset.id);
        if (!item) return;

        asignaturaPendienteEstado = item;
        const accion = item.activa ? "desactivar" : "activar";

        document.getElementById("tituloModalEstado").textContent =
          item.activa ? "Desactivar asignatura" : "Activar asignatura";

        document.getElementById("mensajeModalEstado").textContent = item.activa
          ? "Por integridad académica, las asignaturas no se eliminan físicamente. Al desactivar esta materia dejará de aparecer en la oferta de matrícula."
          : "¿Deseas volver a habilitar esta asignatura para que pueda ofertarse en el período?";

        document.getElementById("detalleAsignaturaEstado").innerHTML = `
          <div class="fw-bold text-body">${item.codigo} · ${item.nombre} (${item.uv} UV)</div>
          <div class="text-body-secondary mt-1">Carrera: ${item.carrera}</div>
        `;

        btnConfirmarCambioEstado.className = item.activa
          ? "btn btn-danger btn-sm rounded-3 px-3 fw-semibold"
          : "btn btn-success btn-sm rounded-3 px-3 fw-semibold";
        btnConfirmarCambioEstado.textContent = `Sí, ${accion}`;

        modalEstado.show();
      });
    });
  }

  formAsignatura.addEventListener("submit", (e) => {
    e.preventDefault();

    const codigo = inputCodigoAsignatura.value.trim().toUpperCase();
    const nombre = inputNombreAsignatura.value.trim();
    const uv = parseInt(inputUvAsignatura.value, 10);
    const carrera = selectCarreraModal.value;
    const descripcion = inputDescripcionAsignatura.value.trim();
    const prerrequisitos = inputPrerrequisitos.value
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    if (!codigo || !nombre || isNaN(uv) || uv < 1 || uv > 8) {
      formAsignatura.classList.add("was-validated");
      return;
    }

    const idEditando = asignaturaIdEdicion.value;

    // Validar código único
    const codigoDuplicado = asignaturas.some(
      (a) => a.codigo === codigo && a.id !== idEditando
    );
    if (codigoDuplicado) {
      mostrarAlerta(`Ya existe una asignatura registrada con el código ${codigo}.`, "alert-danger");
      modalForm.hide();
      return;
    }

    if (idEditando) {
      const idx = asignaturas.findIndex((a) => a.id === idEditando);
      if (idx !== -1) {
        asignaturas[idx] = {
          ...asignaturas[idx],
          codigo,
          nombre,
          uv,
          carrera,
          prerrequisitos,
          descripcion
        };
        mostrarAlerta(`La asignatura ${codigo} (${nombre}) se actualizó correctamente.`, "alert-success");
      }
    } else {
      asignaturas.unshift({
        id: "sub-" + Date.now(),
        codigo,
        nombre,
        uv,
        carrera,
        prerrequisitos,
        descripcion,
        activa: true,
        tieneMatriculas: false
      });
      mostrarAlerta(`La asignatura ${codigo} (${nombre}) fue creada y activada en el catálogo.`, "alert-success");
    }

    modalForm.hide();
    guardarYRenderizar();
  });

  // =========================================================================
  // 3. CONFIRMAR ACTIVAR / DESACTIVAR
  // =========================================================================
  btnConfirmarCambioEstado.addEventListener("click", () => {
    if (!asignaturaPendienteEstado) return;

    const idx = asignaturas.findIndex((a) => a.id === asignaturaPendienteEstado.id);
    if (idx !== -1) {
      asignaturas[idx].activa = !asignaturas[idx].activa;
      const estadoTexto = asignaturas[idx].activa ? "activada" : "desactivada";
      mostrarAlerta(
        `La asignatura ${asignaturas[idx].codigo} (${asignaturas[idx].nombre}) ha sido ${estadoTexto}.`,
        "alert-success"
      );
    }

    asignaturaPendienteEstado = null;
    modalEstado.hide();
    guardarYRenderizar();
  });

  // =========================================================================
  // 4. EVENTOS DE FILTROS Y ALERTAS
  // =========================================================================
  inputBuscarAsignatura.addEventListener("input", actualizarVista);
  filtroCarreraAsignatura.addEventListener("change", actualizarVista);
  filtroEstadoAsignatura.addEventListener("change", actualizarVista);

  function mostrarAlerta(mensaje, claseBootstrap) {
    const alerta = document.getElementById("alertaAsignaturas");
    const texto = document.getElementById("textoAlertaAsignaturas");
    texto.textContent = mensaje;
    alerta.className = `alert ${claseBootstrap} alert-dismissible fade show py-2 small mb-4`;
  }

  // Inicializar
  actualizarVista();
});