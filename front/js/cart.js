// Récupération des produits du LocalStorage
let productsInLocalStorage = JSON.parse(localStorage.getItem("cartItems"));
// console.log(productsInLocalStorage);

// Fonction qui permet d'afficher le ou les produit(s) du panier
async function displayCart() {
	// Récupération de la section qui contient le ou les article(s)
	const positionEmptyCart = document.getElementById("cart__items");
	// Si le localstorage est vide
	if (productsInLocalStorage === null || productsInLocalStorage == 0) {
		let emptyCartParagraph = document.createElement("p");
		emptyCartParagraph.textContent = "Votre panier est vide";
		positionEmptyCart.appendChild(emptyCartParagraph);
		// Si le localstorage contient des produits
	} else {
		for (product in productsInLocalStorage) {
			const items = await getProductDetails(productsInLocalStorage[product].id);
			// console.log(items);

			// Insertion de l'élément "article"
			let productArticle = document.createElement("article");
			document.querySelector("#cart__items").appendChild(productArticle);
			productArticle.className = "cart__item";
			productArticle.setAttribute(
				"data-id",
				productsInLocalStorage[product].id
			);
			productArticle.setAttribute(
				"data-color",
				productsInLocalStorage[product].color
			);
			// Insertion de l'élément "div"
			let productDivImg = document.createElement("div");
			productArticle.appendChild(productDivImg);
			productDivImg.className = "cart__item__img";
			// Insertion de l'image
			let productImg = document.createElement("img");
			productImg.src = items.imageUrl;
			productImg.alt = items.altTxt;
			productDivImg.appendChild(productImg);
			// Insertion de l'élément "div"
			let productItemContent = document.createElement("div");
			productItemContent.className = "cart__item__content";
			productArticle.appendChild(productItemContent);
			// Insertion de l'élément "div" description
			let productItemContentDescription = document.createElement("div");
			productItemContentDescription.className =
				"cart__item__content__description";
			productItemContent.appendChild(productItemContentDescription);
			// Insertion du titre h2
			let productTitle = document.createElement("h2");
			productTitle.textContent = items.name;
			productItemContentDescription.appendChild(productTitle);
			// Insertion de la couleur
			let productColor = document.createElement("p");
			productColor.textContent = productsInLocalStorage[product].color;
			productItemContentDescription.appendChild(productColor);
			// Insertion du prix
			let productPrice = document.createElement("p");
			// Variable totalPriceItem permet de calculer le prix total de chaque produit par rapport à sa quantité
			const totalPriceItem =
				items.price * productsInLocalStorage[product].quantity;
			productPrice.textContent = totalPriceItem + " €";
			productItemContentDescription.appendChild(productPrice);
			// Insertion de l'élément "div"
			let productItemContentSettings = document.createElement("div");
			productItemContentSettings.className = "cart__item__content__settings";
			productItemContent.appendChild(productItemContentSettings);
			// Insertion de l'élément "div"
			let productItemContentSettingsQuantity = document.createElement("div");
			productItemContentSettingsQuantity.className =
				"cart__item__content__settings__quantity";
			productItemContentSettings.appendChild(
				productItemContentSettingsQuantity
			);
			// Insertion de l'élément "p"
			let productQte = document.createElement("p");
			productItemContentSettingsQuantity.appendChild(productQte);
			productQte.textContent = "Qté : ";
			// Insertion de la quantité
			let productQuantity = document.createElement("input");
			productQuantity.className = "itemQuantity";
			productQuantity.setAttribute("type", "number");
			productQuantity.setAttribute("min", "1");
			productQuantity.setAttribute("max", "100");
			productQuantity.setAttribute("name", "itemQuantity");
			productQuantity.setAttribute(
				"value",
				productsInLocalStorage[product].quantity
			);
			productItemContentSettingsQuantity.appendChild(productQuantity);
			// Insertion de l'élément "div"
			let productItemContentSettingsDelete = document.createElement("div");
			productItemContentSettingsDelete.className =
				"cart__item__content__settings__delete";
			productItemContentSettings.appendChild(productItemContentSettingsDelete);
			// Insertion de "p" supprimer
			let productSupprimer = document.createElement("p");
			productSupprimer.className = "deleteItem";
			productSupprimer.textContent = "Supprimer";
			productItemContentSettingsDelete.appendChild(productSupprimer);
		}
		grandTotal();
		changeQuantity();
		deleteProduct();
	}
}

displayCart();

// Fonction qui permet d'afficher le nombre total d'articles et du prix total du panier
async function grandTotal() {
	// Récupération des produits du localStorage
	let productsInLocalStorage = JSON.parse(localStorage.getItem("cartItems"));
	// variable totalQuantity crée et initialisée à 0
	let totalQuantity = 0;
	// variable totalPrice crée et initialisée à 0
	let totalPrice = 0;
	// Boucle for pour parcourir tous les produits stockés dans le localStorage
	for (product in productsInLocalStorage) {
		// Appel de la fonction getProductDetails pour récupérer les infos de l'API (le prix)
		const article = await getProductDetails(productsInLocalStorage[product].id);
		// console.log(article);
		// Variable totalQuantity est remplacée par la quantité de tous les produits du localStorage
		totalQuantity += parseInt(productsInLocalStorage[product].quantity);
		// Variable totalPrice est remplacée par le prix total des produits du localStorage
		totalPrice += parseInt(
			article.price * productsInLocalStorage[product].quantity
		);
	}
	// Récupération du total des quantités et le contenu textuel est changé par la valeur du variable totalQuantity
	document.getElementById("totalQuantity").textContent = totalQuantity;
	// Récupération du prix total et le contenu textuel est changé par la valeur du variable totalPrice
	document.getElementById("totalPrice").textContent = totalPrice;
}

// Fonction qui permet d'afficher le prix total de chaque produit par rapport à sa quantité
async function singleProductPrice(dataId, dataColor, productPrice) {
	// console.log(dataId, dataColor);

	// Récupération des produits du localStorage
	let productsInLocalStorage = JSON.parse(localStorage.getItem("cartItems"));
	// variable price crée et initialisée à 0
	let price = 0;
	// // Appel de la fonction getProductDetails pour récupérer les infos de l'API (le prix)
	const article = await getProductDetails(dataId);
	// Boucle for pour parcourir tous les produits présents dans le localStorage
	for (product in productsInLocalStorage) {
		// console.log(article);

		// Si le panier / localStorage contient déjà 1 article de même id et même couleur
		if (
			productsInLocalStorage[product].id == dataId &&
			productsInLocalStorage[product].color == dataColor
		) {
			// Variable price est remplacée par un nouveau prix en fonction de sa quantité du produit concerné dans le localStorage
			price += parseInt(
				article.price * productsInLocalStorage[product].quantity
			);
			// Récupération du prix et le contenu textuel est changé par la valeur du variable price
			productPrice.textContent = price + " €";
		}
	}
	grandTotal();
}

// Fonction qui gère la modification de la quantité
function changeQuantity() {
	const quantityInputs = document.querySelectorAll(".itemQuantity");
	quantityInputs.forEach(function (quantityInput) {
		quantityInput.addEventListener("change", function (event) {
			event.preventDefault();
			let inputValue = Number(event.target.value);
			let productPrice = event.target
				.closest("article")
				.querySelector(".cart__item__content__description p:nth-child(3)");
			const dataId = event.target.closest("article").dataset.id;
			// console.log(dataId);
			const dataColor = event.target.closest("article").dataset.color;
			// console.log(dataColor);
			let cartItems = localStorage.getItem("cartItems");
			let items = JSON.parse(cartItems);

			items = items.map(function (item, index) {
				if (item.id === dataId && item.color === dataColor) {
					item.quantity = inputValue;
				}
				return item;
			});

			// Plusieurs conditions permettant de vérifer la quantité renseignée
			if (!Number.isInteger(inputValue)) {
				alert(
					"Veuillez renseigner un nombre entier compris entre 1 et 100\r\n"
				);
				return;
			} else if (inputValue == 0) {
				alert("Veuillez renseigner une quantité\r\n");
				return;
			} else if (inputValue > 100) {
				alert("La quantité maximale autorisée est de 100\r\n");
				return;
			} else if (inputValue < 0) {
				alert("Veuillez ne pas saisir de valeur négative!\r\n");
				return;
			}

			let itemsStr = JSON.stringify(items);
			localStorage.setItem("cartItems", itemsStr);

			singleProductPrice(dataId, dataColor, productPrice);
		});
	});
}

// Fonction qui gère la suppression d'un produit
function deleteProduct() {
	const deleteButtons = document.querySelectorAll(".deleteItem");
	deleteButtons.forEach(function (deleteButton) {
		deleteButton.addEventListener("click", function (event) {
			event.preventDefault();
			let productsInLocalStorage = JSON.parse(
				localStorage.getItem("cartItems")
			);
			const deleteId = event.target.closest("article").dataset.id;
			// console.log(deleteId);
			const deleteColor = event.target.closest("article").dataset.color;

			// console.log(deleteColor);
			productsInLocalStorage = productsInLocalStorage.filter(function (
				element
			) {
				return !(element.id == deleteId && element.color == deleteColor);
			});
			// console.log(productsInLocalStorage);
			deleteConfirm = window.confirm(
				"Etes vous sûr de vouloir supprimer cet article ?"
			);
			if (deleteConfirm == true) {
				localStorage.setItem(
					"cartItems",
					JSON.stringify(productsInLocalStorage)
				);
				alert("Article supprimé avec succès");
				// L'élément article est retiré du DOM
				deleteButton.closest("article").remove();
			}
			grandTotal();
		});
	});
}

// Récupération des produits de l'API
async function getProductDetails(productId) {
	try {
		const response = await fetch(
			"http://localhost:3000/api/products/" + productId
		);
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			throw new Error("Échec du chargement de l'API");
		}
	} catch (error) {
		console.log(error.message);
	}
}

// Forumulaire
function form() {
	// // Création des expressions régulières
	let nameRegex = /^[a-zA-Z\-çñàéèêëïîôüù ]{2,}$/;
	let addressRegex = /^[0-9a-zA-Z-çñàéèêëïîôüù ]{3,}$/;
	let emailRegex = /^[a-zA-Z-_]+[@]{1}[a-zA-Z]+[.]{1}[a-z]{2,10}$/;
	// Variables pour récupérer les id des champs de formulaire
	const firstName = document.getElementById("firstName");
	const lastName = document.getElementById("lastName");
	const address = document.getElementById("address");
	const city = document.getElementById("city");
	const email = document.getElementById("email");
	// Ecoute de la modification du prénom
	firstName.addEventListener("input", function (event) {
		event.preventDefault();
		// Validation prénom
		if (nameRegex.test(firstName.value) == false || firstName.value == "") {
			document.getElementById("firstNameErrorMsg").textContent =
				"Prénom non valide";
			return false;
		} else {
			document.getElementById("firstNameErrorMsg").textContent = "";
			return true;
		}
	});
	// Ecoute de la modification du nom
	lastName.addEventListener("input", function (event) {
		event.preventDefault();
		// Validation nom
		if (nameRegex.test(lastName.value) == false || lastName.value == "") {
			document.getElementById("lastNameErrorMsg").textContent =
				"Nom non valide";
			return false;
		} else {
			document.getElementById("lastNameErrorMsg").textContent = "";
			return true;
		}
	});
	// Ecoute de la modification de l'adresse
	address.addEventListener("input", function (event) {
		event.preventDefault();
		// Validation adresse
		if (addressRegex.test(address.value) == false || address.value == "") {
			document.getElementById("addressErrorMsg").textContent =
				"Adresse non valide";
			return false;
		} else {
			document.getElementById("addressErrorMsg").textContent = "";
			return true;
		}
	});
	// Ecoute de la modification de la ville
	city.addEventListener("input", function (event) {
		event.preventDefault();
		// Validation ville
		if (nameRegex.test(city.value) == false || city.value == "") {
			document.getElementById("cityErrorMsg").textContent = "Ville non valide";
			return false;
		} else {
			document.getElementById("cityErrorMsg").textContent = "";
			return true;
		}
	});
	// Ecoute de la modification de l'adresse mail
	email.addEventListener("input", function (event) {
		event.preventDefault();
		// Validation email
		if (emailRegex.test(email.value) == false || email.value == "") {
			document.getElementById("emailErrorMsg").textContent = "Email non valide";
			return false;
		} else {
			document.getElementById("emailErrorMsg").textContent = "";
			return true;
		}
	});

	let order = document.getElementById("order");
	// Ecouter le bouton commander
	order.addEventListener("click", function (event) {
		event.preventDefault();
		// Récupération des produits du LocalStorage
		let productsInLocalStorage = JSON.parse(localStorage.getItem("cartItems"));
		// Création d'un tableau afin de récuperer les données de l'utilisateur attendu par l'API
		let contact = {
			firstName: firstName.value,
			lastName: lastName.value,
			address: address.value,
			city: city.value,
			email: email.value,
		};
		// Dans le cas où l'on envoi du formulaire de contact est vide
		if (
			firstName.value === "" ||
			lastName.value === "" ||
			address.value === "" ||
			city.value === "" ||
			email.value === ""
		) {
			alert("Vous devez renseigner tous les champs pour passer la commande !");
		}
		// Dans le cas où un des champs ne correspond pas aux condition exigés
		else if (
			nameRegex.test(firstName.value) == false ||
			nameRegex.test(lastName.value) == false ||
			addressRegex.test(address.value) == false ||
			nameRegex.test(city.value) == false ||
			emailRegex.test(email.value) == false
		) {
			alert("Merci de renseigner correctement vos coordonnées !");
		}
		// Si le localStorage est vide
		else if (productsInLocalStorage === null || productsInLocalStorage == 0) {
			alert(
				"Vous devez ajouter au moins un produit au panier pour passer commande !"
			);
		} else {
			// Construction d'un array depuis le local storage
			let products = [];
			productsInLocalStorage.forEach(function (order) {
				products.push(order.id);
			});

			let pageOrder = { contact, products };

			// Appel à l'api order pour envoyer les tableaux
			async function getOrderId() {
				try {
					const response = await fetch(
						"http://localhost:3000/api/products/order",
						{
							method: "POST",
							headers: {
								Accept: "application/json",
								"Content-type": "application/json",
							},
							body: JSON.stringify(pageOrder),
						}
					);
					if (response.ok) {
						const data = await response.json();
						// console.log(data);
						window.location.href =
							"./confirmation.html?orderId=" + data.orderId;
						localStorage.clear();
					} else {
						throw new Error("Échec du chargement de l'API");
					}
				} catch (error) {
					console.log(error.message);
				}
			}

			getOrderId();

			// Une autre façon de faire avec .then() et .catch()
			/*
			fetch("http://localhost:3000/api/products/order", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-type": "application/json",
				},
				body: JSON.stringify(pageOrder),
			})
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					// console.log(data);
					window.location.href = "./confirmation.html?orderId=" + data.orderId;
					localStorage.clear();
				})
				.catch(function (error) {
					console.log("une erreur est survenue");
				});
            */
		}
	});
}

form();