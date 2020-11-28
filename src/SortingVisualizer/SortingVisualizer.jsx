import React, { Component } from "react";
import "./SortingVisualizer.css";
import { getMergeSortAnimation } from "../SortingAlgorithms/Algorithms.js";
import * as d3 from "d3";
import PropTypes from "prop-types";

export default class SortingVisualizer extends Component {
  state = {
    array: [],
    animations: [],
    animationStartingIndex: 0,
    timers: [],
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

  playAndPauseClicked(isPlaying) {
    if (isPlaying) {
      // Check if the animation is created already
      if (this.state.animations.length === 0) {
        // make animations
        getMergeSortAnimation(
          this.state.array.slice(),
          0,
          this.state.array.length,
          this.state.animations
        );
      } else {
        // Sorting was paused
        // If the sorting ended, restart
        if (this.state.animationStartingIndex == this.state.animations.length) {
          this.setUp(() => {
            getMergeSortAnimation(
              this.state.array.slice(),
              0,
              this.state.array.length,
              this.state.animations
            );
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
          }, (i - beginIndex) * 5)
        );
      } else {
        this.state.timers.push(
          setTimeout(() => {
            // console.log(this.state.animations);
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
          }, (i - beginIndex) * 5)
        );
      }
    }
  }

  pausePlay() {
    for (let i = this.state.timers.length - 1; i >= 0; i--) {
      window.clearTimeout(this.state.timers[i]);
      this.state.timers.pop();
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
};

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
