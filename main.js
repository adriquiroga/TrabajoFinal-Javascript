
const contenedorProd = document.getElementById("contenedorProduct");
const vercarrito = document.getElementById("vercarrito");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const modalContainer = document.getElementById("modalContainer");

swalShown = false;
document.addEventListener('DOMContentLoaded', function() {
  if (!swalShown) {
    Swal.fire({
      title: '<span class="tit-bienvenida">Te damos la bienvenida a nuestro sitio de cosmética natural</span>',
      imageUrl: 'assets/logo.png',
      imageWidth: 150, 
      imageHeight: 150,
      confirmButtonText: 'Aceptar'
    }); 
    swalShown = true;
  }
});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];  
const getProducts = async () => {
  try {
    const response = await fetch("productos.json");
    
    if (!response.ok) {
      throw new Error("Error al cargar los productos");
    }     
    const productos = await response.json();   
    productos.forEach((producto) => {     
      let contenedor = document.createElement("div");
      contenedor.className = "card contenedorProd";      
      contenedor.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <h2 class = "nombre-prod">${producto.nombre}</h2>    
        <p class="precio">$${producto.precio}</p>
      `;      
      let agregarCarrito = document.createElement("button");
      agregarCarrito.innerText = "Agregar al carrito";
      agregarCarrito.className = "boton";      
      contenedor.append(agregarCarrito);      
      contenedorProd.append(contenedor);

      agregarCarrito.addEventListener("click", () => {
        const repeat = carrito.some((repeatProduct) => repeatProduct.id === producto.id);
        if (repeat) {
          carrito = carrito.map((prod) => {
            if (prod.id === producto.id) {
              prod.cantidad++;
            }
            return prod;
          });
        } else {
          carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            img: producto.img,
            cantidad: producto.cantidad,
          });
        }        
        carritoContador();
        localSave();

        Toastify({
          text: "Producto agregado",
          duration: 1000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          gravity: "top",
          position: "right", 
          stopOnFocus: true, 
          offset: {
              x: "1.5rem", 
              y: "1.5rem", 
            },
          className: "toasti1",
          onClick: function(){} 
      }).showToast();

      });
    });

  } catch (error) {
    console.error(error.message);
  }

};

getProducts();


//localStorage
function localSave() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

JSON.parse(localStorage.getItem("carrito"));


//Evento del carrito y creación del modal que muestra el interior 
const pintarCarrito = () => {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "block";

  //Header del modal
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
    <h1 class="modal-header-titulo">Carrito</h1>
  `;

  modalContainer.append(modalHeader);

  const modalButton = document.createElement("h6");
  modalButton.innerText = "X";
  modalButton.className = "modal-header-button";

  //Cierre del modal
  modalButton.addEventListener("click", () =>{
      modalContainer.style.display = "none";
  });

  modalHeader.append(modalButton);

  //Creamos los productos que se muestran por modal
  carrito.forEach((producto) => {
      let carritoContent = document.createElement("div");
      carritoContent.className = "modal-content";
      carritoContent.innerHTML = `
        <img src="${producto.img}">
        <p class = "nombre-prod2">${producto.nombre}</p>    
        <p class="precio">$${producto.precio}</p>
        <span class="restar"> - </span>
        <p>Cantidad: ${producto.cantidad}</p>
        <span class="sumar"> + </span>
        <p>Total: $${producto.cantidad * producto.precio}</p>
        <span class="delete-product"> ✕ </span>  
      `;

      modalContainer.append(carritoContent);


      //Restar productos
      let restar = carritoContent.querySelector(".restar");
      restar.addEventListener("click", () => {
          if(producto.cantidad !== 1) {
             producto.cantidad--;
          }
          pintarCarrito();
          localSave();
      });

      //Sumar productos
      let sumar = carritoContent.querySelector(".sumar");
      sumar.addEventListener("click", () => {
          producto.cantidad++;
          pintarCarrito();
          localSave();
      });


      //Eliminar productos
      let eliminar = carritoContent.querySelector(".delete-product");
      eliminar.addEventListener("click", () => {
          eliminarProducto(producto.id);

          Toastify({
              text: "Producto eliminado",
              duration: 1000,
              destination: "https://github.com/apvarun/toastify-js",
              newWindow: true,
              gravity: "top",
              position: "right", 
              stopOnFocus: true, 
              offset: {
                  x: "1.5rem", 
                  y: "1.5rem", 
                },
              className: "toasti2",
              onClick: function(){} 
          }).showToast();
      });
  });


  //Footer de modal con el Total de productos
  const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
                               
  const totalPrecio = document.createElement("div");
  totalPrecio.className = "total-content";
  totalPrecio.innerHTML = `Total a pagar: $${total}`;

  modalContainer.append(totalPrecio);

  //Boton para Finalizar Compra
  const finalizarCompra = document.createElement("button");
  finalizarCompra.innerText = "Finalizar compra";
  finalizarCompra.className = "finalizar-compra";
  modalContainer.append(finalizarCompra);

  finalizarCompra.addEventListener("click", () => {
      abrirFormularioCompra();
  });
};

vercarrito.addEventListener("click", pintarCarrito);

//Función para eliminar el producto del carrito
const eliminarProducto = (id) => {
  const foundId = carrito.find ((elemento) => elemento.id === id);

  carrito = carrito.filter((carritoId) => {
      return carritoId !== foundId;
  });

  carritoContador();

  localSave();

  pintarCarrito();
};

//Contador de prod del carrito
const carritoContador = () => {
  const totalProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0); // Sumar la cantidad de cada producto

  // Guardar la cantidad total en el localStorage
  localStorage.setItem("carritoLength", JSON.stringify(totalProductos));

  // Actualizar el contador en el ícono del carrito
  cantidadCarrito.innerText = totalProductos;
};

// Llamar la función para actualizar el contador
carritoContador();


//Modal Finalizar Compra
const abrirFormularioCompra = () => {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "block";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
      <h1 class="modal-header-titulo">Ingresa tus datos</h1>
    `;
  modalContainer.append(modalHeader);

  const modalButton = document.createElement("h2");
  modalButton.innerText = "X";
  modalButton.className = "modal-header-button";
  modalButton.addEventListener("click", () => {
    modalContainer.style.display = "none";

  });
  modalHeader.append(modalButton);

  const formulario = document.createElement("form");
  formulario.className = "formulario-compra";
  formulario.innerHTML = `
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" name="nombre" required><br><br>
      
      <label for="nombre">Número de tarjeta débito/crédito:</label>
      <input type="text" id="tarjeta" name="Número de tarjeta" required><br><br>
      
      <label for="nombre">Nombre y Apellido del titular:</label>
      <input type="text" id="nombretarjeta" name="nombretarjeta" required><br><br>
      
      <label for="nombre">Vencimiento:</label>
      <input type="date" id="date" name="date" required><br><br>
      
      <label for="nombre">Código de seguridad:</label>
      <input type="text" id="codigo" name="codigo" required><br><br>
      
      <label for="nombre">Código postal:</label>
      <input type="text" id="codigop" name="codigop" required><br><br>
      
      <label for="direccion">Dirección:</label>
      <input type="text" id="direccion" name="direccion" required><br><br>
      
      <button type="submit" class="confirmar-compra">Confirmar Compra</button>
  `;

modalContainer.append(formulario);

formulario.addEventListener("submit", (e) => {
  e.preventDefault();


  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;


  modalContainer.innerHTML = `
        <h2>Listo, ${nombre}!</h2>
        <p>Su pedido será enviado a la dirección: ${direccion} a la brevedad. ¡Muchas gracias!</p>
        <button class="cerrar-modal">Cerrar</button>
      `;

  const cerrarModalBtn = document.querySelector(".cerrar-modal");
  cerrarModalBtn.addEventListener("click", () => {
    modalContainer.style.display = "none";

  });  
}) 
};


























