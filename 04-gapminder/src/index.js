import * as d3 from 'd3'

// 1 - GRAPHIQUE STATIQUE
//utilisation des données de gapminder
// un projet qui a pour but de mieux faire comprendre les tendances 
// d'indicateurs sociaux, démographiques et économiques à travers des graphiques interactif

// Pour importer les 3 jeux des données
import PIB from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv' //PIB par habitant par pays et pour chaque année depuis 1800
import esperanceVie from '../data/life_expectancy_years.csv'    //espérance de vie par pays et pour chaque année depuis 1800
import population from '../data/population_total.csv'       //population depuis 1800

import map from "../data/worldmap.json";


//Partie 01 - Graphique statique

// Le premier rendu implique la visualisation statique des données data/gapminder.csv 
// pour l'année 2021 sous forme de Scatter/Bubble Chart. 
// Vous aurez sur l'axe X les données de PIB par habitant et sur l'axe Y l'espérance de vie. 
// La taille des cercles devra être proportionnelle à la population du pays.


// Marges du graphique
const margin = { top: 20, right: 50, bottom: 40, left: 40 },
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// Création d'un élément svg graphique avec ses marges dans le div #staticGraph
const svg = d3
    .select('#graphiqueStatique')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

svg.append("text")      //titre du graphique
    .attr("x", (width / 6))
    .attr("y", 50 - (margin.top / 2))
    .style("background-color", "white")
    .style("text-align", "center")
    .style("font-size", "30px")
    .style("font-weight", "bold")
    .style("color", "black")
    .text("Graphique statique");

// Création d'un nouveau tableau pour regrouper les informations désirées des 3 tableaux csv ()
let datas = [];

PIB.map(e => {
    datas.push({ //Appends new elements to the end of an array, and returns the new length of the array.
        pays: e.country,
        PIB: e["2021"],
        esperance_vie: d3
            .filter(esperanceVie, (ev) => ev.country == e.country)
            .map((d) => d["2021"])[0],
        population: d3
            .filter(population, (p) => p.country == e.country)
            .map((d) => d["2021"])[0]
    });
});

// ajout de l'axe x
const x = d3
    .scaleLinear()
    .domain([0, 100000])
    .range([0, width]);

svg.append('g')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));


// Ajout de l'axe y
const y = d3
    .scaleLinear()
    .domain([40, 100])
    .range([height, 0])

svg.append('g')
    .call(d3.axisLeft(y));

// Ajout d'une grandeur aux ronds
const z = d3
    .scaleLinear()
    .domain([200000, 1310000000]) //Sets the scale’s domain to the specified array of numbers. The array must contain two or more elements. 
    .range([1, 40]);    //augmenter le rayon des points

// Ajout des points -> circles
svg
    .append("g")
    .selectAll("dot")
    .data(datas)
    .join("circle")
    .attr("cx", (d) => x(cleanData(d.PIB)))
    .attr("cy", (d) => y(cleanData(d.esperance_vie)))
    .attr("r", (d) => z(cleanData(d.population) * 5))
    .style("fill", "crimson")
    .style("opacity", "0.8")
    .attr("stroke", "black");


//function fournie par Vincent ... merci Vincent :D
//cette fonction sert à expoliter les elements du graphique. Les données sont donc mieux lisibles

function cleanData(data) {
    if (isNaN(data)) {
        if (data.includes("k")) { // Passer de k à 1000
            const n = data.split("k")[0];
            return Number.parseFloat(n) * 1000;
        }
        else if (data.includes("M")) { // Passer de M à 1000000
            const n = data.split("M")[0];
            return Number.parseFloat(n) * 1000000;
        }
    }
    return data;
}


//Partie 02 - Cartographie

//Représentez les valeurs d'espérance de vie sur une carte.
//Trouver des données géographiques en format .geojson, et visualiser l'espérance de vie.

let width2 = screen.availWidth;
let height2 = screen.availHeight - 50;

let svg2 = d3
    .select('#cartographie')
    .append("svg")
    .attr("width", width2)
    .attr("height", height2);

svg2.append("text")      //titre du graphique
    .attr("x", (width2 / 8))
    .attr("y", 40 - (margin.top / 2))
    .style("background-color", "white")
    .style("text-align", "center")
    .style("font-size", "30px")
    .style("font-weight", "bold")
    .style("color", "black")
    .text("Cartographie");

// Création de la projection de la carte
let projection = d3
    .geoMercator()
    .center([0, 35])
    .scale(200)
    .translate([width2 / 2, height2 / 2]);

let path = d3
    .geoPath()
    .projection(projection);


// Donner une couleur à chaque pays en fonction de la quantité des personnes
let colorScale = d3
    .scaleLinear() // Créer une échelle linéaire de couleur entre deux valeurs qui sont dans le tableau range
    .domain([50, 100])
    .range(["#7FB3D5", "#154360"]); //tableau range contient les couleurs de la palette de couleur

// Disegno della cartina grazie a la variabile map -> che contiene le dati geojson (worldmap.json)

svg2
    .append("g")
    .selectAll("path")
    .data(map.features) //dati worldmap.json
    .enter()
    .append("path")
    .attr("d", path) //disegno della cartina e di tutti i paesi
    .attr("fill", function (d) {
        const data = monEsperanceDeVie(d["properties"]["name"]); // Couleurs des pays selon l'espérance de vie
        if (data) {
            return colorScale(data);
        }
        return "grey";
    })

//Creation d'une legende sur la base des couleurs sur la carte
//Représenter la légende à l'aide de la création d'un élement svg et de l'utilisation de la méthode call() 
//ne marche pas

// legend1 = function (container) {
//     const svg = d3.create('svg')
//         .attr('width', 300)
//         .attr('height', 130);

//     const legend = svg.append('g')
//         .attr('transform', 'translate(0, 10)')
//         .attr('color', 'colorScale')
//         .call(container => legend1(container));
//     return svg.node()
// }


//deuxieme option de creation d'une legende
// Define the fields of the data
// const fields = [50, 100];
// years = [1971, 1981, 1991, 2001, 2010],
//     fieldsById = d3.nest()
//         .key(function (d) { return d.id; })
//         .rollup(function (d) { return d[0]; })
//         .map(fields),
//     field = fields[0],
//     year = years[0],
//     currentKey;

// // Define the dropdown to select a field to scale by.
// var fieldSelect = d3.select("#field")
//     .on("change", function (e) {
//         // On change, update the URL hash
//         field = fields[this.selectedIndex];
//         location.hash = "#" + [field.id, year].join("/");
//     });
// // Populate its options with the fields available
// fieldSelect.selectAll("option")
//     .data(fields)
//     .enter()
//     .append("option")
//     .attr("value", function (d) { return d.id; })
//     .text(function (d) { return d.name; });

// // Define the dropdown to select a year.
// var yearSelect = d3.select("#year");

// // D3's "change" event is somehow not triggered when selecting the
// // dropdown value programmatically. Use jQuery's change event instead.
// $('#year').on("change", function (e) {
//     // On change, update the URL hash
//     year = years[this.selectedIndex];
//     location.hash = "#" + [field.id, year].join("/");
// });

// // Populate its options with the years available
// yearSelect.selectAll("option")
//     .data(years)
//     .enter()
//     .append("option")
//     .attr("value", function (y) { return y; })
//     .text(function (y) { return y; })



//Funzione relativa ai dati di speranza di vita delle popolazioni nel mondo
function monEsperanceDeVie(country) {
    // console.log(country);
    try {
        // se il paese è nel tableau (life_expectancy_years)
        const n = esperanceVie.find((myLifeCountry) => myLifeCountry.country === country);
        return n["2021"]; //affiche della data scritta: in questo caso "2021"
    }
    catch (e) {
        return null; //se il paese non è nel tableau (life_expectancy_years) allora non n'è nessun dato
    }
    //se nessun dato è presente il colore del paese sarà grigio
}

// L'obiettivo era di fare una barra temporale per visualizzare l'evolutione dei dati nella cartina nel tempo, dal 1800 fino al 2100, ma non funziona

// const minDate = new Date('1800-01-01'),
//     maxDate = new Date('2100-01-01'),
//     interval = maxDate.getFullYear() - minDate.getFullYear() + 1,
//     startYear = minDate.getFullYear();

// const sliderTime = d3.sliderBottom() //perché sliderBottom da problemi?
//     .min(d3.minDate)
//     .max(d3.maxDate)
//     .width(500)
//     .tickFormat(d3.timeFormat('%Y'))
//     .default(minDate);

// const gTime = d3
//     .select('div#slider-time')
//     .append('svg')
//     .attr('width', 600)
//     .attr('height', 100)
//     .append('g')
//     .attr('transform', 'translate(30,30)');

// gTime.call(sliderTime);




// Partie 03 - Animation

//Animer les données selon les années.
//En bref : faite le premier graphique, mais pour chaque année!
//Cela doit ressembler à la visualisation proposée par Gapminder.


//Le code de base est identique a celui du premier graphique
// Création d'un élément svg graphique avec ses marges dans le div #staticGraph
const svg3 = d3
    .select('#animation')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

svg3.append("text")      //titre du graphique
    .attr("x", (width / 6))
    .attr("y", 50 - (margin.top / 2))
    .style("background-color", "white")
    .style("text-align", "center")
    .style("font-size", "30px")
    .style("font-weight", "bold")
    .style("color", "black")
    .text("Animation");

// Création d'un nouveau tableau pour regrouper les informations désirées des 3 tableaux csv ()
let datas3 = [];

PIB.map(e => {
    datas3.push({ //Appends new elements to the end of an array, and returns the new length of the array.
        pays: e.country,
        PIB: e["2021"],
        esperance_vie: d3
            .filter(esperanceVie, (ev) => ev.country == e.country)
            .map((d) => d["2021"])[0],
        population: d3
            .filter(population, (p) => p.country == e.country)
            .map((d) => d["2021"])[0]
    });
});
//Idealmente i 3 valori in cui è indicato 2021 dovrebbero poter essere dinamici.
//Ho pensato ad una boucle for che parte da 1800 e finisce a 2100, ed in seguito associare quest'ultima alla barra temporale posta in basso del grafico


// ajout de l'axe x
const x3 = d3
    .scaleLinear()
    .domain([0, 100000])
    .range([0, width]);

svg3.append('g')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x3));


// Ajout de l'axe y
const y3 = d3
    .scaleLinear()
    .domain([40, 100])
    .range([height, 0])

svg3.append('g')
    .call(d3.axisLeft(y3));

// Ajout d'une grandeur aux ronds
const z3 = d3
    .scaleLinear()
    .domain([200000, 1310000000]) //Sets the scale’s domain to the specified array of numbers. The array must contain two or more elements. 
    .range([1, 40]);    //augmenter le rayon des points

// Ajout des points -> circles
svg3
    .append("g")
    .selectAll("dot")
    .data(datas3)
    .join("circle")
    .attr("cx", (d) => x(cleanData3(d.PIB)))
    .attr("cy", (d) => y(cleanData3(d.esperance_vie)))
    .attr("r", (d) => z(cleanData3(d.population) * 5))
    .style("fill", "crimson")
    .style("opacity", "0.8")
    .attr("stroke", "black");


//function fournie par Vincent ... merci Vincent :D
//cette fonction sert à expoliter les elements du graphique. Les données sont donc mieux lisibles

function cleanData3(data3) {
    if (isNaN(data3)) {
        if (data3.includes("k")) { // Passer de k à 1000
            const n = data3.split("k")[0];
            return Number.parseFloat(n) * 1000;
        }
        else if (data3.includes("M")) { // Passer de M à 1000000
            const n = data3.split("M")[0];
            return Number.parseFloat(n) * 1000000;
        }
    }
    return data3;
}


//Premier essai d'animation..
let IntervId;
function animateEssai() {
    // console.log(nIntervId);
    if (IntervId) {
        clearInterval(IntervId);
    }
    IntervId = setInterval(() => {
        // console.log(nIntervId);
        const year = slider.value().getFullYear();
        // console.log(year);
        if (year < 2100) { //2100 c'est le maximum d'année possible dans le tableau
            slider.value(new Date(year + 1, 0, 1));
        }
        else {
            clearInterval(IntervId);
        }
    }, 1000);
}
animateEssai();

//Animation avec slider.. toujours le mem problème

// const slider = d3.sliderBottom()
//     .min(new Date(1800, 0, 1))
//     .max(new Date(2100, 0, 1))
//     .step(1000 * 60 * 60 * 24 * 365)
//     .width(500)
//     .tickFormat(d3.timeFormat('%Y'))
//     .default(new Date(2000, 0, 1))
//     .on('onchange', val => {
//         d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
//     });


//Animation proposée par la prof dans son cours de VisualDon
// Variable où on stocke l'id de notre intervalle
let nIntervId;

function animate() {
    // regarder si l'intervalle a été déjà démarré
    if (!nIntervId) {
        nIntervId = setInterval(play, 1000);
    }
}

let i = 0;
function play() {
    // Recommencer si à la fin du tableau
    if (i == data.length - 1) {
        i = 0;
    } else {
        i++;
    }

    // Mise à jour graphique
    d3.select('#animation').text(data[i].annee)
    updateChart([data[i]]);
}

// Mettre en pause
function stop() {
    clearInterval(nIntervId);
    nIntervId = null;
}

// Fonction de mise à jour du graphique
function updateChart(data_iteration) {

    svg.selectAll('circle')
        .data(data_iteration)
        .join(enter => enter.append('circle')
            .attr('cx', 300)
            .attr('cy', 150).transition(d3.transition()
                .duration(500)
                .ease(d3.easeLinear)).attr('r', d => d.valeur),
            update => update.transition(d3.transition()
                .duration(500)
                .ease(d3.easeLinear)).attr('r', d => d.valeur),
            exit => exit.remove())
}

// Event listener
document.getElementById("play").addEventListener("click", animate);
document.getElementById("stop").addEventListener("click", stop);
;

