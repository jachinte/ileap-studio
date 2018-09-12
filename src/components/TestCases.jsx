import React, { Component } from 'react';
import TestCase from './TestCase';
import os from 'os';

const mkdirp = window.require('mkdirp');

class TestCases extends Component {
  componentDidMount() {
    mkdirp(os.tmpdir(), (error) => console.log(error));
  }
  render() {
    var removeButton;
    if (this.props.testCases.length > 0) {
      removeButton = (
        <a onClick={() => this.props.onRemoveTestCase(this.props.testCases.length - 1)}>
          Remove last
        </a>
      );
    }
    return (
      <div>
        <div className="test-cases">
          {this.renderTestCases()}
        </div>
        <nav className="buttons">
          <a onClick={this.props.onAddTestCase}>Add</a>
          {removeButton}
          <a onClick={this.props.onSave}>Save</a>
        </nav>
      </div>
    );
  }
  renderTestCases() {
    return this.props.testCases.map((testCase, i) => 
      <TestCase
        key={i}
        index={i}
        input={testCase.input}
        output={testCase.output}
        onEdit={this.props.onEditTestCase}
        onRemove={this.props.onRemoveTestCase}/>
    );
  }
}

export default TestCases;
