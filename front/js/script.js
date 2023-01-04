const url = "http://localhost:3000/api/products";
//const itemsSection = document.querySelector("#items");

// Récupération des données de l'API
fetch(url)
  .then((products) => products.json())
  .then((products) => displayProducts(products));

//Récupération des données et intégration dans le DOM

function displayProducts(products) {
	for (let product of products) {

		// Insertion de l'élément "a"
		let productLink = document.createElement("a");
		productLink.setAttribute("href", `product.html?id=${product._id}`);
		document.querySelector("#items").appendChild(productLink);
		// Insertion de l'élément "article"
		let productArticle = document.createElement("article");
		productLink.appendChild(productArticle);
		// Insertion de l'image "img"
		let productImg = document.createElement("img");
		productImg.setAttribute("src", product.imageUrl);
		productImg.setAttribute("alt", product.altTxt);
		productArticle.appendChild(productImg);
		// Insertion du titre "h3"
		let productTitle = document.createElement("h3");
		productTitle.classList.add("productName");
		productTitle.textContent = product.name;
		productArticle.appendChild(productTitle);
		// Insertion de la description alt text "p"
		let productDescription = document.createElement("p");
		productDescription.classList.add("productDescription");
		productDescription.textContent = product.description;
		productArticle.appendChild(productDescription);
	}
}