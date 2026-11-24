// Aplicar el tema guardado antes de renderizar la vista
(function inicializarTemaAuth() {
  const temaGuardado = localStorage.getItem("temaSistema") || "light";
  document.documentElement.setAttribute("data-bs-theme", temaGuardado);
})();

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 0. INTERRUPTOR DE TEMA CLARO / OSCURO (index.html y registro.html)
  // =========================================================================
  const botonesTema = document.querySelectorAll(".btn-toggle-tema");

  function actualizarIconosTema(tema) {
    document.querySelectorAll(".icono-tema").forEach((icono) => {
      icono.className = tema === "dark" ? "bi bi-sun icono-tema" : "bi bi-moon icono-tema";
    });
  }

  actualizarIconosTema(document.documentElement.getAttribute("data-bs-theme"));

  botonesTema.forEach((boton) => {
    boton.addEventListener("click", () => {
      const temaActual = document.documentElement.getAttribute("data-bs-theme");
      const nuevoTema = temaActual === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-bs-theme", nuevoTema);
      localStorage.setItem("temaSistema", nuevoTema);
      actualizarIconosTema(nuevoTema);
    });
  });

  // =========================================================================
  // 1. FUNCIONALIDAD COMPARTIDA: MOSTRAR / OCULTAR CONTRASEÑA
  // =========================================================================
  const btnToggleLogin = document.getElementById("btnTogglePassword");
  const inputPasswordLogin = document.getElementById("passwordUsuario");
  const iconoOjoLogin = document.getElementById("iconoOjo");

  if (btnToggleLogin && inputPasswordLogin) {
    btnToggleLogin.addEventListener("click", () => {
      const esPassword = inputPasswordLogin.type === "password";
      inputPasswordLogin.type = esPassword ? "text" : "password";
      iconoOjoLogin.className = esPassword ? "bi bi-eye-slash" : "bi bi-eye";
    });
  }

  const botonesToggle = document.querySelectorAll(".toggle-password");
  botonesToggle.forEach((boton) => {
    boton.addEventListener("click", () => {
      const inputObjetivo = document.getElementById(boton.dataset.target);
      const icono = boton.querySelector("i");
      if (!inputObjetivo) return;

      const esPassword = inputObjetivo.type === "password";
      inputObjetivo.type = esPassword ? "text" : "password";
      icono.className = esPassword ? "bi bi-eye-slash" : "bi bi-eye";
    });
  });

  // =========================================================================
  // 2. LÓGICA DE INICIO DE SESIÓN (index.html)
  // =========================================================================
  const tarjetasRol = document.querySelectorAll(".card-rol");
  const inputRol = document.getElementById("rolSeleccionado");
  const labelIdentificador = document.getElementById("labelIdentificador");
  const iconoIdentificador = document.getElementById("iconoIdentificador");
  const inputIdentificador = document.getElementById("identificadorUsuario");
  const textoBtnLogin = document.getElementById("textoBtnLogin");
  const contenedorCrearCuenta = document.getElementById("contenedorCrearCuenta");
  const formLogin = document.getElementById("formLogin");
  const alertaLogin = document.getElementById("alertaLogin");

  function seleccionarRol(rol) {
    if (!inputRol) return;
    inputRol.value = rol;

    tarjetasRol.forEach((tarjeta) => {
      const esSeleccionada = tarjeta.dataset.rol === rol;
      const iconoRol = tarjeta.querySelector("i:first-child");
      const iconoCheck = tarjeta.querySelector(".icono-check");

      tarjeta.setAttribute("aria-pressed", esSeleccionada);

      if (esSeleccionada) {
        tarjeta.className = "card border-2 border-success bg-body text-success rounded-3 p-3 h-100 shadow-sm card-rol";
        iconoRol.classList.remove("text-body-secondary");
        iconoCheck.className = "bi bi-check-circle-fill icono-check";
      } else {
        tarjeta.className = "card border bg-body text-body rounded-3 p-3 h-100 card-rol";
        iconoRol.classList.add("text-body-secondary");
        iconoCheck.className = "bi bi-circle text-body-secondary icono-check";
      }
    });

    if (rol === "admin") {
      labelIdentificador.textContent = "Número de empleado";
      inputIdentificador.placeholder = "Número empleado";
      iconoIdentificador.className = "bi bi-person-gear";
      textoBtnLogin.textContent = "Ingresar como administrador";
      if (contenedorCrearCuenta) contenedorCrearCuenta.classList.add("d-none");
    } else {
      labelIdentificador.textContent = "Número de Cuenta";
      inputIdentificador.placeholder = "Número de cuenta de estudiante";
      iconoIdentificador.className = "bi bi-person-badge";
      textoBtnLogin.textContent = "Ingresar como estudiante";
      if (contenedorCrearCuenta) contenedorCrearCuenta.classList.remove("d-none");
    }

    ocultarAlerta(alertaLogin);
  }

  tarjetasRol.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => seleccionarRol(tarjeta.dataset.rol));
    tarjeta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        seleccionarRol(tarjeta.dataset.rol);
      }
    });
  });

  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      ocultarAlerta(alertaLogin);

      const identificador = inputIdentificador.value.trim();
      const password = inputPasswordLogin.value.trim();
      const rol = inputRol.value;

      if (!identificador || !password) {
        mostrarAlerta(alertaLogin, "Por favor completa todos los campos antes de continuar.", "alert-danger");
        return;
      }

      if (rol === "admin") {
        window.location.href = "./pages/admin/panel-admin.html";
      } else {
        window.location.href = "./pages/estudiante/panel-estudiante.html";
      }
    });
  }

  // Modal recuperar contraseña (index.html)
  const formRecuperar = document.getElementById("formRecuperar");
  const alertaRecuperar = document.getElementById("alertaRecuperar");

  if (formRecuperar) {
    formRecuperar.addEventListener("submit", (e) => {
      e.preventDefault();
      const correo = document.getElementById("correoRecuperacion").value.trim();

      if (!correo) {
        mostrarAlerta(alertaRecuperar, "Ingresa un correo válido.", "alert-danger");
        return;
      }

      mostrarAlerta(alertaRecuperar, `Se envió un enlace de recuperación a ${correo}.`, "alert-success");
      formRecuperar.reset();
    });
  }

  // =========================================================================
  // 3. LÓGICA DE REGISTRO DE ESTUDIANTE (pages/registro.html)
  // =========================================================================
  const formRegistro = document.getElementById("formRegistro");
  const alertaRegistro = document.getElementById("alertaRegistro");

  if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
      e.preventDefault();
      ocultarAlerta(alertaRegistro);

      const nombres = document.getElementById("nombres").value.trim();
      const apellidos = document.getElementById("apellidos").value.trim();
      const identidad = document.getElementById("identidad").value.trim();
      const fechaNacimiento = document.getElementById("fechaNacimiento").value;
      const correo = document.getElementById("correo").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const direccion = document.getElementById("direccion").value.trim();
      const carrera = document.getElementById("carrera").value;
      const centro = document.getElementById("centro").value;
      const password = document.getElementById("passwordRegistro").value;
      const confirmarPassword = document.getElementById("confirmarPassword").value;

      if (
        !nombres || !apellidos || !identidad || !fechaNacimiento ||
        !correo || !telefono || !direccion || !carrera || !centro ||
        !password || !confirmarPassword
      ) {
        mostrarAlerta(alertaRegistro, "Todos los campos marcados con * son obligatorios.", "alert-danger");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(correo)) {
        mostrarAlerta(alertaRegistro, "Por favor ingresa un correo electrónico válido.", "alert-danger");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (password.length < 6) {
        mostrarAlerta(alertaRegistro, "La contraseña debe tener al menos 6 caracteres.", "alert-danger");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (password !== confirmarPassword) {
        mostrarAlerta(alertaRegistro, "Las contraseñas no coinciden. Verifica e intenta de nuevo.", "alert-danger");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      mostrarAlerta(
        alertaRegistro,
        "¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...",
        "alert-success"
      );
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1600);
    });
  }

  // =========================================================================
  // FUNCIONES AUXILIARES DE ALERTAS
  // =========================================================================
  function mostrarAlerta(elemento, mensaje, claseBootstrap) {
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.className = `alert ${claseBootstrap} py-2 small`;
  }

  function ocultarAlerta(elemento) {
    if (!elemento) return;
    elemento.classList.add("d-none");
  }
});