import React, { Component } from 'react';
import Problem from './components/Problem';
import './App.css';

class App extends Component {
  render() {
    return (
      <div id="app">
        <header>
          <h1>iLeap</h1>
        </header>
        <Problem />
      </div>
    );
  }
}

export default App;
