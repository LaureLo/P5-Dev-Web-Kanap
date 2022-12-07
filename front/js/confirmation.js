// récupération de l'id pour l'ajouter dans le textContent

let orderId = new URLSearchParams(window.location.search).get("id");

let id_order = document.querySelector('#orderId');
id_order.textContent = orderId;