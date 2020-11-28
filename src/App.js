import React, { Component } from "react";
import "./App.css";
import Header from "./Header/Header";
import SortingVisualizer from "./SortingVisualizer/SortingVisualizer";

// const svgWidth = window.innerWidth - 100;
const svgHeight = 400;
const svgMargins = 15;
const barHeightMin = 5;
const barHeightMax = svgHeight - 15;
const barPaddingMultiplier = 1 / 5;
// const arrayLength = 100

export default class App extends Component {
  state = {
    svgWidth: window.innerWidth - 100,
    sliderMax: [window.innerWidth - 100] / 6,
    sliderMin: 10,
    arrayLength: Math.floor(
      (parseInt(10) + parseInt([window.innerWidth - 100] / 6)) / 3
    ),
    sliderDefault: Math.floor(
      (parseInt(10) + parseInt([window.innerWidth - 100] / 6)) / 3
    ),
    isPlaying: false,
  };

  arraySizeChanged = (size) => {
    this.pausePlay();
    this.setState({
      arrayLength: parseInt(size),
    });
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
          sliderMax={this.state.sliderMax}
          sliderMin={this.state.sliderMin}
          sliderDefault={this.state.sliderDefault}
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
          isPlaying={this.state.isPlaying}
          playAndPauseClicked={this.playAndPauseClicked}
          pausePlay={this.pausePlay}
        />
      </div>
    );
  }
}
