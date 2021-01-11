import React, { Component } from "react";
import "./SortingVisualizer.css";
import {
  getMergeSortAnimation,
  getBubbleSortAnimation,
  getInsertionSortAnimation,
  getQuickSortAnimation,
} from "../SortingAlgorithms/Algorithms.js";
import * as d3 from "d3";
import PropTypes from "prop-types";

export default class SortingVisualizer extends Component {
  state = {
    array: [],
    animations: [],
    animationStartingIndex: 0,
    timers: [],
    segmentSize: 10,
    barDefaultColor: "rgb(78, 169, 255)",
    barOrange: "rgb(255, 114, 20)",
    barGreen: "green",
    barRed: "red",
    barYellow: "yellow",
    barPurple: "purple",
    barSorted: "rgb(36, 80, 166)",
  };

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.setUp();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.arrayLength !== this.props.arrayLength) {
      this.setUp();
    }
    if (prevProps.isPlaying !== this.props.isPlaying) {
      this.playAndPauseClicked(this.props.isPlaying);
    }
    if (prevProps.algorithmSelected !== this.props.algorithmSelected) {
      this.setUp();
    }
    if (prevProps.sortingSpeed !== this.props.sortingSpeed) {
      if (this.props.isPlaying) {
        this.pausePlay();
        this.startPlay();
      }
    }
  }

  setUp(completion = null) {
    // clean up timers
    for (let i = this.state.timers.length - 1; i >= 0; i--) {
      window.clearTimeout(this.state.timers[i]);
      this.state.timers.pop();
    }

    // set svg frame
    d3.select("svg")
      .attr("width", this.props.svgWidth)
      .attr("height", this.props.svgHeight);

    // calculate bar parameters
    this.setState({
      barPadding:
        (this.props.svgWidth / this.props.arrayLength) *
        this.props.barPaddingMultiplier,
      barWidth:
        (this.props.svgWidth / this.props.arrayLength) *
        (1 - this.props.barPaddingMultiplier),
    });

    // get random array
    const array = [];
    for (let i = 0; i < this.props.arrayLength; i++) {
      array.push(randomNum(this.props.barHeightMin, this.props.barHeightMax));
    }

    // set array and clean up
    this.setState(
      {
        array: array,
        animations: [],
        animationStartingIndex: 0,
        timers: [],
      },
      completion
    );

    // clean up bar color
    const bars = document.querySelectorAll("rect");
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.fill = this.state.barDefaultColor;
    }
  }

  getAnimation() {
    if (this.props.algorithmSelected === "0") {
      getMergeSortAnimation(
        this.state.array.slice(),
        0,
        this.state.array.length,
        this.state.animations
      );
    } else if (this.props.algorithmSelected === "1") {
      getQuickSortAnimation(
        this.state.array.slice(),
        0,
        this.state.array.length - 1,
        this.state.animations
      );
    } else if (this.props.algorithmSelected === "2") {
      getBubbleSortAnimation(this.state.array.slice(), this.state.animations);
    } else {
      getInsertionSortAnimation(
        this.state.array.slice(),
        this.state.animations
      );
    }
  }

  playAndPauseClicked(isPlaying) {
    if (isPlaying) {
      // Check if the animation is created already
      if (this.state.animations.length === 0) {
        // make animations
        this.getAnimation();
      } else {
        // Sorting was paused
        // If the sorting ended, restart
        if (this.state.animationStartingIndex == this.state.animations.length) {
          this.setUp(() => {
            this.getAnimation();
            // start sorting
            this.startPlay();
          });
        }
      }
      // start sorting
      this.startPlay();
    } else {
      // pause sort
      this.pausePlay();
    }
  }

  startPlay() {
    if (this.props.algorithmSelected === "0") {
      this.playMerge();
    } else if (this.props.algorithmSelected === "1") {
      this.playQuick();
    } else if (this.props.algorithmSelected === "2") {
      this.playBubble();
    } else {
      this.playInsertion();
    }
  }

  pausePlay() {
    for (let i = this.state.timers.length - 1; i >= 0; i--) {
      window.clearTimeout(this.state.timers[i]);
      this.state.timers.pop();
    }
  }

  playMerge() {
    // Start from where it left off
    const beginIndex = this.state.animationStartingIndex;
    for (
      let i = beginIndex;
      i < this.state.segmentSize + beginIndex &&
      i < this.state.animations.length;
      i++
    ) {
      this.state.timers.push(
        setTimeout(() => {
          const bars = document.querySelectorAll("rect");
          const isComparison = i % 4 !== 2 && i % 4 !== 3;
          if (isComparison) {
            const [bar1Index, bar2Index] = this.state.animations[i];
            const bar1 = bars[bar1Index];
            const bar2 = bars[bar2Index];
            const color =
              i % 4 === 0 ? this.state.barOrange : this.state.barDefaultColor;
            bar1.style.fill = color;
            bar2.style.fill = color;
          } else {
            const [bar1Index, newHeight] = this.state.animations[i];
            const bar1 = bars[bar1Index];
            if (i % 4 === 2) {
              bar1.style.fill = this.state.barRed;
            } else {
              bar1.style.fill = this.state.barDefaultColor;
              bar1.setAttribute("height", newHeight);
              bar1.setAttribute("y", this.props.svgHeight - newHeight);
            }
          }
          this.state.animationStartingIndex++;
          if (
            this.state.animationStartingIndex >= this.state.animations.length
          ) {
            this.props.pausePlay();
          } else if (i >= this.state.segmentSize + beginIndex - 1) {
            this.playMerge();
          }
        }, (i - beginIndex + 1) * this.props.sortingSpeed)
      );
    }
  }

  playBubble() {
    let beginIndex = this.state.animationStartingIndex;
    for (
      let i = beginIndex;
      i < this.state.segmentSize + beginIndex &&
      i < this.state.animations.length;
      i++
    ) {
      this.state.timers.push(
        setTimeout(() => {
          const index = this.state.animations[i][1];
          const bars = document.querySelectorAll("rect");
          const bar1 = bars[index];
          const bar2 = bars[index + 1];
          if (i % 3 === 0) {
            const isLast = this.state.animations[i][0];
            if (isLast) {
              bar1.style.fill = this.state.barSorted;
            } else {
              bar1.style.fill = this.state.barOrange;
              bar2.style.fill = this.state.barOrange;
            }
          } else if (i % 3 === 1) {
            const isSwap = this.state.animations[i][0];
            if (isSwap) {
              const bar1Height = bar1.getAttribute("height");
              const bar2Height = bar2.getAttribute("height");
              bar1.setAttribute("height", bar2Height);
              bar1.setAttribute("y", this.props.svgHeight - bar2Height);
              bar2.setAttribute("height", bar1Height);
              bar2.setAttribute("y", this.props.svgHeight - bar1Height);
            } else {
              bar1.style.fill = this.state.barGreen;
              bar2.style.fill = this.state.barGreen;
            }
          } else {
            const isSorted = this.state.animations[i][0];
            if (!isSorted) {
              bar2.style.fill = this.state.barDefaultColor;
            } else {
              bar2.style.fill = this.state.barSorted;
            }
            bar1.style.fill = this.state.barDefaultColor;
          }
          this.state.animationStartingIndex++;
          if (
            this.state.animationStartingIndex >= this.state.animations.length
          ) {
            this.props.pausePlay();
          } else if (i >= this.state.segmentSize + beginIndex - 1) {
            this.playBubble();
          }
        }, (i - beginIndex + 1) * this.props.sortingSpeed)
      );
    }
  }

  playInsertion() {
    let beginIndex = this.state.animationStartingIndex;
    for (
      let i = beginIndex;
      i < this.state.segmentSize + beginIndex &&
      i < this.state.animations.length;
      i++
    ) {
      this.state.timers.push(
        setTimeout(() => {
          const [animationType, animationNum, index] = this.state.animations[i];
          const bars = document.querySelectorAll("rect");
          const bar1 = bars[index];
          const bar2 = bars[index + 1];
          if (animationType === 0) {
            // highlight key bar
            bar1.style.fill = this.state.barRed;
          } else if (animationType === 1) {
            if (animationNum === 0) {
              // color bar
              bar1.style.fill = this.state.barOrange;
            } else if (animationNum === 1) {
              // swap
              const bar1Height = bar1.getAttribute("height");
              const bar2Height = bar2.getAttribute("height");
              bar1.setAttribute("height", bar2Height);
              bar1.setAttribute("y", this.props.svgHeight - bar2Height);
              bar2.setAttribute("height", bar1Height);
              bar2.setAttribute("y", this.props.svgHeight - bar1Height);
              bar1.style.fill = this.state.barRed;
              bar2.style.fill = this.state.barOrange;
            } else {
              // color to default
              bar1.style.fill = this.state.barDefaultColor;
              bar2.style.fill = this.state.barDefaultColor;
            }
          } else {
            if (animationNum === 0) {
              // color bar
              if (index >= 0) {
                bar1.style.fill = this.state.barGreen;
              }
            } else {
              // color back both bars
              if (index >= 0) {
                bar1.style.fill = this.state.barDefaultColor;
              }
              bar2.style.fill = this.state.barDefaultColor;
            }
          }
          this.state.animationStartingIndex++;
          if (
            this.state.animationStartingIndex >= this.state.animations.length
          ) {
            this.props.pausePlay();
          } else if (i >= this.state.segmentSize + beginIndex - 1) {
            this.playInsertion();
          }
        }, (i - beginIndex + 1) * this.props.sortingSpeed)
      );
    }
  }

  playQuick() {
    const beginIndex = this.state.animationStartingIndex;
    for (
      let i = beginIndex;
      i < this.state.segmentSize + beginIndex &&
      i < this.state.animations.length;
      i++
    ) {
      this.state.timers.push(
        setTimeout(() => {
          const bars = document.querySelectorAll("rect");
          const animationType = this.state.animations[i][0];
          if (animationType === 0) {
            // color
            const colorType = this.state.animations[i][1];
            const index = this.state.animations[i][2];
            const bar1 = bars[index];
            let color = this.state.barDefaultColor;
            if (colorType === 0) {
              color = this.state.barYellow;
            } else if (colorType === 1) {
              color = this.state.barGreen;
            } else if (colorType === 2) {
              color = this.state.barPurple;
            } else if (colorType === 3) {
              color = this.state.barSorted;
            }
            bar1.style.fill = color;
          } else if (animationType === 1) {
            // swap
            const index1 = this.state.animations[i][1];
            const index2 = this.state.animations[i][2];
            const bar1 = bars[index1];
            const bar2 = bars[index2];
            const bar1Height = bar1.getAttribute("height");
            const bar2Height = bar2.getAttribute("height");
            const bar1Color = bar1.style.fill;
            const bar2Color = bar2.style.fill;
            bar1.setAttribute("height", bar2Height);
            bar1.setAttribute("y", this.props.svgHeight - bar2Height);
            bar2.setAttribute("height", bar1Height);
            bar2.setAttribute("y", this.props.svgHeight - bar1Height);
            bar1.style.fill = bar2Color;
            bar2.style.fill = bar1Color;
          } else {
            // de-color
            bars.forEach((bar) => {
              if (bar.style.fill === this.state.barYellow) {
                bar.style.fill = this.state.barSorted;
              } else if (
                bar.style.fill !== this.state.barDefaultColor &&
                bar.style.fill !== this.state.barSorted
              ) {
                bar.style.fill = this.state.barDefaultColor;
              }
            });
          }
          this.state.animationStartingIndex++;
          if (
            this.state.animationStartingIndex >= this.state.animations.length
          ) {
            this.props.pausePlay();
          } else if (i >= this.state.segmentSize + beginIndex - 1) {
            this.playQuick();
          }
        }, (i - beginIndex + 1) * this.props.sortingSpeed)
      );
    }
  }

  render() {
    return (
      <div>
        <div
          className="arrayContainer"
          style={{
            width: this.props.svgWidth + this.props.svgMargins * 2 + "px",
          }}
        >
          <div
            className="barContainer"
            style={{
              width: this.props.svgWidth + this.props.svgMargins * 2 + "px",
              height: this.props.svgHeight + this.props.svgMargins * 2 + "px",
            }}
          >
            <svg
              id="svg"
              style={{
                margin: this.props.svgMargins + "px",
              }}
            >
              {this.state.array.map((value, index) => (
                <rect
                  key={index}
                  y={this.props.svgHeight - value}
                  height={value}
                  width={this.state.barWidth}
                  transform={
                    "translate(" +
                    [(this.state.barWidth + this.state.barPadding) * index, 0] +
                    ")"
                  }
                ></rect>
              ))}
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

SortingVisualizer.propTypes = {
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
  svgMargins: PropTypes.number.isRequired,
  barHeightMin: PropTypes.number.isRequired,
  barHeightMax: PropTypes.number.isRequired,
  barPaddingMultiplier: PropTypes.number.isRequired,
  arrayLength: PropTypes.number.isRequired,
  sortingSpeed: PropTypes.number.isRequired,
  algorithmSelected: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  pausePlay: PropTypes.func.isRequired,
};

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
