window.onload = () =>{
    recuperaDatos();
}

function recuperaDatos(){
    let mapCarrito = new Map(JSON.parse(localStorage.carrito));
    let usuario = JSON.parse(localStorage.usuario);
    pintaDatosUsuario(usuario);
    pintaDatosCarrito(mapCarrito);
    pintaNumAndFecha();
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
}


function pintaNumAndFecha(){
    let fechaNumeroFactura = document.querySelector(".fechanumfactura");

    //OBTENEMOS FECHA
    let fecha = new Date();
    let cadenaFecha = `${fecha.getDate()} / ${fecha.getMonth()+1} / ${fecha.getFullYear()}`;
    console.log(cadenaFecha);

    //ASIGNAMOS UN NUMERO ALEATORIO A LA FACTURA
    let numeroAleatorio = Math.round(Math.random()*99999999);
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
`;
}


function pintaDatosCarrito(mapCarrito){
    let table = document.querySelector("table");
    let precioTotalPedido = 0;

    for(let [modelo, producto] of mapCarrito){
    
        let leyendaUnidad = "";
        leyendaUnidad = (producto.cantidad == 1) ? "ud." : "uds.";

        table.innerHTML += `
            <tr>
                <td>${producto.modelo}</td>
                <td>${producto.preciounidad}€</td>
                <td>${producto.cantidad} ${leyendaUnidad}</td>
                <td>${producto.precio}€</td>
            </tr>
        `;
        precioTotalPedido = precioTotalPedido += producto.precio;
    }

    pintaTotalFactura(precioTotalPedido);
}

function pintaTotalFactura(precioTotalPedido){
    let calculoIVA = parseFloat(precioTotalPedido *0.21).toFixed(2);
    let precioSinIVA = parseFloat(precioTotalPedido - calculoIVA).toFixed(2);
    let detalleIVA = document.querySelector(".total_pedido_container");
    detalleIVA.innerHTML = `
        <div class=linea>
            <span class=titulo_dato>Precio Sin IVA:</span>
            <span class=dato_numero>${precioSinIVA}€</span>
        </div>
        <div class=linea>
            <span class=titulo_dato>IVA 21%:</span>
            <span class=dato_numero>${calculoIVA}€</span>
        </div>
        <div class="linea total_pedido">
            <span class=titulo_dato>Total: </span>
            <span class=dato_numero>${precioTotalPedido}€</span>
        </div>
    `;

    //BOTON PARA GENERAR FACTURA EN PDF
    document.querySelector(".contenido_genera").addEventListener("click", () =>{
        generaPDF();
        });
}

function generaPDF(){
   let factura = document.querySelector(".factura");
   html2pdf()
   .set({
        margin:0.5,
        filename: "movilStockFactura.pdf",
        image:{
            type:"jpeg",
            quality: 0.9
        },
        html2canvas:{
            scale:3,
            letterRendering: true,
        },
        jsPDF:{
            unit : "in",
            format: "a3",
            orientation: "portrait",
        }
   })

    .from(factura)
    .save();
}



