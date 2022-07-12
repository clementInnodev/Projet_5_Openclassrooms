"use strict";

/**********************************************/
/*********** Récupération du panier **********/
/**********************************************/


// création d'une variable globale qui servira de panier et contiendra les produits présents dans le localStorage sous forme de tableau d'object
const cart = JSON.parse(localStorage.cart || "[]")


/**
 * fonction qui fait un requête GET à une API Node, récupère et retourne les données ( une seule requête http )
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

const hiddeForm = () => {
    if ( cart == null || cart == undefined || cart == '' || cart.length == 0 ){
        document.querySelector('.cart__order').style.display = 'none'
    }
}


/*********************************************
/*********** Affichage du panier **********
/**********************************************/


/**
 * fonction qui récupère les données d'un produit et retourne son bloc HTML
 * 
 * @param {string} product_id l'id du produit
 * @param {string} product_color la couleur du produit
 * @param {string} product_img le lien vers l'image du produit
 * @param {string} product_name le nom du produit
 * @param {string} product_price le prix du produit
 * @param {string} product_quantity la quantité du produit
 * @return {html} retourne le code html avec les données du produit
 */
const generateProductCartHtml = function (product_id, product_color, product_img, product_name, product_price, product_quantity) {
    return `
            <article class="cart__item" data-id="${product_id}" data-color="${product_color}">
                <div class="cart__item__img">
                    <img src="${product_img}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                    <h2>${product_name}</h2>
                    <p>${product_color}</p>
                    <p>${product_price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product_quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                    </div>
                </div>
            </article>
    `
}


/*********************************************
/*********** Total price & qunatity **********
/**********************************************/


/**
 * fonction qui récupère la quantité et le prix total du panier puis l'affiche
 * 
 * @param {object} data tableau contenant les données de chaques produits du panier
 */
const displayTotalPriceQuantity = function (data, cart) {
    const priceElement = document.getElementById('totalPrice')
    const quantityElement = document.getElementById('totalQuantity')
    
    priceElement.textContent = getTotalPrice(data, cart)
    quantityElement.textContent = getTotalQuantity(cart)
}


/**
 * fonction qui calcule le montant total du panier puis le retourne
 * 
 * @param {object} data tableau contenant les données de chaques produits du panier
 * @return {number} totalPrice retourne le montant total du panier
 */
const getTotalPrice = function (data, cart) {
    let totalPrice = 0
    cart.forEach(cartProduct => {
        data.forEach(dataProduct => {
            if ( cartProduct.id == dataProduct._id ) {
                totalPrice = parseInt(totalPrice) + ( parseInt(dataProduct.price) * parseInt(cartProduct.quantity) )
            }
        })
    });
    return totalPrice
}


/**
 * fonction qui calcule la quantité totale d'article dans le panier puis le retourne
 * 
 * @param {object} data tableau contenant les données de chaques produits du panier
 * @return {number} totalQuantity la quantité totale d'article dans le panier
 */
const getTotalQuantity = function (data) {
    let totalQuantity = 0
    data.forEach(element => {
        totalQuantity = parseInt(totalQuantity) + parseInt(element.quantity)
    });
    return totalQuantity
}



/***********************************************
/************* Suppression article *************
/***********************************************/


/**
 * fonction qui ajoute un évènement de suppression permettant de supprimer un article du panier
 * 
 */
const addDeleteEvent = function () {
    const deleteItems = document.querySelectorAll('.deleteItem')

    deleteItems.forEach(element => {
        element.addEventListener('click', function () { deleteElement(getElementToDelete(element)) })
    });
}


/**
 * fonction qui récupère et retourne l'élément parent contenant les données ( id & color ) de l'élément qui a déclanché l'évènement
 * 
 * @param {object} element l'élément sur lequel l'évènement a eu lieu
 * @return {object} element l'élément parent contenant les données ( id & color )
 */
const getElementToDelete = function (element) {
    while ( !element.hasAttribute('data-id') ){
        element = element.parentElement
    }
    return element
}


/**
 * fonction qui supprime l'élément du panier et met à jour le localStorage
 * 
 * @param {object} element l'élément à supprimer
 */
const deleteElement = function (elementToDelete){
    const id = elementToDelete.getAttribute('data-id')
    const color = elementToDelete.getAttribute('data-color')

    cart.forEach(element => {
        if( element.id == id && element.color == color ){
            const index = cart.indexOf(element)
            cart.splice(index, 1)
            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload()
        }
    });
}



/***********************************************
/************ Modification quantity ************
/***********************************************/


/**
 * fonction qui ajoute un évènement de modification permettant de modifier la quantité d'un article du panier
 * 
 */
const addModifyEvent = function () {
    const deleteItems = document.querySelectorAll('.itemQuantity')

    deleteItems.forEach(element => {
        element.addEventListener('change', function () { modifyElement( getElementToModify(element), element.value ) })
    });
}


/**
 * fonction qui récupère et retourne l'élément parent contenant les données ( id & color ) de l'élément qui a déclanché l'évènement
 * 
 * @param {object} element l'élément sur lequel l'évènement a eu lieu
 * @return {object} element l'élément parent contenant les données ( id & color )
 */
const getElementToModify = function (element) {
    while ( !element.hasAttribute('data-id') ) {
        element = element.parentElement
    }
    return element
}


/**
 * fonction qui modifie la quantité du produit et met à jour le localStorage
 * 
 * @param {object} elementToModify l'élément contenant les données ( id & color )
 * @param {number} newQuantity la nouvelle quantité 
 */
const modifyElement = function (elementToModify, newQuantity) {
    const id = elementToModify.getAttribute('data-id')
    const color = elementToModify.getAttribute('data-color')

    cart.forEach(element => {
        if ( element.id == id && element.color == color ){
            if ( parseInt(newQuantity) < 0 ){
                alert('Veuillez renseigner une quantité valide')
                location.reload()
            } else if ( parseInt(newQuantity) == 0 ){
                const confirmation = confirm('Voulez-vous supprimer cet article ?')
                if( confirmation ){
                    deleteElement(elementToModify) 
                } else {
                    location.reload()
                }
            } else {
                element.quantity = parseInt(newQuantity)
                localStorage.setItem("cart", JSON.stringify(cart));
                location.reload()
            }
        }
    });
}


/************************************************************/
/****************** Formulaire Vérification *****************/
/************************************************************/



/**
 * fonction qui ajoute un évènement de vérification du formulaire
 * 
 */
const addVerifInputEvent = () => {
    const txtRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
    const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/

    const btn = document.getElementById('order')

    btn.addEventListener('click', function (e) { formVerif(txtRegex, emailRegex, e) })
}


/**
 * fonction qui lance la vérification de tout les inputs du formulaire
 * 
 * @param {object} regextxt regex empéchant les chiffres
 * @param {object} regexmail regex pour email
 * @param {event} event l'évènement déclencheur
 */
const formVerif = (regextxt, regexmail, event) => {
    verifNameForm(event, regextxt)
    emailFormVerif(event, regexmail)
    locationFormVerif(event, regextxt)
}


/**
 * fonction qui vérifie que les champs nom et prénom ne contiennent pas de chiffres
 * 
 * @param {object} regex regex qui permettra la vérification
 * @param {event} event l'évènement déclencheur
 */
const verifNameForm = (event, regex) => {
    const firstName_input = document.getElementById('firstName')
    const lastName_input = document.getElementById('lastName')
    
    const firstName_errorMsg = document.getElementById('firstNameErrorMsg')
    const lastName_errorMsg = document.getElementById('lastNameErrorMsg')

    if (!regex.test(firstName_input.value) && firstName_input.value != '' ){
        firstName_errorMsg.textContent = 'Veuillez renseigner un prénom valide'
        event.preventDefault()
    } else if ( firstName_input.value == '' ){
        firstName_errorMsg.textContent = 'Veuillez renseigner un prénom'
        event.preventDefault()
    } else {
        firstName_errorMsg.textContent = ''
    }

    if (!regex.test(lastName_input.value)  && lastName_input.value != '' ){
        lastName_errorMsg.textContent = 'Veuillez renseigner un nom valide'
        event.preventDefault()
    } else if ( lastName_input.value == '' ){
        lastName_errorMsg.textContent = 'Veuillez renseigner un nom'
        event.preventDefault()
    } else {
        lastName_errorMsg.textContent = ''
    }
}


/**
 * fonction qui vérifie que le champ email contienne bien un email valide
 * 
 * @param {object} regex regex qui permettra la vérification
 * @param {event} event l'évènement déclencheur
 */
const emailFormVerif = (event, regex) => {
    const email_input = document.getElementById('email')
    const email_errorMsg = document.getElementById('emailErrorMsg')

    if (!regex.test(email_input.value) && email_input.value != '' ){
        email_errorMsg.textContent = 'Veuillez renseigner un email valide'
        event.preventDefault()
    } else if ( email_input.value == '' ){
        email_errorMsg.textContent = 'Veuillez renseigner un email'
        event.preventDefault()
    } else {
        email_errorMsg.textContent = ''
    }
}


/**
 * fonction qui vérifie que les champs adress et city soient valide
 * 
 * @param {object} regex regex qui permettra la vérification
 * @param {event} event l'évènement déclencheur
 */
const locationFormVerif = (event, regex) => {
    const address_input = document.getElementById('address')
    const city_input = document.getElementById('city')
    
    const address_errorMsg = document.getElementById('addressErrorMsg')
    const city_errorMsg = document.getElementById('cityErrorMsg')

    if (!regex.test(city_input.value) && city_input.value != '' ){
        city_errorMsg.textContent = 'Veuillez renseigner une ville valide'
        event.preventDefault()
    } else if ( city_input.value == '' ){
        city_errorMsg.textContent = 'Veuillez renseigner une ville'
        event.preventDefault()
    } else {
        city_errorMsg.textContent = ''
    }

    if ( address_input.value == '' ){
        address_errorMsg.textContent = 'Veuillez renseigner une adresse'
        event.preventDefault()
    } else {
        address_errorMsg.textContent = ''
    }

}



/************************************************************/
/******************** Envoi du formulaire *******************/
/************************************************************/


/**
 * fonction qui ajoute un évènement d'envoie des données à l'API
 * 
 */
const addSubmitFormEvent = () => {
    const formulaire = document.querySelector('form')

    formulaire.addEventListener('submit', function (e) { sendForm(makeJsonData())

        // Quand les données ont bien été envoyé à l'API récupère la réponse
        .then((response) => {
            console.log('ok')
            const urlWhereRedirect = "./confirmation.html?id=" + response.orderId
            // Vide le localStorage
            localStorage.clear()
            // Redirige vers la page de confirmation grâce à l'url contenant l'id de la commande
            window.location.replace(urlWhereRedirect)
        })
        .catch((e) => {
            console.error(e)
        })
    })
}


/**
 * fonction qui crée un objet JSON contenant les données de contact et un tableau des produits puis les retournes sous forme de chaine JSON
 * 
 * @return {string} données de contact et tableau de produits
 */
const makeJsonData = () => {
    const firstName_input = document.getElementById('firstName')
    const lastName_input = document.getElementById('lastName')
    const address_input = document.getElementById('address')
    const city_input = document.getElementById('city')
    const email_input = document.getElementById('email')

    // crée l'object contact contenant les informations de l'utilisateur renseignées grâce au formulaire
    const contact = {
        firstName: firstName_input.value,
        lastName: lastName_input.value,
        address: address_input.value,
        city: city_input.value,
        email: email_input.value,
    };

    // crée le tableau contenant les id's des produits présent dans le panier
    const products = cart.map( product => product.id )

    // transforme les données en chaîne JSON
    const jsonData = JSON.stringify({ contact, products });
    return jsonData;
}


/**
 * fonction qui envoie les données de la commande à l'API
 * 
 * @param {string} json données de la commande 
 */
const sendForm = async function (json) {
    try {
        const response = await fetch('http://localhost:3000/api/products/order', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : json,
        })
        if (response.ok) {
            const sendResponse = await response.json()
            return sendResponse
        } else {
            console.error('Retour du serveur :  ' + response.status)
        }
    } catch (e) {
        console.log(e)
    }
}



/***********************************************/
/****************** Execution ******************/
/***********************************************/


// Appel de la fonction getProducts
getProducts('http://localhost:3000/api/products')

/**
 * fonction qui après la résolution de la promesse, récupère et transmet les données
 * 
 * @param {data} array les données sous la forme d'un tableau d'objet
 */
.then((data) => {
    
    // gère l'affichage des produits présents dans le panier
    const cartItem_location = document.getElementById('cart__items')
    let firstPassage = true
    
    data.forEach(element => {
        cart.forEach(product => {
            if ( product.id == element._id ){
                const html = generateProductCartHtml(product.id, product.color, element.imageUrl, element.name, element.price, product.quantity)
                if ( firstPassage ) {
                    cartItem_location.innerHTML = html
                    firstPassage = false
                } else {
                    cartItem_location.insertAdjacentHTML('beforeend', html)
                }
            }
        })
    })

    hiddeForm()
    displayTotalPriceQuantity(data, cart)
    addDeleteEvent()
    addModifyEvent()
    addVerifInputEvent()
    addSubmitFormEvent()
})