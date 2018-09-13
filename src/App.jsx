import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import EditProblem from './components/EditProblem';
import './App.css';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path="/" component={ Welcome }/>
          <Route path="/edit" component={ EditProblem }/>
        </div>
      </HashRouter>
    );
  }
}

export default App;
