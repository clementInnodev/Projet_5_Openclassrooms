"use strict";

/**
 * fonction qui récupère et retourne l'id de la commande présente dans l'url
 * 
 * @return {string} l'id de la commande
 */
const getOrderId = () => {

    let url = window.location.href
    url = new URL(url)
    const orderId = url.searchParams.get("id")

    return orderId
    
}


/**
 * fonction qui affiche l'id de la commande dans l'html
 * 
 */
const insertOrderId = () => {

    const orderId = getOrderId()
    const orderIdElement = document.getElementById('orderId')

    orderIdElement.textContent = orderId

}


insertOrderId()