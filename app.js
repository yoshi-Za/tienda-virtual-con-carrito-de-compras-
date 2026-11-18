

// ======================================
// 1. PRODUCTOS
// ======================================

const productos = [
    { id: 1, nombre: "Teclado mecánico", precio: 180000, categoria: "Periféricos", stock: 5 },
    { id: 2, nombre: "Mouse inalámbrico", precio: 60000, categoria: "Periféricos", stock: 8 },
    { id: 3, nombre: "Monitor 24 pulgadas", precio: 450000, categoria: "Monitores", stock: 4 },
    { id: 4, nombre: "Monitor gamer", precio: 850000, categoria: "Monitores", stock: 3 },
    { id: 5, nombre: "Audífonos Bluetooth", precio: 120000, categoria: "Audio", stock: 6 },
    { id: 6, nombre: "Parlante portátil", precio: 90000, categoria: "Audio", stock: 7 },
    { id: 7, nombre: "Micrófono USB", precio: 150000, categoria: "Audio", stock: 5 },
    { id: 8, nombre: "Mouse gamer", precio: 95000, categoria: "Periféricos", stock: 4 }
];

// ======================================
// 2. VARIABLES
// ======================================

let carrito = [];
let categoriaSeleccionada = "Todas";

const contenedorProductos = document.getElementById("catalogo");
const contenedorFiltros = document.getElementById("filtros");
const listaCarrito = document.getElementById("carrito-lista");

// ======================================
// 3. FORMATO DE DINERO
// ======================================

function formatoDinero(valor) {
    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}

// ======================================
// 4. GENERAR FILTROS
// ======================================

function generarFiltros() {

    const categorias = [
        "Todas",
        ...new Set(productos.map(producto => producto.categoria))
    ];

    contenedorFiltros.innerHTML = "";

    categorias.forEach(categoria => {

        const boton = document.createElement("button");

        boton.textContent = categoria;
        boton.className = "filtro-boton";

        if (categoria === categoriaSeleccionada) {
            boton.classList.add("activo");
        }

        boton.addEventListener("click", () => {
            categoriaSeleccionada = categoria;
            generarFiltros();
            mostrarProductos();
        });

        contenedorFiltros.appendChild(boton);
    });
}

// ======================================
// 5. MOSTRAR PRODUCTOS
// ======================================

function mostrarProductos() {

    contenedorProductos.innerHTML = "";

    const filtrados = productos.filter(producto =>
        categoriaSeleccionada === "Todas" ||
        producto.categoria === categoriaSeleccionada
    );

    document.getElementById("contador").textContent =
        `Mostrando ${filtrados.length} productos`;

    filtrados.forEach(producto => {

        const tarjeta = document.createElement("article");

        tarjeta.className = "producto";

        if (producto.stock === 0) {
            tarjeta.classList.add("producto--agotado");
        }

        tarjeta.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Categoría: ${producto.categoria}</p>
            <p class="precio">${formatoDinero(producto.precio)}</p>
            <span class="stock ${producto.stock === 0 ? "agotado" : ""}">
                ${producto.stock === 0 ? "Agotado" : `Stock: ${producto.stock}`}
            </span>
            <button class="boton boton--primario"
                ${producto.stock === 0 ? "disabled" : ""}>
                Agregar al carrito
            </button>
        `;

        tarjeta.querySelector("button").addEventListener("click", () => {
            agregarAlCarrito(producto.id);
        });

        contenedorProductos.appendChild(tarjeta);
    });
}

// ======================================
// 6. AGREGAR AL CARRITO
// ======================================

function agregarAlCarrito(id) {

    const producto = productos.find(p => p.id === id);

    if (!producto || producto.stock <= 0) return;

    const productoCarrito = carrito.find(p => p.id === id);

    if (productoCarrito) {
        productoCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    producto.stock--;

    actualizarTodo();
}

// ======================================
// 7. CAMBIAR CANTIDADES
// ======================================

function cambiarCantidad(id, cambio) {

    const productoCarrito = carrito.find(p => p.id === id);
    const productoOriginal = productos.find(p => p.id === id);

    if (!productoCarrito || !productoOriginal) return;

    if (cambio === 1 && productoOriginal.stock <= 0) return;

    productoCarrito.cantidad += cambio;
    productoOriginal.stock -= cambio;

    if (productoCarrito.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
    }

    actualizarTodo();
}

// ======================================
// 8. MOSTRAR CARRITO
// ======================================

function mostrarCarrito() {

    listaCarrito.innerHTML = "";

    const carritoVacio = document.getElementById("carrito-vacio");

    carritoVacio.style.display =
        carrito.length === 0 ? "block" : "none";

    carrito.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;

        const elemento = document.createElement("li");

        elemento.className = "carrito__item";

        elemento.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: ${formatoDinero(producto.precio)}</p>

            <div class="carrito__controles">
                <button class="menos" aria-label="Disminuir cantidad">−</button>
                <span>${producto.cantidad}</span>
                <button class="mas" aria-label="Aumentar cantidad">+</button>
            </div>

            <p>Subtotal: ${formatoDinero(subtotal)}</p>

            <button class="carrito__eliminar">Eliminar</button>
        `;

        elemento.querySelector(".menos").addEventListener("click", () => {
            cambiarCantidad(producto.id, -1);
        });

        elemento.querySelector(".mas").addEventListener("click", () => {
            cambiarCantidad(producto.id, 1);
        });

        elemento.querySelector(".carrito__eliminar").addEventListener("click", () => {
            eliminarProducto(producto.id);
        });

        listaCarrito.appendChild(elemento);
    });
}

// ======================================
// 9. ELIMINAR PRODUCTO
// ======================================

function eliminarProducto(id) {

    const productoCarrito = carrito.find(p => p.id === id);
    const productoOriginal = productos.find(p => p.id === id);

    if (!productoCarrito || !productoOriginal) return;

    productoOriginal.stock += productoCarrito.cantidad;

    carrito = carrito.filter(p => p.id !== id);

    actualizarTodo();
}

// ======================================
// 10. VACIAR CARRITO
// ======================================

function vaciarCarrito() {

    carrito.forEach(productoCarrito => {

        const productoOriginal = productos.find(
            p => p.id === productoCarrito.id
        );

        productoOriginal.stock += productoCarrito.cantidad;
    });

    carrito = [];

    actualizarTodo();
}

document.getElementById("btn-vaciar").addEventListener(
    "click",
    vaciarCarrito
);

// ======================================
// 11. RESUMEN DE COMPRA
// ======================================

function actualizarResumen() {

    let articulos = 0;
    let subtotal = 0;

    carrito.forEach(producto => {
        articulos += producto.cantidad;
        subtotal += producto.precio * producto.cantidad;
    });

    const descuento = subtotal >= 300000
        ? subtotal * 0.10
        : 0;

    const total = subtotal - descuento;

    document.getElementById("resumen-articulos").textContent = articulos;

    document.getElementById("resumen-subtotal").textContent =
        formatoDinero(subtotal);

    document.getElementById("resumen-descuento").textContent =
        formatoDinero(descuento);

    document.getElementById("resumen-total").textContent =
        formatoDinero(total);
}

// ======================================
// 12. ACTUALIZAR INTERFAZ
// ======================================

function actualizarTodo() {

    mostrarProductos();
    mostrarCarrito();
    actualizarResumen();
}

// ======================================
// 13. INICIAR APLICACIÓN
// ======================================

generarFiltros();
actualizarTodo();
