
window.onload = () => {
    recuperaDatos()
}


//RECUPERAMOS DE FORMA ASINCRONA LOS DATOS DEL JSON
async function recuperaDatos() {
    let response = await fetch("/js/productos.json");
    let datos = await response.json();
    
}


for (let movil of datos) {
    let producto = {
        marca: movil.marca,
        modelo: movil.modelo,
        descripcion: movil.descripcion,
        precio: movil.precio,
        moneda: movil.moneda,
        unidades: movil.unidades,
        foto: movil.foto,
        promociones: movil.promociones
    };
    mapProductos.set(movil.modelo, producto);
    pintaMoviles(datos);
}

function pintaMoviles(datos) {
    let productos = document.querySelector(".productos");
    for (let movil of datos) {
        let divProducto = document.createElement("div");
        divProducto.classList = "producto";
        let producto = mapProductos.get(movil.modelo);
        divProducto.innerHTML += `
            <h2 class="marca">${producto.marca}</h2>
            <div class="imagen_producto">
                <img src='./images/${producto.foto}'>
                <div class="unidades_container">
                    <span>Unidades</span>
                    <span class="unidades">${producto.unidades}</span>
                </div>
            </div>
            <div class="texto">
                <p class="modelo">${producto.modelo}</p>
                <p class="descripcion">${producto.descripcion}</p>
                <p class="precio">${producto.precio} <span class="moneda">${producto.moneda}</span></p>
            </div>
        `;
        if (producto.promociones > 0) {
            let img = document.createElement("img");
            img.classList = "oferta";
            img.src = "/images/oferta2.png";
            img.width = "100";
            divProducto.children[1].appendChild(img);
        }
        let boton = document.createElement("button");
        boton.classList.add("botoncarrito");
        boton.textContent = "Agregar al carrito";
        divProducto.addEventListener("click", agregacarrito);
        divProducto.appendChild(boton);
        productos.appendChild(divProducto);
    }
}

function agregacarrito(e) {
    if (e.target.tagName == "BUTTON") {
        let unidades = this.querySelector(".unidades");
        if (unidades.textContent > 0) {
            unidades.textContent = unidades.textContent - 1;
            let modelovar = this.querySelector(".modelo").textContent;
            let producto = mapProductos.get(modelovar);
            producto.unidades--;
            if (producto.unidades == 0) {
                productoAgotado(this.querySelector(".imagen_producto"), this.querySelector(".botoncarrito"));
            }
            if (!mapCarrito.has(modelovar)) {
                mapCarrito.set(modelovar, {
                    imagen: producto.foto,
                    precio: producto.precio,
                    preciounidad: producto.precio,
                    cantidad: 1
                });
            } else {
                let carritoProducto = mapCarrito.get(modelovar);
                carritoProducto.precio += producto.precio;
                carritoProducto.cantidad++;
            }
            pintaCarrito(mapCarrito);
            document.querySelector(".contador_productos").innerHTML = `<span>${mapCarrito.size}</span>`;
        } else {
            productoAgotado(this.querySelector(".imagen_producto"), this.querySelector(".botoncarrito"));
        }
    }
 

}


function pintaCarrito(mapCarrito) {
    divCarrito.innerHTML = "";
    for (let [modelo, producto] of mapCarrito) {
        let divProducto = document.createElement("div");
        divProducto.classList.add("contenido");
        divProducto.id = modelo.replace(/\s+/g, '_');
        let productoOriginal = mapProductos.get(modelo);
        divProducto.innerHTML = `
            <div class="carrito_imagen">
                <img src=${productoOriginal.foto} width="200">
            </div>
            <div class="texto_carrito">
                <p>${modelo}</p>
                <p>Precio: ${producto.precio}</p>
                <p>Unidad: ${producto.preciounidad}</p>
                <p class="carrito_unidades"><span>-</span><span>${producto.cantidad}</span><span>+</span></p>
            </div>
        `;
        let carritoCantidades = divProducto.querySelector(".carrito_unidades");
        carritoCantidades.addEventListener("click", (e) => {
            procesaUnidadesCarrito(e, modelo);
        });
        divCarrito.appendChild(divProducto);
    }
}
