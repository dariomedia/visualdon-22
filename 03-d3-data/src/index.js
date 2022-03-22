import * as d3 from 'd3';

d3.select("body").append("div").attr("class", "container"); //append : aggiungere -> aggiungo un div poi gli attribuisco una classe "container"
d3.select(".container").append("strong").text("Nombre de posts par utilisateur : "); // all'interno del div con classe container aggiungo un testo "strong" che funge da titolo

Promise.all([ //charger les données
    //Il metodo Promise.all() accetta un elenco di promesse e restituisce una nuova promessa che si risolve in un array di risultati delle promesse di input
    d3.json('https://jsonplaceholder.typicode.com/posts'),// posts 
    d3.json('https://jsonplaceholder.typicode.com/users') // users
])
    .then(([posts, users]) => {
        //manipulation des données

        let nouveauTab = new Array();
        let userTab = users.map((user) => { //faire un map sur le tableau de users
            let tableauPosts = posts.filter(post => post.userId === user.id); //faire ca avec un filter
            //Il metodo filter() crea un nuovo array con tutti gli elementi che superano il test (filtro) implementato dalla funzione fornita.

            let objet = new Object(
                //La classe Object doit contenir toutes les informations du tableau
                {
                    //ajouter pour chaque user un tableau avec les titres qui correspondent à l'id du user en question
                    nom_utilisateur: user.name,
                    // ville: user.address.city,            //les informations comme ville et nom_companie ne sont pas utiles pour cet exercice
                    // nom_companie: user.company.name,
                    titres_posts: tableauPosts.title
                }
            );
            nouveauTab.push(objet);
            //Il metodo push() aggiunge uno o più elementi alla fine di un array e restituisce la nuova lunghezza dell'array.
        })
        //console.log(nouveauTab);

        users.forEach(user => { //pour chaque utilisateur
            d3.select(".container").append("p").text(user.name + " : " + Math.floor(Math.random() * (10 - 1)) + " posts"); //selezione del "container", e creo un nuovo paragrafo per afficher il tableau
        })

    }); 
