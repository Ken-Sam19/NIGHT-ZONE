function agregarCarrito(nombre, precio, imagen, tipo) {
    if (!tipo) tipo = 'compra';
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existente = carrito.find(item => item.nombre === nombre && item.tipo === tipo);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1, imagen: imagen || '', tipo });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarToast((tipo === 'reserva' ? 'Reservado' : 'Agregado al carrito') + ': ' + nombre);
}

function mostrarToast(mensaje) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('toast-visible'), 10);
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
}

function eliminarDelCarrito(index) {
    const carrito = obtenerCarrito();
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarCarrito();
}

function actualizarCantidad(index, delta) {
    const carrito = obtenerCarrito();
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    actualizarContadorCarrito();
    const contenedor = document.getElementById('carrito-contenido');
    if (contenedor) contenedor.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
}

function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = total;
        el.style.display = total > 0 ? 'inline' : 'none';
    });
}

function renderizarCarrito() {
    const contenedor = document.getElementById('carrito-contenido');
    if (!contenedor) return;
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
        document.getElementById('carrito-total').textContent = '0';
        document.getElementById('carrito-subtotal').textContent = 'S/0';
        return;
    }
    let html = '';
    carrito.forEach((item, i) => {
        const subtotal = item.precio * item.cantidad;
        const tipoBadge = item.tipo === 'reserva' ? '<span class="badge-reserva">Reserva</span>' : '<span class="badge-compra">Compra</span>';
        html += `
            <div class="carrito-item">
                <div class="carrito-item-info">
                    <h4>${item.nombre} ${tipoBadge}</h4>
                    <p class="carrito-item-precio">S/${item.precio}</p>
                </div>
                <div class="carrito-item-cantidad">
                    <button class="btn-cantidad" onclick="actualizarCantidad(${i}, -1)">−</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="actualizarCantidad(${i}, 1)">+</button>
                </div>
                <p class="carrito-item-subtotal">S/${subtotal}</p>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${i})">✕</button>
            </div>
        `;
    });
    contenedor.innerHTML = html;
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    document.getElementById('carrito-total').textContent = totalItems;
    document.getElementById('carrito-subtotal').textContent = 'S/' + totalPrecio;
}

document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

function generarCodigoEfectivo() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'NZ-';
    for (let i = 0; i < 5; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
}
