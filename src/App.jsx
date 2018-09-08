import React, { Component } from 'react';
import TestCases from './components/TestCases';
import './App.css';

class App extends Component {
  render() {
    return (
      <div id="app">
        <header>
          <h1>iLeap</h1>
        </header>
        <TestCases />
      </div>
    );
  }
}

export default App;
