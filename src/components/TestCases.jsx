import React, { Component } from 'react';
import TestCase from './TestCase';

class TestCases extends Component {
  componentDidMount() {
    if (this.props.onDidMount)
      this.props.onDidMount();
  }
  render() {
    return (
      <div>
        <div className="test-cases">
          {this.renderTestCases()}
        </div>
        <nav className="buttons">
          <a onClick={this.props.onAddTestCase}>Add</a>
          <a onClick={this.props.onSave}>Save</a>
        </nav>
      </div>
    );
  }
  renderTestCases() {
    return this.props.testCases.map((testCase, i) =>
      <TestCase
        key={testCase.uuid}
        index={i}
        data={testCase}
        onEdit={this.props.onEditTestCase}
        onRemove={this.props.onRemoveTestCase}/>
    );
  }
}

export default TestCases;
