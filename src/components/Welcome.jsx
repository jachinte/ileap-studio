import React, { Component } from 'react';
import os from 'os';
import New from '../util/New';
import Open from '../util/Open';

const mkdirp = window.require("mkdirp");

class Welcome extends Component {
  componentDidMount = () => {
    mkdirp(os.tmpdir());
  }
  onOpenProblem = () => {
    Open((metadata, testCases) => this.editProblem(metadata, testCases));
  }
  onCreateProblem = () => {
    New((metadata, testCases) => this.editProblem(metadata, testCases));
  }
  editProblem = (metadata, testCases) => {
    this.props.history.push({
      pathname: '/edit',
      state: { metadata, testCases }
    });
  }
  render() {
    return (
      <div className="buttons">
        <a onClick={this.onOpenProblem}>Open project</a>
        <a onClick={this.onCreateProblem}>Create new project</a>
      </div>
    );
  }
}

export default Welcome;
