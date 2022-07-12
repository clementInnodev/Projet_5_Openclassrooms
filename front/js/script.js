"use strict";

/**
 * fonction qui fait un requête GET à une API Node, récupère et retourne les données
 * 
 * @param {string} url l'url de l'API.
 * @return {data} retourne une promesse qui contiendra les données sous la forme d'un tableau d'objet(produits)
 */

const getProducts = async function (url) {
    try {
        const response = await fetch(url)
        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            console.error('Retour du serveur :  ' + response.status)
        }
    } catch (e) {
        console.log(e)
    }
}

// Appel de la fonction getProducts
getProducts('http://localhost:3000/api/products')
/**
 * fonction qui après la résolution de la promesse, récupère et traite les données ( affichage des produits )
 * 
 * @param {data} array les données sous la forme d'un tableau d'objet
 */
.then((data) => {

    // récupère l'élément à l'intérieur duquel chaque produit sera ajouté
    const section = document.getElementById("items")

    //création d'un tableau contenant le code html pour chaque produit
    const html = data.map((product) => {
        return `
        <a href="./product.html?id=${product._id}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>
    `
    })

    section.innerHTML = html.join('')
}) 
.catch((e) => {
    console.error(e)
})