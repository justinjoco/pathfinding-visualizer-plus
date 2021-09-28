import React, { Component } from 'react'
import './App.css'
import PathingSimulator from './view-controller/PathingSimulator'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <PathingSimulator></PathingSimulator>
      </div>
    )
  }
}

