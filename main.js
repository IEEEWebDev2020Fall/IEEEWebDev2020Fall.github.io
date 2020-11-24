//Global
const selectBox = document.querySelector(".select-box");
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");
const playPauseButton = document.querySelector(".button");
const arrayContainer = document.querySelector(".arrayContainer")
const barContainer = document.querySelector(".barContainer")
const mySvg = document.querySelector("#svg")
const sizeSlider = document.querySelector(".size-control input")

const svgWidth = window.innerWidth - 100;
const svgHeight = 400;
const svgMargins = 15;
const barHeightMin = 5;
const barHeightMax = svgHeight - 15;
const barPaddingMultiplier = 1 / 5;
var array = [];
var svg;
var svgElement;
var barPadding;
var barWidth;

barContainer.style.width = (svgWidth + svgMargins * 2) + "px";
barContainer.style.height = (svgHeight + svgMargins * 2) + "px";
arrayContainer.style.width = (svgWidth + svgMargins * 2) + "px";
mySvg.style.margin = svgMargins + "px";
sizeSlider.max = svgWidth / 3;
sizeSlider.value = (parseInt(sizeSlider.min) + parseInt(sizeSlider.max)) / 3;

selectBox.addEventListener("mouseover", () => {
    if (!optionsContainer.classList.contains("active")) {
        optionsContainer.classList.add("active");
    }
})

selectBox.addEventListener("mouseout", () => {
    if (optionsContainer.classList.contains("active")) {
        optionsContainer.classList.remove("active");
    }
})

optionsList.forEach(o => {
    o.addEventListener("click", () => {
        selected.innerHTML = o.querySelector("label").innerHTML;
        optionsContainer.classList.remove("active");
    })
})

function randomNum(min, max) {

    return (Math.floor(Math.random() * (max - min + 1) + min));

}

function setUp(x = sizeSlider.value) {
    // make array
    array = [];
    for (let i = 0; i < x; i++) {
        array.push(randomNum(barHeightMin, barHeightMax))
    }

    // make box
    svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    svgElement = document.getElementById("svg");

    // determine padding
    paddingAndWidth = svgWidth / array.length;
    barPadding = paddingAndWidth * barPaddingMultiplier;
    barWidth = paddingAndWidth - barPadding;

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