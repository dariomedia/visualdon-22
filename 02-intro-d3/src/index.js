import * as d3 from 'd3';

// C'est ici que vous allez écrire les premières lignes en d3!

const WIDTH = 800
const HEIGHT = 300

const div = d3.select(".mon-svg")
    .append("svg")
    .attr("class", "svgCircle")//ajouter attribut avec valeur de class = ""
    .attr("width", WIDTH)       //children[0]
    .attr("height", HEIGHT)
    .append("circle")
    .attr("cx", "50")
    .attr("cy", "50")
    .attr("r", "40px")
    .attr("id", "circle1")

d3.select("svg")    //text
    .append("text")
    .attr("x", "50")
    .attr("y", "100")
    .text("premier paragraph");

d3.select(".svgCircle")         //children[1]
    .append("circle")
    .attr("cx", "150")
    .attr("cy", "150")
    .attr("fill", "#E92528")
    .attr("r", "40px")
    .attr("id", "circle2")

d3.select("svg")    //text
    .append("text")
    .attr("x", "100")
    .attr("y", "200")
    .text("deuxième paragraph");

d3.select(".svgCircle")         //children[2]
    .append("circle")
    .attr("cx", "250")
    .attr("cy", "250")
    .attr("r", "40px")
    .attr("id", "circle3");

d3.select("svg")    //text
    .append("text")
    .attr("x", "200")
    .attr("y", "300")
    .text("troisième paragraph");

let svg = d3.select('svg');

//Deplacement circle1
svg.select("#circle1")
    .attr("cx", 100); //50+50 = 100

//Deplacement circle2
svg.select("#circle2")
    .attr("cx", 200);   //50+150 = 200

//gestion du click sur le troisième cercle
svg.select("#circle3").on("click", function () {
    svg.selectAll("circle")
        .attr("cx", 250);
})



// PARTIE RECTANGLES

// ## Données 
// Vous avez à disposition les données suivantes: ```[20, 5, 25, 8, 15]```
// Ces données représentent la hauteur des rectangles que vous allez dessiner avec 
// la méthode ```data(data).enter()``` que nous avons vue en cours. 
// Les rectangles auront une largeur fixe de 20px et doivent être 
// alignés en bas l'un à côté de l'autre 
// (comme un graphique en batons ! :bar_chart: )

// mes données:
let data = [20, 5, 25, 8, 15];

// Creation du SVG 
let svgRect = d3.select("#bar-chart")
    .append("svg")

let bars = svgRect.append('g')
    .attr('class', 'bars');

// utilisation de la methode data() et création de barres
bars.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * 23) //i * 23 distance entre les barres
    .attr('y', (d) => 100 - d) //-d pour alignement en bas
    .attr('width', 20)
    .attr('height', (d) => d);
