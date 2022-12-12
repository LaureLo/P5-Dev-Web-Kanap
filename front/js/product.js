// Récupérer l'id du produit
const queryString = window.location.search 
const urlParams = new URLSearchParams(queryString)
const product_id = urlParams.get("_id");

// Récupérer les données du produit grâce à son id
fetch(`http://localhost:3000/api/products/${product_id}`)
  .then((product) => product.json()) 
  .then((product) => {
    displayProductInfos(product);
    listenColorsEvent();
    listenQuantityEvent();
  });

// Initialisation de l'object product_client
const product_client = { 
  id : product_id,
  color : "",
  quantity : 0
};

// Déclaration des selectors
const product_img = document.querySelector(".item__img");
const product_title = document.querySelector("#title");
const product_price = document.querySelector("#price");
const product_description = document.querySelector("#description");
const product_colors = document.querySelector("#colors");
const product_nb = document.querySelector("#quantity");
const color_miss = document.querySelector(".item__content");


// Afficher les informations du produit avec une boucle for pour les couleurs
function displayProductInfos(product) {
  product_img.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  product_title.innerHTML += `<h1 id="title"> ${product.name} </h1>`;
  product_price.innerHTML += `<span id="price"> ${product.price} </span>`;
  product_description.innerHTML += `<p id="description"> ${product.description} </p>`;
  for (let i = 0; i < product.colors.length; i += 1) {
    product_colors.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
  }
}
//------------------------------------------------------------

// Récupérer la valeur de couleur quand elle change
function listenColorsEvent() {
  product_colors.addEventListener("change", (e) => {
    product_client.color = e.target.value;
    if(product_client.color != 0){
      document.querySelector(".color__miss").textContent = "";
    }
  });
}
//------------------------------------------------------------

// Récupération de la value de quantité quand elle change
function listenQuantityEvent() {
  product_nb.addEventListener("change", (e) => {
    product_client.quantity = parseInt(e.target.value);
    if(product_client.quantity != 0){
      document.querySelector(".quantity__miss").textContent = "";
    }
  });
}
//------------------------------------------------------------

// Click sur le bouton ajouter au panier
const add_cart = document.querySelector("#addToCart");
add_cart.addEventListener("click", () => {
  verifyInput(product_client);
});
//------------------------------------------------------------

// Vérifier s'il y a bien une couleur et une quantité de choisies
function verifyInput(product_client) {
  if((product_client.color == "") && (product_client.quantity < 1 || product_client.quantity > 100)){
    colorQuantityMiss()
  } else if (product_client.color == "") {
    colorMiss();
  } else if (product_client.quantity < 1 || product_client.quantity > 100) {
    quantityMiss();
  } else {
    if (addLs(product_client)) {
      productAdded();
    } else {
      excessQuantity();
    }
  }
}
//------------------------------------------------------------

// Ajouter le produit au local storage et ajouter uniquement la quantité si le produit y est déjà
/**
 * Ajout de la quantité si le produit est déjà présent dans le local storage
 * get_article récupère le local storage et vérifie si le produit choisi est déjà présent dans le ls
 * Si il est déjà présent ajout de de get_article.quantity à product_client.quantity
 * Si le produit n'est pas présent dans le local storage, il l'ajoute directement dans le ls
 */
function addLs(product_client) {
  let cart = JSON.parse(localStorage.getItem("product_client")); // JSON.parse permet d'analyser ls.getItem comme du json 
  if (cart == null) {
    cart = [];
    cart.push(product_client);
    localStorage.setItem("product_client", JSON.stringify(cart));
  } else {
    let get_article = cart.find((cart_product) => product_client.id == cart_product.id && product_client.color == cart_product.color);
    if (get_article) {
      let nb = Number(product_client.quantity) + Number(get_article.quantity);
      if (nb < 101){
      get_article.quantity = nb;
      localStorage.setItem("product_client", JSON.stringify(cart));
      } else {
        return false
      }
    } else {
      cart.push(product_client);
      localStorage.setItem("product_client", JSON.stringify(cart));
    }
  } return true
} 
//------------------------------------------------------------

// Fonction pour les messages d'erreurs
const newElt = document.createElement("span");
const elt = color_miss;
elt.appendChild(newElt);
newElt.classList.add("color__miss", "quantity__miss","product__added", "excess__quantity");

function styleError(){
  newElt.style.color = "red";
  newElt.style.fontWeight = "bold";
  newElt.style.textAlign = "center";
  newElt.style.paddingTop = "5px";
}
function styleOk(){
  newElt.style.color = "green";
  newElt.style.fontWeight = "bold";
  newElt.style.textAlign = "center";
  newElt.style.paddingTop = "5px";
}

function colorQuantityMiss(){
  document.querySelector(".color__miss , .quantity__miss").textContent = "Merci de choisir une couleur et une quantité comprise entre 1 et 100";
  styleError()
}

function colorMiss(){
  document.querySelector(".color__miss").textContent = "Merci de choisir une couleur";
  styleError()
}

function quantityMiss(){
  document.querySelector(".quantity__miss").textContent = "Merci de choisir une quantité de produit comprise entre 1 et 100";
  styleError()
}

function excessQuantity(){
  document.querySelector(".excess__quantity").textContent = "La quantité totale d'un même article ne peut dépasser 100";
  styleError()
}

function productAdded(){
  document.querySelector(".product__added").textContent = "Votre commande vient d'être ajoutée au panier";
  styleOk()
}
