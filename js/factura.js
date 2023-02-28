window.onload = function(){
    recuperaDatos();

}

function recuperaDatos(){
    let mapCarrito = new Map(JSON.parse(localStorage.carrito));
    let usuario = JSON.parse(localStorage.usuario);

    console.log(mapCarrito);
    pintaDatosUsuario(usuario);
    pintaDatosCarrito(mapCarrito);
}

function pintaDatosUsuario(usuario){
    let contenedorDatos = document.querySelector(".datos_persona");
    contenedorDatos.innerHTML = `
    <div class="linea">
        <span class=titulo_dato>Nombre: </span>
        <span class=dato>${usuario.nombre}</span>
    </div>
    <div class="linea">
        <span class=titulo_dato>Dirección: </span>
        <span class=dato>${usuario.direccion}</span>
    </div>
    <div class="linea">
        <span class=titulo_dato>Correo: </span>
        <span class=dato>${usuario.correo}</span>
    </div>
    <div class="linea">
        <span class=titulo_dato>Teléfono: </span>
        <span class=dato>${usuario.telefono}</span>
    </div>
    `;

    pintaNumAndFecha();
}


function pintaNumAndFecha(){
    let fechaNumeroFactura = document.querySelector(".fechanumfactura");

    //OBTENEMOS FECHA
    let fecha = new Date();
    let cadenaFecha = `${fecha.getDate()} / ${fecha.getMonth()+1} / ${fecha.getFullYear()}`;
    console.log(cadenaFecha);
    //ASIGNAMOS UN NUMERO ALEATORIO A LA FACTURA
    let numeroAleatorio = Math.round(Math.random()*999999);
    console.log(numeroAleatorio);

    //PINTAMOS DATOS
    fechaNumeroFactura.innerHTML = `
    <div class="linea">
        <span class=titulo_dato>Fecha: </span>
        <span class=dato>${cadenaFecha}</span>
    </div>
    <div class="linea">
    <span class=titulo_dato>Factura Num.: </span>
    <span class=dato>MS-${numeroAleatorio}</span>
</div>
`
    
}


function pintaDatosCarrito(mapCarrito){
    let table = document.querySelector("table");
    let precioTotalPedido = 0;


    for(let [modelo, producto] of mapCarrito){

        let precioTotal = parseInt(producto.preciounidad) * parseInt(producto.cantidad);

        let leyendaUnidad = "";
        if(producto.cantidad == 1){
            leyendaUnidad = "ud."
        }else{
            leyendaUnidad = "uds."
        }

        table.innerHTML += `
            <tr>
                <td>${producto.modelo}</td>
                <td>${producto.preciounidad}€</td>
                <td>${producto.cantidad} ${leyendaUnidad}</td>
                <td>${precioTotal}€</td>
            </tr>
        `;


        precioTotalPedido = precioTotalPedido += producto.precio;
    }

    pintaTotalFactura(precioTotalPedido);
}

function pintaTotalFactura(precioTotalPedido){

    let precioSinIVA = parseFloat(precioTotalPedido / (1.21)).toFixed(2);
    let calculoIVA = parseFloat(precioTotalPedido - precioSinIVA).toFixed(2);

    let detalleIVA = document.querySelector(".detalle_iva");
    detalleIVA.innerHTML = `
        <span class=titulo_detalleIVA>IVA 21%:</span>
        <span class=valor_detalleIVA>${calculoIVA}€</span>
    `

    let detalleTotal = document.querySelector(".total_pedido");
    detalleTotal.innerHTML = `
        <span class=titulo_detalleTotal>Total: </span>
        <span class=valor_detalleTotal>${precioTotalPedido}€</span>
    `

}