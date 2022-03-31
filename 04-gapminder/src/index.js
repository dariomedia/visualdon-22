import * as d3 from 'd3'

// 1 - GRAPHIQUE STATIQUE
//utilisation des données de gapminder
// un projet qui a pour but de mieux faire comprendre les tendances 
// d'indicateurs sociaux, démographiques et économiques à travers des graphiques interactif

// Pour importer les 3 jeux des données
import PIB from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv' //PIB par habitant par pays et pour chaque année depuis 1800
import esperanceVie from '../data/life_expectancy_years.csv'    //espérance de vie par pays et pour chaque année depuis 1800
import population from '../data/population_total.csv'       //population depuis 1800



//Partie 01
// Le premier rendu implique la visualisation statique des données data/gapminder.csv 
// pour l'année 2021 sous forme de Scatter/Bubble Chart. 
// Vous aurez sur l'axe X les données de PIB par habitant et sur l'axe Y l'espérance de vie. 
// La taille des cercles devra être proportionnelle à la population du pays.


// Marges du graphique
const margin = { top: 20, right: 50, bottom: 40, left: 40 },
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// Création d'un élément svg graphique avec ses marges dans le div #staticGraph
const svg = d3
    .select('#staticGraph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


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


