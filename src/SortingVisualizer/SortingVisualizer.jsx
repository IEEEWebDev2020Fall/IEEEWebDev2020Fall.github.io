import React, { Component } from "react";
import "./SortingVisualizer.css";
import {
  getMergeSortAnimation,
  getBubbleSortAnimation,
} from "../SortingAlgorithms/Algorithms.js";
import * as d3 from "d3";
import PropTypes from "prop-types";

export default class SortingVisualizer extends Component {
  state = {
    array: [],
    animations: [],
    animationStartingIndex: 0,
    timers: [],
    playSpeed: 25,
    segmentSize: 10,
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
      bars[i].style.fill = "rgb(78, 169, 255)";
    }
  }

  getAnimation() {
    if (this.props.algorithmSelected === "2") {
      getBubbleSortAnimation(this.state.array.slice(), this.state.animations);
    } else {
      getMergeSortAnimation(
        this.state.array.slice(),
        0,
        this.state.array.length,
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
            console.log(this.state.animations);
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
    if (this.props.algorithmSelected === "2") {
      this.playBubble();
    } else {
      this.playMerge();
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
    for (let i = beginIndex; i < this.state.animations.length; i++) {
      const bars = document.querySelectorAll("rect");
      const isComparison = i % 3 !== 2;
      if (isComparison) {
        const [bar1Index, bar2Index] = this.state.animations[i];
        const bar1 = bars[bar1Index];
        const bar2 = bars[bar2Index];
        const color = i % 3 === 0 ? "red" : "rgb(78, 169, 255)";
        this.state.timers.push(
          setTimeout(() => {
            bar1.style.fill = color;
            bar2.style.fill = color;
            this.state.animationStartingIndex++;
          }, (i - beginIndex) * this.state.playSpeed)
        );
      } else {
        this.state.timers.push(
          setTimeout(() => {
            const [bar1Index, newHeight] = this.state.animations[i];
            const bar1 = bars[bar1Index];
            bar1.setAttribute("height", newHeight);
            bar1.setAttribute("y", this.props.svgHeight - newHeight);
            this.state.animationStartingIndex++;
            if (
              this.state.animationStartingIndex >= this.state.animations.length
            ) {
              this.props.pausePlay();
            }
          }, (i - beginIndex) * this.state.playSpeed)
        );
      }
    }
  }

  playBubble() {
    let beginIndex = this.state.animationStartingIndex;
    let timerIterator = beginIndex;
    const numSegments =
      (this.state.animations.length - beginIndex) / this.state.segmentSize;
    for (
      let i = beginIndex;
      i < this.state.segmentSize + beginIndex &&
      i < this.state.animations.length;
      i++
    ) {
      const [isSwap, index] = this.state.animations[i];
      const bars = document.querySelectorAll("rect");
      const bar1 = bars[index];
      const bar2 = bars[index + 1];
      this.state.timers.push(
        setTimeout(() => {
          bar1.style.fill = "red";
          bar2.style.fill = "red";
        }, (timerIterator - beginIndex) * this.state.playSpeed)
      );
      console.log((timerIterator - beginIndex) * this.state.playSpeed);
      this.state.timers.push(
        setTimeout(() => {
          if (isSwap) {
            const bar1Height = bar1.getAttribute("height");
            const bar2Height = bar2.getAttribute("height");
            bar1.setAttribute("height", bar2Height);
            bar1.setAttribute("y", this.props.svgHeight - bar2Height);
            bar2.setAttribute("height", bar1Height);
            bar2.setAttribute("y", this.props.svgHeight - bar1Height);
          } else {
            bar1.style.fill = "green";
            bar2.style.fill = "green";
          }
        }, (timerIterator - beginIndex + 1) * this.state.playSpeed)
      );
      this.state.timers.push(
        setTimeout(() => {
          bar1.style.fill = "rgb(78, 169, 255)";
          bar2.style.fill = "rgb(78, 169, 255)";
          this.state.animationStartingIndex++;
          if (
            this.state.animationStartingIndex >= this.state.animations.length
          ) {
            this.props.pausePlay();
          } else if (i >= this.state.segmentSize + beginIndex - 1) {
            this.playBubble();
          }
        }, (timerIterator - beginIndex + 2) * this.state.playSpeed)
      );
      timerIterator += 3;
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
  algorithmSelected: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  pausePlay: PropTypes.func.isRequired,
};

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
