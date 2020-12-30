import React, { Component } from "react";
import "./Header.css";
import logo from "../Assets/logo.png";
import PropTypes from "prop-types";

export default class Header extends Component {
  state = {
    isDropDownActive: false,
    selectedText: "Merge Sort",
    selectedId: "0",
    algorithmList: [
      {
        id: "0",
        title: "Merge Sort",
      },
      {
        id: "1",
        title: "Quick Sort",
      },
      {
        id: "2",
        title: "Bubble Sort",
      },
      {
        id: "3",
        title: "Insertion Sort",
      },
    ],
  };

  arraySizeChanged = (e) => {
    this.props.arraySizeChanged.bind(this, e.target.value)();
  };

  sortingSpeedChanged = (e) => {
    this.props.sortingSpeedChanged.bind(this, e.target.value)();
  };

  mouseOverSelectBox = (e) => {
    this.setState({ isDropDownActive: true });
  };

  mouseOutSelectBox = (e) => {
    this.setState({ isDropDownActive: false });
  };

  algorithmSelected = (title, id) => {
    this.setState({
      selectedText: title,
      selectedId: id,
      isDropDownActive: false,
    });
    this.props.algorithmChanged.bind(this, id)();
  };

  playAndPauseClicked = (setTo) => {
    this.props.playAndPauseClicked.bind(this, setTo)();
  };

  render() {
    return (
      <div className="container">
        <div className="logo">
          <img id="logoGif" src={logo} />
        </div>
        <div className="controls">
          <div className="speed-control">
            <div className="title">Sorting Speed</div>
            <div className="slider">
              <input
                type="range"
                min="0"
                max={this.props.speedSliderStepsCount}
                defaultValue={this.props.speedSliderDefault}
                step="1"
                onInput={this.sortingSpeedChanged}
              />
            </div>
          </div>
          <div className="size-control">
            <div className="title">Array Size</div>
            <div className="slider">
              <input
                type="range"
                min={this.props.sliderMin}
                max={this.props.sliderMax}
                defaultValue={this.props.sizeSliderDefault}
                step="1"
                onInput={this.arraySizeChanged}
              />
            </div>
          </div>
          <div className="algorithm-control">
            <div
              className="select-box"
              onMouseOver={this.mouseOverSelectBox}
              onMouseOut={this.mouseOutSelectBox}
            >
              <div
                className={
                  this.state.isDropDownActive
                    ? "options-container active"
                    : "options-container"
                }
              >
                {this.state.algorithmList.map((option) => (
                  <div
                    key={option.id}
                    className="option"
                    onClick={this.algorithmSelected.bind(
                      this,
                      option.title,
                      option.id
                    )}
                  >
                    <input
                      type="radio"
                      className="radio"
                      id={option.id}
                      name="category"
                    />
                    <label htmlFor={option.id}>{option.title}</label>
                  </div>
                ))}
              </div>
              <div className="selected">{this.state.selectedText}</div>
            </div>
          </div>
          <button
            className={this.props.isPlaying ? "button playing" : "button"}
            onClick={this.playAndPauseClicked.bind(this, !this.props.isPlaying)}
          ></button>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  arraySizeChanged: PropTypes.func.isRequired,
  sortingSpeedChanged: PropTypes.func.isRequired,
  algorithmChanged: PropTypes.func.isRequired,
  sliderMax: PropTypes.number.isRequired,
  sliderMin: PropTypes.number.isRequired,
  sizeSliderDefault: PropTypes.number.isRequired,
  speedSliderDefault: PropTypes.number.isRequired,
  speedSliderStepsCount: PropTypes.number.isRequired,
  playAndPauseClicked: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
};
