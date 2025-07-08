document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".subscription-form");
  const title = document.getElementById("form-title");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  const fields = {
    nombre: {
      element: form.nombre,
      errorElement: document.getElementById("error-nombre"),
      validate: value => {
        if (value.trim().length <= 6) return "El nombre debe tener más de 6 letras.";
        if (!value.trim().includes(" ")) return "El nombre debe contener al menos un espacio.";
        return "";
      }
    },
    email: {
      element: form.email,
      errorElement: document.getElementById("error-email"),
      validate: value => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "El email no tiene un formato válido.";
        return "";
      }
    },
    password: {
      element: form.password,
      errorElement: document.getElementById("error-password"),
      validate: value => {
        if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
        if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "La contraseña debe contener letras y números.";
        return "";
      }
    },
    password2: {
      element: form.password2,
      errorElement: document.getElementById("error-password2"),
      validate: value => {
        if (value !== form.password.value) return "Las contraseñas no coinciden.";
        return "";
      }
    },
    edad: {
      element: form.edad,
      errorElement: document.getElementById("error-edad"),
      validate: value => {
        const age = parseInt(value, 10);
        if (isNaN(age) || age < 18) return "La edad debe ser un número mayor o igual a 18.";
        return "";
      }
    },
    telefono: {
      element: form.telefono,
      errorElement: document.getElementById("error-telefono"),
      validate: value => {
        if (!/^\d{7,}$/.test(value.trim())) return "El teléfono debe tener al menos 7 dígitos y no contener espacios, guiones ni paréntesis.";
        return "";
      }
    },
    direccion: {
      element: form.direccion,
      errorElement: document.getElementById("error-direccion"),
      validate: value => {
        if (value.trim().length < 5) return "La dirección debe tener al menos 5 caracteres.";
        if (!/\w+\s+\w+/.test(value.trim())) return "La dirección debe contener letras, números y al menos un espacio.";
        return "";
      }
    },
    ciudad: {
      element: form.ciudad,
      errorElement: document.getElementById("error-ciudad"),
      validate: value => {
        if (value.trim().length < 3) return "La ciudad debe tener al menos 3 caracteres.";
        return "";
      }
    },
    "codigo-postal": {
      element: form["codigo-postal"],
      errorElement: document.getElementById("error-codigo-postal"),
      validate: value => {
        if (value.trim().length < 3) return "El código postal debe tener al menos 3 caracteres.";
        return "";
      }
    },
    dni: {
      element: form.dni,
      errorElement: document.getElementById("error-dni"),
      validate: value => {
        if (!/^\d{7,8}$/.test(value.trim())) return "El DNI debe tener 7 u 8 dígitos.";
        return "";
      }
    }
  };

  // Función para validar un campo individual
  function validateField(fieldKey) {
    const field = fields[fieldKey];
    const errorMsg = field.validate(field.element.value);
    if (errorMsg) {
      field.errorElement.textContent = errorMsg;
      return errorMsg;
    } else {
      field.errorElement.textContent = "";
      return "";
    }
  }

  // Eventos blur y focus para cada campo (validar y limpiar errores)
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    field.element.addEventListener("blur", () => validateField(key));
    field.element.addEventListener("focus", () => {
      field.errorElement.textContent = "";
    });
  });

  // Actualizar título en tiempo real con nombre
  form.nombre.addEventListener("keydown", () => {
    setTimeout(() => {
      const val = form.nombre.value.trim();
      title.textContent = val ? `HOLA ${val.toUpperCase()}` : "HOLA";
    }, 0);
  });
  form.nombre.addEventListener("focus", () => {
    const val = form.nombre.value.trim();
    title.textContent = val ? `HOLA ${val.toUpperCase()}` : "HOLA";
  });

  // Modal funciones
  function showModal(titulo, mensaje) {
    modalTitle.textContent = titulo;
    modalBody.textContent = mensaje;
    modal.style.display = "flex";
  }

  function hideModal() {
    modal.style.display = "none";
  }

  modalClose.addEventListener("click", hideModal);
  window.addEventListener("click", e => {
    if (e.target === modal) hideModal();
  });

  // Cargar datos guardados en localStorage y mostrarlos
  function cargarDatosGuardados() {
    const datosGuardados = localStorage.getItem("suscripcion");
    if (datosGuardados) {
      try {
        const data = JSON.parse(datosGuardados);
        showModal("Datos guardados en LocalStorage", JSON.stringify(data, null, 2));
      } catch (e) {
        console.warn("Error leyendo localStorage", e);
      }
    }
  }
  cargarDatosGuardados();

  // Envío del formulario con validación y fetch POST
  form.addEventListener("submit", async e => {
    e.preventDefault();

    let errores = [];

    Object.keys(fields).forEach(key => {
      const error = validateField(key);
      if (error) errores.push(`${key.toUpperCase()}: ${error}`);
    });

    if (errores.length > 0) {
      // Mostrar todos los errores en un alert y también se muestran debajo de cada campo
      alert("Errores en el formulario:\n" + errores.join("\n"));
      return;
    }

    // Preparar datos para enviar
    const formData = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value, // Nota: no enviar en producción sin seguridad
      edad: form.edad.value,
      telefono: form.telefono.value.trim(),
      direccion: form.direccion.value.trim(),
      ciudad: form.ciudad.value.trim(),
      codigoPostal: form["codigo-postal"].value.trim(),
      dni: form.dni.value.trim()
    };

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        showModal("Error al enviar", `Error: ${response.status} - ${response.statusText}\n${errorText}`);
        return;
      }

      const data = await response.json();

      showModal("Suscripción exitosa", JSON.stringify(data, null, 2));

      // Guardar datos en localStorage
      localStorage.setItem("suscripcion", JSON.stringify(data));

      // Limpiar formulario y título
      form.reset();
      title.textContent = "HOLA";
    } catch (error) {
      showModal("Error de red", `No se pudo completar la solicitud:\n${error.message}`);
    }
  });
});
