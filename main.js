const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".options");

selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active")
})

//Global
const array = [];

function randomNumArray(min, max){

    return (Math.floor(Math.random() * (max - min + 1) + min));

}

function setUp(x){
    //generates array of random number
    x = document.getElementById("myRange").value;
    //const array = [];
    for (let i = 0; i < x; i++){
        array.push(randomNumArray(5,10))
    }
    document.getElementById("demo").innerHTML = array;
    return array;
}

function numOfBars(){
    //setUp function generates array
    //numOfBars function changes the array everytime slider is moved. 
    x = document.getElementById("myRange").value;
    var val = x.value;
    setUp(val);
    displayBars();

}


document.getElementById("demo").innerHTML = setUp();


function displayBars(){

   // var svgWidth = svg.attr("width");
   // var svgHeight = svg.attr("height");
    var svgWidth = 500;
    var svgHeight = 300;
   var barPadding = 5;
    var barWidth = (svgWidth / array.length);
   /* var xScale = d3.scaleBand()
        .domain(d3.range(array.length))
        .rangeRound([50, svgWidth - 5]).padding(0.4);
    var yScale = d3.scaleLinear()
        .domain(d3.extend(array))
        .range ([30, svgHeight - 30]);

*/
var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

    var svg = d3.select('svg')
       .attr("width", svgWidth)
       .attr("height", svgHeight);

    var barChart = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function(d){
            return svgHeight - 10 - d;
        }) 
        .attr("height", function(d){
            return d;
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function(d,i){
            var translate = [barWidth * i, 0];
            return "translate(" + translate +")";
        });
}




