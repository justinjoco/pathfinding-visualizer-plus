import React, { Component } from 'react';
import './App.css';
import PathfindingVisualizer from './view-controller/PathfindingVisualizer';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <PathfindingVisualizer></PathfindingVisualizer>
      </div>
    );
  }
}

