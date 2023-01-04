// Récupération orderId
const params = new URL(document.location).searchParams;
const orderId = params.get("orderId");
// Affichage du numéro de commande
document.getElementById("orderId").textContent = orderId;