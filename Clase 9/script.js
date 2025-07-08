document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".subscription-form");
  const title = document.getElementById("form-title");

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

  // Evento blur: valida campo
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    field.element.addEventListener("blur", () => validateField(key));
  });

  // Evento focus: limpia mensaje error
  Object.keys(fields).forEach(key => {
    const field = fields[key];
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

  // Envío del formulario
  form.addEventListener("submit", e => {
    e.preventDefault();

    let errores = [];

    Object.keys(fields).forEach(key => {
      const error = validateField(key);
      if (error) errores.push(`${key.toUpperCase()}: ${error}`);
    });

    if (errores.length > 0) {
      alert("Errores en el formulario:\n" + errores.join("\n"));
    } else {
      // Armar resumen datos
      const data = Object.keys(fields)
        .map(key => {
          let val = fields[key].element.value.trim();
          // Para contraseña, no mostrar valor real, sino asteriscos
          if (key === "password" || key === "password2") val = "*".repeat(val.length);
          return `${key.toUpperCase()}: ${val}`;
        })
        .join("\n");
      alert("Datos enviados:\n" + data);
      form.reset();
      title.textContent = "HOLA";
    }
  });
});
