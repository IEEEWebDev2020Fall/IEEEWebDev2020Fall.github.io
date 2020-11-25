 // Merge Sort
 const mergeSort = (array, startIndex, size, animations) => {

     if (size > 1) {
         const leftArraySize = Math.floor(size / 2);
         const rightArraySize = size - leftArraySize;

         mergeSort(array, startIndex, leftArraySize, animations);
         mergeSort(array, startIndex + leftArraySize, rightArraySize, animations);
         merge(array, startIndex, leftArraySize, rightArraySize, animations);
     }

 };

 const merge = (array, startIndex, leftArraySize, rightArraySize, animations) => {

     var tempArr = [];
     var copied = 0;
     var leftCopied = 0;
     var rightCopied = 0;

     while ((leftCopied < leftArraySize) && (rightCopied < rightArraySize)) {
         // Add comparison animation
         animations.push([startIndex + leftCopied, startIndex + leftArraySize + rightCopied]);
         animations.push([startIndex + leftCopied, startIndex + leftArraySize + rightCopied]);
         if (array[startIndex + leftCopied] < array[startIndex + leftArraySize + rightCopied]) {
             // Add overide animation
             animations.push([startIndex + copied, array[startIndex + leftCopied]]);
             tempArr[copied++] = array[startIndex + leftCopied++];
         } else {
             // Add overide animation
             animations.push([startIndex + copied, array[startIndex + leftArraySize + rightCopied]]);
             tempArr[copied++] = array[startIndex + leftArraySize + rightCopied++];
         }
     }

     while (leftCopied < leftArraySize) {
         animations.push([startIndex + leftCopied, startIndex + leftCopied]);
         animations.push([startIndex + leftCopied, startIndex + leftCopied]);
         animations.push([startIndex + copied, array[startIndex + leftCopied]]);
         tempArr[copied++] = array[startIndex + leftCopied++];
     }

     while (rightCopied < rightArraySize) {
         animations.push([startIndex + leftArraySize + rightCopied, startIndex + leftArraySize + rightCopied]);
         animations.push([startIndex + leftArraySize + rightCopied, startIndex + leftArraySize + rightCopied]);
         animations.push([startIndex + copied, array[startIndex + leftArraySize + rightCopied]]);
         tempArr[copied++] = array[startIndex + leftArraySize + rightCopied++];
     }

     for (let i = 0; i < tempArr.length; i++) {
         array[i + startIndex] = tempArr[i];
     }

 };

 //Global
 const selectBox = document.querySelector(".select-box");
 const selected = document.querySelector(".selected");
 const optionsContainer = document.querySelector(".options-container");
 const optionsList = document.querySelectorAll(".option");
 const playPauseButton = document.querySelector(".button");
 const arrayContainer = document.querySelector(".arrayContainer");
 const barContainer = document.querySelector(".barContainer");
 const mySvg = document.querySelector("#svg");
 const sizeSlider = document.querySelector(".size-control input");
 const speedSlider = document.querySelector(".speed-control input");

 const svgWidth = window.innerWidth - 100;
 const svgHeight = 400;
 const svgMargins = 15;
 const barHeightMin = 5;
 const barHeightMax = svgHeight - 15;
 const barPaddingMultiplier = 1 / 5;
 var doesNeedRefresh = false;
 var array = [];
 var animations = [];
 var animationStartingIndex = 0;
 var timers = [];
 var svg;
 var svgElement;
 var barPadding;
 var barWidth;

 barContainer.style.width = (svgWidth + svgMargins * 2) + "px";
 barContainer.style.height = (svgHeight + svgMargins * 2) + "px";
 arrayContainer.style.width = (svgWidth + svgMargins * 2) + "px";
 mySvg.style.margin = svgMargins + "px";
 sizeSlider.max = svgWidth / 6;
 sizeSlider.min = 10
 sizeSlider.value = (parseInt(sizeSlider.min) + parseInt(sizeSlider.max)) / 3;

 selectBox.addEventListener("mouseover", () => {
     if (!optionsContainer.classList.contains("active")) {
         optionsContainer.classList.add("active");
     }
 });

 selectBox.addEventListener("mouseout", () => {
     if (optionsContainer.classList.contains("active")) {
         optionsContainer.classList.remove("active");
     }
 });

 optionsList.forEach(o => {
     o.addEventListener("click", () => {
         selected.innerHTML = o.querySelector("label").innerHTML;
         optionsContainer.classList.remove("active");
     })
 });

 function randomNum(min, max) {

     return (Math.floor(Math.random() * (max - min + 1) + min));

 }

 function setUp(x = sizeSlider.value) {
     // clean up 
     playPauseButton.classList.remove("playing");
     array = [];
     animations = [];
     for (let i = timers.length - 1; i >= 0; i--) {
         window.clearTimeout(timers[i]);
         timers.pop();
     }

     // make array
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
     if (playPauseButton.classList.contains("playing")) {
         if (doesNeedRefresh) {
             setUp();
         }

         if (animations.length === 0) {
             // make animatons
             mergeSort(array.slice(), 0, array.length, animations);
         }

         // start sorting
         startPlay();
     } else {
         // pause sort
         pausePlay();
     }
 }

 function startPlay() {
     const beginIndex = animationStartingIndex
     for (let i = beginIndex; i < animations.length; i++) {
         const bars = document.querySelectorAll("rect");
         const isComparison = i % 3 !== 2;
         if (isComparison) {
             const [bar1Index, bar2Index] = animations[i];
             const bar1 = bars[bar1Index];
             const bar2 = bars[bar2Index];
             const color = i % 3 === 0 ? "red" : "rgb(78, 169, 255)";
             timers.push(setTimeout(() => {
                 bar1.style.fill = color;
                 bar2.style.fill = color;
                 animationStartingIndex++;
             }, (i - beginIndex) * 5));
         } else {
             timers.push(setTimeout(() => {
                 const [bar1Index, newHeight] = animations[i];
                 const bar1 = bars[bar1Index];
                 bar1.setAttribute("height", newHeight);
                 bar1.setAttribute("y", svgHeight - newHeight);
                 animationStartingIndex++;
                 if (animationStartingIndex >= animations.length) {
                     animationStartingIndex = 0;
                     doesNeedRefresh = true;
                     playPauseButton.classList.toggle("playing");
                 }
             }, (i - beginIndex) * 5));
         }
     }
 }

 function pausePlay() {
     for (let i = timers.length - 1; i >= 0; i--) {
         window.clearTimeout(timers[i]);
         timers.pop();
     }
     doesNeedRefresh = false;
 }