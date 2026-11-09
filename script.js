// Datos por defecto (si se entra directo con admin / 2026)
let cliente = {
    nombre: "Cliente General (Admin)",
    nit: "CF",
    placa: "P-2026ADM"
};

let espaciosDisponibles = 42;
const TARIFA_HORA = 10;

// Función para cambiar a la pantalla del sistema
function mostrarSistema() {
    document.getElementById("vista-inicio").classList.add("oculto");
    document.getElementById("vista-sistema").classList.remove("oculto");

    document.getElementById("info-nombre").textContent = cliente.nombre;
    document.getElementById("info-nit").textContent = cliente.nit;
    document.getElementById("info-placa").textContent = cliente.placa;
}

// 1. Registro de datos personales del cliente
document.getElementById("form-registro").addEventListener("submit", function(e) {
    e.preventDefault();

    cliente.nombre = document.getElementById("nombre").value;
    cliente.nit = document.getElementById("nit").value;
    cliente.placa = document.getElementById("placa").value.toUpperCase();

    document.getElementById("texto-confirmacion").textContent = 
        `${cliente.nombre} | NIT: ${cliente.nit} | Placa: ${cliente.placa}`;
    
    document.getElementById("caja-confirmacion").classList.remove("oculto");
});

// Pasar al sistema luego de registrarse
document.getElementById("btn-ir-sistema").addEventListener("click", function() {
    mostrarSistema();
});

// 2. Acceso con usuario admin y contraseña 2026
document.getElementById("form-login").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("clave").value.trim();

    if (user === "admin" && pass === "2026") {
        document.getElementById("error-login").classList.add("oculto");
        mostrarSistema();
    } else {
        document.getElementById("error-login").classList.remove("oculto");
    }
});

// 3. Cálculo de pago, generación de factura y registro de movimiento
document.getElementById("form-pago").addEventListener("submit", function(e) {
    e.preventDefault();

    const horas = Number(document.getElementById("horas").value);
    const cargoValet = Number(document.getElementById("valet").value);
    const total = (horas * TARIFA_HORA) + cargoValet;

    // Reducir espacios disponibles
    if (espaciosDisponibles > 0) {
        espaciosDisponibles--;
        document.getElementById("espacios").textContent = espaciosDisponibles;
    }

    // Mostrar datos en la factura
    document.getElementById("fac-nombre").textContent = cliente.nombre;
    document.getElementById("fac-nit").textContent = cliente.nit;
    document.getElementById("fac-placa").textContent = cliente.placa;
    document.getElementById("fac-horas").textContent = horas;
    document.getElementById("fac-valet").textContent = cargoValet;
    document.getElementById("fac-total").textContent = total;
    document.getElementById("seccion-factura").classList.remove("oculto");

    // Agregar a la tabla de últimos movimientos
    const tabla = document.getElementById("tabla-movimientos");
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
        <td>${cliente.nombre}</td>
        <td>${cliente.placa}</td>
        <td>${horas} h</td>
        <td><strong>Q${total}.00</strong></td>
    `;
    tabla.prepend(nuevaFila);
});

// 4. Guardar / Descargar la factura como archivo .txt
document.getElementById("btn-descargar").addEventListener("click", function() {
    const horas = document.getElementById("fac-horas").textContent;
    const valet = document.getElementById("fac-valet").textContent;
    const total = document.getElementById("fac-total").textContent;
    const fecha = new Date().toLocaleString("es-GT");

    const contenidoFactura = 
`=========================================
             PARQUEO KRISTAL
          Ciudad de Guatemala
=========================================
Fecha de emisión: ${fecha}
Cliente: ${cliente.nombre}
NIT: ${cliente.nit}
Placa: ${cliente.placa}
-----------------------------------------
Tiempo estacionado: ${horas} hora(s) (Q10.00 c/u)
Servicio Valet Parking: Q${valet}.00
-----------------------------------------
TOTAL A PAGAR: Q${total}.00
=========================================
     ¡Gracias por visitar Parqueo Kristal!`;

    const archivo = new Blob([contenidoFactura], { type: "text/plain;charset=utf-8" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = `Factura_${cliente.placa}.txt`;
    enlace.click();
    URL.revokeObjectURL(enlace.href);
});

// 5. Botón para regresar al inicio
document.getElementById("btn-salir").addEventListener("click", function() {
    document.getElementById("vista-sistema").classList.add("oculto");
    document.getElementById("vista-inicio").classList.remove("oculto");
    document.getElementById("seccion-factura").classList.add("oculto");
});