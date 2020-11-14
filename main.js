const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".options");

selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active")
})



function randomNumArray(min, max){

    return (Math.floor(Math.random() * (max - min + 1) + min));

}

function setUp(x){
    x = document.getElementById("myRange").value;
    document.getElementById("demo").innerHTML = x;
    
    const array = [];
    for (let i = 0; i < x; i++){
        array.push(randomNumArray(5,10))
    }
    
    return array;
}

function numOfBars(){
    x = document.getElementById("myRange").value;
    document.getElementById("demo").innerHTML = x;
    document.getElementById("bars").innerHTML = bars;

}


document.getElementById("demo").innerHTML = setUp();




