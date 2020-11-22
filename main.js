//Global
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");

const playPauseButton = document.querySelector(".button");
const arrayContainer = document.querySelector(".arrayContainer")

var array = [];
var svg;
var svgElement;
const svgWidth = 500;
const svgHeight = 400;
var barPadding;
var barWidth;

selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active")
})

optionsList.forEach(o => {
    o.addEventListener("click", () => {
        selected.innerHTML = o.querySelector("label").innerHTML
        optionsContainer.classList.toggle("active")
    })
})

function randomNum(min, max) {

    return (Math.floor(Math.random() * (max - min + 1) + min));

}

function setUp(x) {
    // make array
    array = [];
    for (let i = 0; i < x; i++) {
        array.push(randomNum(5, 350))
    }

    // make box
    svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    svgElement = document.getElementById("svg");

    // determine padding
    paddingAndWidth = svgWidth / array.length;
    barPadding = paddingAndWidth / 5;
    barWidth = paddingAndWidth - barPadding;

    barWidth = (svgWidth / array.length) - barPadding;
    // set up bars
    displayBars();
}

function displayBars() {
    // clean up bars
    while (svgElement.hasChildNodes()) {
        svgElement.removeChild(svgElement.firstChild);
    }

    // add the bars
    var barChart = svg.selectAll("rect")
        .data(array)
        .enter()
        .append("rect")
        .attr("y", function(d) {
            return svgHeight - d;
        })
        .attr("height", function(d) {
            return d;
        })
        .attr("width", barWidth)
        .attr("transform", function(d, i) {
            var translate = [(barWidth + barPadding) * i, 0];
            return "translate(" + translate + ")";
        });
}

function playAndPauseClicked() {
    playPauseButton.classList.toggle("playing");
    if (arrayContainer.classList.contains("playing")) {
        // start sorting
    } else {
        // pause sort
    }
}