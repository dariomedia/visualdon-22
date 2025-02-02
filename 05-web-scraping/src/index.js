import jsdom from "jsdom";
import fetch from "isomorphic-fetch"
import puppeteer from "puppeteer"

console.log("Hello World!")



//faire un screenshot d'une page web avec puppeteer
async function screenshot(url) {    //creation function de screenshot
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"], //pour ne pas avoir de sandbox -> sandbox c'est :   le processus n'a pas accès à la mémoire, les fichiers, les réseaux, etc.
        headless: false,
        defaultViewport: {   //pour avoir une taille de fenêtre par défaut
            width: 1920,
            height: 1080
        }
    });
    const page = await browser.newPage();   //création de la page
    await page.goto(url);   //on va sur la page
    await page.screenshot({ path: "screenshot.png" });  //on fait un screenshot
    await browser.close();  //on ferme le navigateur
}

screenshot("https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops");






//afficher dans la console la liste de cantons et la population depuis l'url https://fr.wikipedia.org/wiki/Canton_(Suisse)#Donn%C3%A9es_cantonales
async function getCantons() {   //creation function de getCantons
    const url = "https://fr.wikipedia.org/wiki/Canton_(Suisse)#Donn%C3%A9es_cantonales";
    const response = await fetch(url);  //on récupère la réponse de la page
    const html = await response.text(); //on récupère le code html de la page
    const dom = new jsdom.JSDOM(html);  //on créé un objet dom
    const cantons = dom.window.document.querySelectorAll("#mw-content-text > div > table > tbody > tr > td > i"); //on récupère les cantons
    const cantonsPopulation = dom.window.document.querySelectorAll("#mw-content-text > div > table > tbody > tr > td > bdi"); //on récupère les populations
    for (let i = 0; i < cantons.length; i++) { //on parcours les cantons
        console.log(cantons[i].textContent + " : " + cantonsPopulation[i].textContent); //on affiche le contenu
    }
}
getCantons();




//webscraper le nom et le prix des produits depuis url https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops
async function getProducts() {   //creation function de getProducts
    const url = "https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops";
    const response = await fetch(url);  //on récupère la réponse de la page
    const html = await response.text(); //on récupère le code html de la page
    const dom = new jsdom.JSDOM(html);  //on créé un objet dom 

    const products = dom.window.document.querySelectorAll("div.thumbnail "); //on récupère les produits
    //const product = dom.window.document.querySelectorAll("div.thumbnail > h4"); //on récupère les noms des produits
    //const price = dom.window.document.querySelectorAll("div.thumbnail > p"); //on récupère les prix des produits
    //const ratings = dom.window.document.querySelectorAll("div.thumbnail > div.ratings > p"); //on récupère les notes des produits

    for (const product of products) {   //on parcours les produits
        const line = {  //on créé un objet line
            "product": product.querySelector("div.caption h4 a").textContent, //on récupère le nom du produit
            "price": product.querySelector("div.caption h4").textContent, //on récupère le prix du produit
            "ratings": product.querySelectorAll("div.ratings p span").length //on récupère le nombre de étoiles
        }
        console.log(line);  //on affiche le contenu de l'objet line dans la console
    }
}
getProducts();



