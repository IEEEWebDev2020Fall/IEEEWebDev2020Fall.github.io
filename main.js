const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".options");

selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active")
})

var randomArray = [];

function randomNumArray(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);

}

function test(){
    console.log("hi");
}