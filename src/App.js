import React, { Component } from "react";
import "./App.css";
import Header from "./Header/Header";
import SortingVisualizer from "./SortingVisualizer/SortingVisualizer";

const svgHeight = 400;
const svgMargins = 15;
const barHeightMin = 5;
const barHeightMax = svgHeight - 15;
const barPaddingMultiplier = 1 / 5;
const barMinWidth = 5;
const minSpeed = 10;
const maxSpeed = 200;
const speedSliderStepsCount = 50;
const speedSliderStepSize = (maxSpeed - minSpeed) / speedSliderStepsCount;

export default class App extends Component {
  state = {
    svgWidth: window.innerWidth - 100,
    sliderMax: [window.innerWidth - 100] / barMinWidth,
    sliderMin: 10,
    sortingSpeed:
      (speedSliderStepsCount - Math.floor(speedSliderStepsCount * 0.75)) *
        speedSliderStepSize +
      minSpeed,
    arrayLength: Math.floor(
      (parseInt(10) + parseInt([window.innerWidth - 100] / barMinWidth)) / 3
    ),
    sizeSliderDefault: Math.floor(
      (parseInt(10) + parseInt([window.innerWidth - 100] / barMinWidth)) / 3
    ),
    speedSliderDefault: Math.floor(speedSliderStepsCount * 0.85),
    speedSliderStepSize: speedSliderStepSize,
    speedSliderStepsCount: speedSliderStepsCount,
    isPlaying: false,
    algorithmSelected: "0",
  };

  arraySizeChanged = (size) => {
    this.pausePlay();
    this.setState({
      arrayLength: parseInt(size),
    });
  };

  sortingSpeedChanged = (input) => {
    this.setState({
      sortingSpeed: Math.floor(
        (speedSliderStepsCount - input) * speedSliderStepSize + minSpeed
      ),
    });
  };

  algorithmChanged = (id) => {
    if (id !== this.state.algorithmSelected) {
      this.setState({
        algorithmSelected: id,
        isPlaying: false,
      });
    }
  };

  playAndPauseClicked = (setTo) => {
    this.setState({
      isPlaying: setTo,
    });
  };

  pausePlay = () => {
    this.setState({
      isPlaying: false,
    });
  };

  render() {
    return (
      <div className="App">
        <Header
          arraySizeChanged={this.arraySizeChanged}
          sortingSpeedChanged={this.sortingSpeedChanged}
          algorithmChanged={this.algorithmChanged}
          sliderMax={this.state.sliderMax}
          sliderMin={this.state.sliderMin}
          sizeSliderDefault={this.state.sizeSliderDefault}
          speedSliderDefault={this.state.speedSliderDefault}
          speedSliderStepsCount={this.state.speedSliderStepsCount}
          playAndPauseClicked={this.playAndPauseClicked}
          isPlaying={this.state.isPlaying}
        />
        <SortingVisualizer
          svgWidth={this.state.svgWidth}
          svgHeight={svgHeight}
          svgMargins={svgMargins}
          barHeightMin={barHeightMin}
          barHeightMax={barHeightMax}
          barPaddingMultiplier={barPaddingMultiplier}
          arrayLength={this.state.arrayLength}
          sortingSpeed={this.state.sortingSpeed}
          algorithmSelected={this.state.algorithmSelected}
          isPlaying={this.state.isPlaying}
          pausePlay={this.pausePlay}
        />
      </div>
    );
  }
}
