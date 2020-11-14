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
    
    
    const array = [];
    for (let i = 0; i < x; i++){
        array.push(randomNumArray(5,10))
    }
    document.getElementById("demo").innerHTML = array;
    return array;
}

function numOfBars(){
    x = document.getElementById("myRange").value;
    //document.getElementById("demo").innerHTML = x;
    var val = x.value;

    setUp(val);

}


document.getElementById("demo").innerHTML = setUp();




