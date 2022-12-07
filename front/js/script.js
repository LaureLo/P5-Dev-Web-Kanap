const url = "http://localhost:3000/api/products";
const itemsSection = document.querySelector("#items");

// Récupération des données de l'API
fetch(url)
  .then((products) => products.json())
  .then((products) => displayProducts(products));

//Création des éléments + rajout des données dans les balises
function displayProducts(products) {
  itemsSection.innerHTML = "";
  for (let i = 0; i < products.length; i += 1) {
    itemsSection.innerHTML += `
    <a href="./product.html?_id=${products[i]._id}"> 
      <article>
        <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
        <h3 class="productName">${products[i].name}</h3> 
        <p class="productDescription">${products[i].description}</p>
      </article>
    </a>`;
  }
}
