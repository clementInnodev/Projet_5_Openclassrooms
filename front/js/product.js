"use strict";

/**
 * fonction qui récupère l'id du produit dans l'url et le retourne
 * 
 * @return {id} ( string ) retourne l'id d'un produit
 */
const getId = () => {
    let url = window.location.href
    url = new URL(url)
    const id = url.searchParams.get("id")
    return id
}


/**
 * fonction qui fait un requête GET à une API Node, récupère et retourne les données
 * 
 * @param {string} id l'id du produit
 * @param {string} url l'url de l'API
 * @return {data} retourne une promesse qui contiendra les données du produit sous la d'un objet
 */
const getProduct = async function (id, url) {
    try {
        const response = await fetch(url + id)
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


/**
 * fonction qui traite les données pour les affichés
 * 
 * @param {data} object les données du produit
 */
const createProductElement = (data) => {

    // récupère l'élément à l'intérieur duquel le produit sera ajouté
    const section = document.querySelector('.item')

    // récupère la balise title
    const pageTitle = document.querySelector("title")

    // modifie le titre de la page avec le nom du produit affiché
    pageTitle.textContent = data.name

    // crée un tableau qui condtiendra le code html pour chaque couleur du produit
    const colorOptions = data.colors.map((el) => `<option value="${el}">${el}</option>`)

    // création du code HTML pour le produit
    const html = `
            <article>
                <div class="item__img">
                    <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="item__content">

                    <div class="item__content__titlePrice">
                        <h1 id="title">${data.name}</h1>
                        <p>Prix : <span id="price">${data.price}</span>€</p>
                    </div>

                    <div class="item__content__description">
                        <p class="item__content__description__title">Description :</p>
                        <p id="description">${data.description}</p>
                    </div>

                    <div class="item__content__settings">
                        <div class="item__content__settings__color">
                            <label for="color-select">Choisir une couleur :</label>
                            <select name="color-select" id="colors">
                                <option value="">--SVP, choisissez une couleur --</option>
                                ${colorOptions.join('')}
                            </select>
                        </div>

                        <div class="item__content__settings__quantity">
                            <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                            <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
                        </div>
                    </div>

                    <div class="item__content__addButton">
                        <button id="addProductToCart">Ajouter au panier</button>
                    </div>

                </div>
            </article>
        `

    // insère le code html dans le bloc précédement ciblé
    section.innerHTML = html
}


/**
 * fonction permet l'ajout du produit dans le panier
 * 
 * @param {data} object les données du produit
 */
const addProductToCart = function (data) {

    // création du variable qui servira de panier et qui peut être vide si le localStorage ne contient pas de produit
    let cart = JSON.parse(localStorage.cart || "[]")

    // récupère le champ couleur et quantité
    const select = document.getElementById('colors')
    const inputQuantity = document.getElementById('quantity')

    // récupère la valeur du champ couleur et quantité
    const color = select.value
    const quantity = inputQuantity.value

    // traitement de la valeur des champs et des erreurs potentielles
    if ( color === '' && quantity == 0 ){
        alert('veuillez choisir une couleur et ajouter au moins un article')
    } else if ( color === '' && quantity > 100 ) {
        alert('veuillez choisir une couleur et ajouter un maximum de 100 articles')
    } else if ( color !== '' && quantity == 0 ) {
        alert('veuillez ajouter au moins un article')
    } else if ( color !== '' && quantity > 100 ) {
        alert('veuillez ajouter un maximum de 100 articles')
    } else if ( color === '' && ( quantity >= 1 && quantity < 100) ){
        alert('veuillez choisir une couleur')
    } else if ( quantity < 0 ){
        alert('Veuillez renseigner une quantité valide ( 1 à 100 )')
    } else {
        //Vérifie si le produit ajouté est déjà présent dans le panier et le stock dans la variable le cas échéant
        const existingProduct = cart.find(item => item.id === data._id && item.color === color)

        // si le produit existe, modifie sa quantité
        if (existingProduct) {
            existingProduct.quantity = parseInt(quantity) + parseInt(existingProduct.quantity) 
        } 

        // si le produit n'existait pas et que 'cart' est un array
        if ( !existingProduct && Array.isArray(cart)){
            // création d'un objet contenant les données du produit
            const objectToAdd = {
                id : data._id,
                quantity : quantity,
                color : color
            }
            // insertion du produit dans le panier
            cart.push(objectToAdd)
        }

        // mise à jour du localStorage avec les produits présents dans le panier
        localStorage.setItem("cart", JSON.stringify(cart));
        alert('article ajouté avec succès')
    }
}


/**
 * fonction qui ajoute un évènement au bouton permettant l'ajout d'un produit au panier
 * 
 * @param {data} object les données du produit
 */
const addBtnEvent = function (data) {
    const formBtn = document.getElementById('addProductToCart')
    formBtn.addEventListener("click", function(){ addProductToCart(data) }, false)
}

// Appel de la fonction getProduct
getProduct(getId(), "http://localhost:3000/api/products/")
/**
 * fonction qui après la résolution de la promesse, récupère et transmet les données
 * 
 * @param {data} array les données sous la forme d'un tableau d'objet
 */
.then((data) => {
    createProductElement(data)
    addBtnEvent(data)
})