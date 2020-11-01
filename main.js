const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".options");

selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active")
})