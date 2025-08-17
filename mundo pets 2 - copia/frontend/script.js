// Usuarios de prueba hardcodeados (temporal)
const USUARIOS_PRUEBA = [
  {
    username: "admin",
    email: "admin@test.com",
    password: "123456"
  },
  {
    username: "usuario1",
    email: "usuario1@test.com",
    password: "123456"
  },
  {
    username: "test",
    email: "test@test.com",
    password: "123456"
  }
];

// Base de datos de productos
const PRODUCTOS = {
  alimentos: [
    { id: 1, nombre: "Croquetas Premium", precio: 45000, descripcion: "Alimento balanceado para perros adultos", imagen: "alimento.jpg", categoria: "Alimentos" },
    { id: 2, nombre: "Comida Húmeda Gatos", precio: 15000, descripcion: "Pate de salmón para gatos", imagen: "alimento.jpg", categoria: "Alimentos" },
    { id: 3, nombre: "Snacks Caninos", precio: 8000, descripcion: "Galletas de entrenamiento", imagen: "alimento.jpg", categoria: "Alimentos" },
    { id: 4, nombre: "Vitaminas Mascotas", precio: 25000, descripcion: "Suplemento vitamínico completo", imagen: "alimento.jpg", categoria: "Alimentos" }
  ],
  medicamentos: [
    { id: 5, nombre: "Antiparasitario", precio: 35000, descripcion: "Desparasitante interno y externo", imagen: "medicamento.jpg", categoria: "Medicamentos" },
    { id: 6, nombre: "Antiinflamatorio", precio: 28000, descripcion: "Para dolores articulares", imagen: "medicamento.jpg", categoria: "Medicamentos" },
    { id: 7, nombre: "Antibiótico", precio: 42000, descripcion: "Tratamiento infecciones", imagen: "medicamento.jpg", categoria: "Medicamentos" },
    { id: 8, nombre: "Vacuna Triple", precio: 55000, descripcion: "Vacuna polivalente", imagen: "medicamento.jpg", categoria: "Medicamentos" }
  ],
  peluqueria: [
    { id: 9, nombre: "Baño y Corte", precio: 35000, descripcion: "Servicio completo de peluquería", imagen: "peluqueria.jpg", categoria: "Peluquería" },
    { id: 10, nombre: "Corte de Uñas", precio: 15000, descripcion: "Corte y limpieza de uñas", imagen: "peluqueria.jpg", categoria: "Peluquería" },
    { id: 11, nombre: "Limpieza de Oídos", precio: 12000, descripcion: "Limpieza profunda de oídos", imagen: "peluqueria.jpg", categoria: "Peluquería" },
    { id: 12, nombre: "Tratamiento Capilar", precio: 45000, descripcion: "Hidratación y brillo", imagen: "peluqueria.jpg", categoria: "Peluquería" }
  ],
  guarderia: [
    { id: 13, nombre: "Guardería Día", precio: 25000, descripcion: "Cuidado por día completo", imagen: "guarderia.jpg", categoria: "Guardería" },
    { id: 14, nombre: "Guardería Noche", precio: 35000, descripcion: "Cuidado nocturno", imagen: "guarderia.jpg", categoria: "Guardería" },
    { id: 15, nombre: "Paseo Grupal", precio: 15000, descripcion: "Paseo de 1 hora en grupo", imagen: "guarderia.jpg", categoria: "Guardería" },
    { id: 16, nombre: "Entrenamiento", precio: 50000, descripcion: "Sesión de entrenamiento básico", imagen: "guarderia.jpg", categoria: "Guardería" }
  ]
};

// Carrito de compras
let carrito = [];
let metodoPagoSeleccionado = null;

// Verificar si el usuario está autenticado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Si estamos en dashboard.html, verificar autenticación
  if (window.location.pathname.includes('dashboard.html')) {
    checkAuth();
    actualizarContadorCarrito();
  }
});

// Verificar autenticación
function checkAuth() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Acceso denegado',
      text: 'Debes iniciar sesión para acceder a esta página',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      window.location.href = 'login.html';
    });
  }
}

// Función de login sin backend
function login() {
  const identifier = document.getElementById('identifier').value;
  const password = document.getElementById('password').value;

  // Validaciones del frontend
  if (!identifier || !password) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Usuario/Email y contraseña son requeridos',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  // Buscar usuario en la lista de prueba
  const user = USUARIOS_PRUEBA.find(u => 
    (u.username === identifier || u.email === identifier) && 
    u.password === password
  );

  if (user) {
    // Login exitoso
    const token = 'token_' + Date.now(); // Token temporal
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', user.username);
    
    Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: `Inicio de sesión exitoso como ${user.username}`,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Continuar'
    }).then(() => {
      window.location.href = 'dashboard.html';
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: 'Usuario/Email o contraseña incorrectos',
      confirmButtonColor: '#3085d6'
    });
  }
}

// Función de registro sin backend
function register() {
  const username = document.getElementById('newUsername').value;
  const email = document.getElementById('newEmail').value;
  const password = document.getElementById('newPassword').value;

  // Validaciones del frontend
  if (!username || !email || !password) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Todos los campos son requeridos',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Formato de email inválido',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  // Verificar si el usuario ya existe
  const existingUser = USUARIOS_PRUEBA.find(u => u.username === username);
  if (existingUser) {
    Swal.fire({
      icon: 'error',
      title: 'Error en el registro',
      text: 'El nombre de usuario ya existe',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  // Verificar si el email ya existe
  const existingEmail = USUARIOS_PRUEBA.find(u => u.email === email);
  if (existingEmail) {
    Swal.fire({
      icon: 'error',
      title: 'Error en el registro',
      text: 'El email ya está registrado',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  // Agregar nuevo usuario a la lista de prueba
  USUARIOS_PRUEBA.push({ username, email, password });

  Swal.fire({
    icon: 'success',
    title: '¡Registro exitoso!',
    text: 'Tu cuenta ha sido creada correctamente',
    confirmButtonColor: '#28a745',
    confirmButtonText: 'Continuar'
  }).then(() => {
    window.location.href = 'login.html';
  });
}

function logout() {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro de que quieres salir?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Limpiar datos de autenticación
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      
      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión exitosamente',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Continuar'
      }).then(() => {
        window.location.href = 'index.html';
      });
    }
  });
}

// Funciones del catálogo
function showProducts(categoria) {
  const modal = new bootstrap.Modal(document.getElementById('productsModal'));
  const modalTitle = document.getElementById('modalTitle');
  const productsContainer = document.getElementById('productsContainer');
  
  // Obtener productos de la categoría
  const productos = PRODUCTOS[categoria];
  
  // Configurar título
  modalTitle.innerHTML = `<i class="fas fa-boxes me-2"></i>Productos de ${productos[0].categoria}`;
  
  // Generar HTML de productos
  let productosHTML = '';
  productos.forEach(producto => {
    productosHTML += `
      <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="card product-card h-100 shadow-hover">
          <div class="card-body text-center p-4">
            <div class="product-icon mb-3">
              <i class="fas fa-box fa-3x text-primary"></i>
            </div>
            <h3 class="card-title h5 text-primary">${producto.nombre}</h3>
            <p class="card-text text-muted small">${producto.descripcion}</p>
            <div class="product-price mb-3">
              <span class="h4 fw-bold text-success">$${producto.precio.toLocaleString()}</span>
            </div>
            <button onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})" class="btn btn-success w-100">
              <i class="fas fa-cart-plus me-2"></i>Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  productsContainer.innerHTML = productosHTML;
  modal.show();
}

function closeModal() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('productsModal'));
  if (modal) modal.hide();
}

// Funciones del carrito
function agregarAlCarrito(id, nombre, precio) {
  const itemExistente = carrito.find(item => item.id === id);
  
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }
  
  actualizarContadorCarrito();
  
  Swal.fire({
    icon: 'success',
    title: 'Producto agregado',
    text: `${nombre} se agregó al carrito`,
    confirmButtonColor: '#28a745',
    timer: 1500,
    showConfirmButton: false
  });
}

function actualizarContadorCarrito() {
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  document.getElementById('cart-count').textContent = totalItems;
}

function showCart() {
  const modal = new bootstrap.Modal(document.getElementById('cartModal'));
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (carrito.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
        <p class="text-muted">Tu carrito está vacío</p>
      </div>
    `;
    cartTotal.textContent = '0';
  } else {
    let itemsHTML = '';
    let total = 0;
    
    carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      
      itemsHTML += `
        <div class="card mb-3">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-4">
                <h5 class="card-title mb-1">${item.nombre}</h5>
                <p class="text-muted mb-0">$${item.precio.toLocaleString()} x ${item.cantidad}</p>
              </div>
              <div class="col-md-4 text-center">
                <div class="btn-group" role="group">
                  <button onclick="cambiarCantidad(${item.id}, -1)" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="btn btn-outline-secondary btn-sm disabled">${item.cantidad}</span>
                  <button onclick="cambiarCantidad(${item.id}, 1)" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-2 text-center">
                <span class="h6 text-success">$${subtotal.toLocaleString()}</span>
              </div>
              <div class="col-md-2 text-center">
                <button onclick="eliminarDelCarrito(${item.id})" class="btn btn-outline-danger btn-sm">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = total.toLocaleString();
  }
  
  modal.show();
}

function closeCartModal() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
  if (modal) modal.hide();
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(item => item.id === id);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      eliminarDelCarrito(id);
    } else {
      actualizarContadorCarrito();
      showCart(); // Recargar vista del carrito
    }
  }
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarContadorCarrito();
  showCart(); // Recargar vista del carrito
}

// Funciones de checkout
function checkout() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'Agrega productos antes de proceder al pago',
      confirmButtonColor: '#3085d6'
    });
    return;
  }
  
  closeCartModal();
  
  const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  const checkoutSummary = document.getElementById('checkoutSummary');
  
  // Generar resumen de la compra
  let summaryHTML = '';
  let total = 0;
  
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    
    summaryHTML += `
      <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
        <span class="fw-medium">${item.nombre} x ${item.cantidad}</span>
        <span class="text-success fw-bold">$${subtotal.toLocaleString()}</span>
      </div>
    `;
  });
  
  summaryHTML += `
    <div class="d-flex justify-content-between align-items-center py-3 border-top mt-3">
      <span class="h5 mb-0 text-primary">Total:</span>
      <span class="h4 mb-0 text-success fw-bold">$${total.toLocaleString()}</span>
    </div>
  `;
  
  checkoutSummary.innerHTML = summaryHTML;
  modal.show();
}

function closeCheckoutModal() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
  if (modal) modal.hide();
}

function selectPayment(metodo) {
  metodoPagoSeleccionado = metodo;
  
  // Remover selección previa
  document.querySelectorAll('.payment-btn').forEach(btn => {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline-primary');
  });
  
  // Seleccionar botón actual
  event.target.closest('.payment-btn').classList.remove('btn-outline-primary');
  event.target.closest('.payment-btn').classList.add('btn-primary');
}

function processPayment() {
  if (!metodoPagoSeleccionado) {
    Swal.fire({
      icon: 'warning',
      title: 'Método de pago requerido',
      text: 'Selecciona un método de pago',
      confirmButtonColor: '#3085d6'
    });
    return;
  }
  
  const total = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  
  Swal.fire({
    icon: 'info',
    title: 'Procesando Pago',
    text: `Redirigiendo a ${metodoPagoSeleccionado.toUpperCase()}...`,
    showConfirmButton: false,
    timer: 2000
  }).then(() => {
    // Aquí es donde conectarías con PSE, Mercado Pago, etc.
    Swal.fire({
      icon: 'success',
      title: '¡Pago Exitoso!',
      text: `Tu compra por $${total.toLocaleString()} ha sido procesada`,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Continuar'
    }).then(() => {
      // Limpiar carrito
      carrito = [];
      actualizarContadorCarrito();
      closeCheckoutModal();
      
      // Redirigir al dashboard
      window.location.href = 'dashboard.html';
    });
  });
}

// Cerrar modales al hacer clic fuera de ellos
window.onclick = function(event) {
  const productsModal = document.getElementById('productsModal');
  const cartModal = document.getElementById('cartModal');
  const checkoutModal = document.getElementById('checkoutModal');
  
  if (event.target === productsModal) {
    productsModal.style.display = 'none';
  }
  if (event.target === cartModal) {
    cartModal.style.display = 'none';
  }
  if (event.target === checkoutModal) {
    checkoutModal.style.display = 'none';
  }
}
