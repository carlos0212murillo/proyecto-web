/**
 * Aplica el tema guardado en localStorage antes de pintar la interfaz
 */
(function inicializarTema() {
  const temaGuardado = localStorage.getItem("temaSistema") || "light";
  document.documentElement.setAttribute("data-bs-theme", temaGuardado);
})();

/**
 * Renderiza la barra lateral y superior para el Portal del Estudiante
 */
function renderizarNavegacionEstudiante(seccionActiva = "inicio") {
  const menuItems = [
    { id: "inicio", label: "Inicio", icono: "bi-grid", ruta: "./panel-estudiante.html" },
    { id: "perfil", label: "Mi perfil", icono: "bi-person", ruta: "#" },
    { id: "registro", label: "Registro académico", icono: "bi-mortarboard", ruta: "#" },
    { id: "materias", label: "Mis materias", icono: "bi-book", ruta: "./forma-03.html" },
    { id: "matricula", label: "Matrícula", icono: "bi-clipboard-check", ruta: "./oferta-academica.html" },
    { id: "pagos", label: "Pagos y facturas", icono: "bi-wallet2", ruta: "#" },
    { id: "calendario", label: "Calendario", icono: "bi-calendar3", ruta: "#" },
    { id: "documentos", label: "Documentos", icono: "bi-file-earmark-text", ruta: "#" }
  ];

  construirLayoutNavegacion({
    etiquetaRol: "Portal del estudiante",
    nombreRolBreadcrumb: "Estudiante",
    nombreUsuario: "Estudiante",
    inicialUsuario: "E",
    rutaPerfil: "#",
    rutaLogout: "../../index.html",
    menuItems,
    seccionActiva
  });
}

/**
 * Renderiza la barra lateral y superior para el Portal Administrativo
 */
function renderizarNavegacionAdmin(seccionActiva = "panel-admin") {
  const menuItems = [
    { id: "panel-admin", label: "Resumen", icono: "bi-grid", ruta: "./panel-admin.html" },
    { id: "asignaturas", label: "Asignaturas", icono: "bi-journal-bookmark", ruta: "./asignaturas.html" },
    { id: "secciones", label: "Secciones", icono: "bi-mortarboard", ruta: "./secciones.html" },
    { id: "periodos", label: "Períodos", icono: "bi-calendar-range", ruta: "./periodos.html" },
    { id: "cupos", label: "Cupos", icono: "bi-clipboard-check", ruta: "./cupos.html" },
    { id: "reportes", label: "Reportes", icono: "bi-bar-chart-line", ruta: "./reportes.html" },
    { id: "usuarios", label: "Usuarios", icono: "bi-people", ruta: "./usuarios.html" }
  ];

  construirLayoutNavegacion({
    etiquetaRol: "Portal administrativo",
    nombreRolBreadcrumb: "Administrador",
    nombreUsuario: "Administrador",
    inicialUsuario: "A",
    rutaPerfil: "#",
    rutaLogout: "../../index.html",
    menuItems,
    seccionActiva
  });
}

/**
 * Constructor base compartido de Sidebar + Topbar + Modo Claro/Oscuro
 */
function construirLayoutNavegacion({
  etiquetaRol,
  nombreRolBreadcrumb,
  nombreUsuario,
  inicialUsuario,
  rutaPerfil,
  rutaLogout,
  menuItems,
  seccionActiva
}) {
  const sidebarContainer = document.getElementById("sidebarContainer");
  const topbarContainer = document.getElementById("topbarContainer");

  const generarEnlacesHTML = () =>
    menuItems
      .map((item) => {
        const activo = item.id === seccionActiva;
        const clases = activo
          ? "btn btn-success text-white fw-semibold shadow-sm"
          : "btn bg-body text-body border shadow-sm";

        return `
          <a href="${item.ruta}" class="${clases} d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-start w-100">
            <i class="bi ${item.icono} ${activo ? "text-white" : "text-body-secondary"}"></i>
            <span class="small">${item.label}</span>
          </a>
        `;
      })
      .join("");

  const contenidoSidebar = `
    <div class="d-flex flex-column h-100 p-3 bg-body border-end">
      <!-- Logo institucional -->
      <div class="d-flex align-items-center gap-3 px-2 py-3 mb-2">
        <div class="bg-success text-white rounded-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
          <i class="bi bi-mortarboard fs-5"></i>
        </div>
        <span class="fs-5 fw-bold text-body">UNAH</span>
      </div>

      <!-- Etiqueta de sección -->
      <div class="px-2 mb-2">
        <span class="text-uppercase text-body-secondary fw-bold" style="font-size: 0.7rem; letter-spacing: 0.05em;">
          ${etiquetaRol}
        </span>
      </div>

      <!-- Enlaces de navegación -->
      <nav class="d-flex flex-column gap-2 flex-grow-1">
        ${generarEnlacesHTML()}
      </nav>

      <!-- Cerrar sesión -->
      <div class="pt-3 mt-3 border-top">
        <a href="${rutaLogout}" class="btn btn-link text-body-secondary text-decoration-none d-flex align-items-center gap-2 px-2">
          <i class="bi bi-box-arrow-left"></i>
          <span class="small fw-semibold">Cerrar sesión</span>
        </a>
      </div>
    </div>
  `;

  if (sidebarContainer) {
    sidebarContainer.innerHTML = `
      <aside class="d-none d-lg-block flex-shrink-0" style="width: 260px;">
        <div class="sticky-top vh-100">
          ${contenidoSidebar}
        </div>
      </aside>

      <div class="offcanvas offcanvas-start" tabindex="-1" id="menuLateralMovil" aria-labelledby="tituloMenuMovil">
        <div class="offcanvas-header bg-body border-bottom py-2">
          <h5 class="offcanvas-title fw-bold small text-body" id="tituloMenuMovil">Menú Principal</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
        </div>
        <div class="offcanvas-body p-0">
          ${contenidoSidebar}
        </div>
      </div>
    `;
  }

  if (topbarContainer) {
    const itemActual = menuItems.find((i) => i.id === seccionActiva) || menuItems[0];
    const esOscuro = document.documentElement.getAttribute("data-bs-theme") === "dark";

    topbarContainer.innerHTML = `
      <header class="bg-body border-bottom px-3 px-md-4 py-2 sticky-top">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary btn-sm d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuLateralMovil" aria-controls="menuLateralMovil">
              <i class="bi bi-list fs-5"></i>
            </button>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0 small">
                <li class="breadcrumb-item text-body-secondary">${nombreRolBreadcrumb}</li>
                <li class="breadcrumb-item active fw-semibold text-body" aria-current="page">${itemActual.label}</li>
              </ol>
            </nav>
          </div>

          <div class="d-flex align-items-center gap-2 gap-sm-3">
            <button type="button" id="btnToggleTema" class="btn btn-link text-body-secondary p-1" aria-label="Cambiar tema" title="Cambiar tema claro/oscuro">
              <i id="iconoTema" class="bi ${esOscuro ? "bi-sun" : "bi-moon"} fs-5"></i>
            </button>

            <button type="button" class="btn btn-link text-body-secondary position-relative p-1" aria-label="Notificaciones">
              <i class="bi bi-bell fs-5"></i>
              <span class="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                <span class="visually-hidden">Nuevas notificaciones</span>
              </span>
            </button>

            <div class="dropdown">
              <button class="btn btn-link text-decoration-none text-body d-flex align-items-center gap-2 p-1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="badge rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style="width: 32px; height: 32px;">
                  ${inicialUsuario}
                </span>
                <span class="small fw-semibold d-none d-sm-inline">${nombreUsuario}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border rounded-3 small">
                <li><a class="dropdown-item" href="${rutaPerfil}"><i class="bi bi-person me-2"></i>Mi perfil</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="${rutaLogout}"><i class="bi bi-box-arrow-left me-2"></i>Cerrar sesión</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    `;

    const btnToggleTema = document.getElementById("btnToggleTema");
    const iconoTema = document.getElementById("iconoTema");

    if (btnToggleTema) {
      btnToggleTema.addEventListener("click", () => {
        const temaActual = document.documentElement.getAttribute("data-bs-theme");
        const nuevoTema = temaActual === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-bs-theme", nuevoTema);
        localStorage.setItem("temaSistema", nuevoTema);
        iconoTema.className = nuevoTema === "dark" ? "bi bi-sun fs-5" : "bi bi-moon fs-5";
      });
    }
  }
}