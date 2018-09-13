import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

class TestCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: props.uuid,
      isSample: props.isSample,
      input: props.input,
      output: props.output,
    };
    this.onSampleChange = this.onSampleChange.bind(this);
    this.onEditInput = this.onEditInput.bind(this);
    this.onEditOutput = this.onEditOutput.bind(this);
    this.onResize = this.onResize.bind(this);
  }
  onSampleChange(event) {
    this.setState(
      { isSample: event.target.value },
      () => this.props.onEdit(this.props.index, this.state)
    );
  }
  onEditInput(event) {
    this.setState(
      { input: event.target.value },
      () => this.props.onEdit(this.props.index, this.state)
    );
  }
  onEditOutput(event) {
    this.setState(
      { output: event.target.value },
      () => this.props.onEdit(this.props.index, this.state)
    );
  }
  onResize(event) {
    console.log(event.target);
  }
  render() {
    const hidden = {visibility: 'hidden'};
    return (
      <div className="test-case">
        <div className="labels">
          <span style={hidden}>{this.props.index + 1}.</span>
          <label htmlFor={`input-${this.props.index}`}>Input</label>
          <label htmlFor={`output-${this.props.index}`}>Output</label>
          <input type="checkbox" style={hidden}/>
          <a style={hidden}>
            <span role="img" aria-label="Remove this test case">✖️</span>
          </a>
        </div>
        <div className="fields">
          <span>{this.props.index + 1}.</span>
          <textarea
            className="input"
            id={`input-${this.props.index}`}
            onChange={this.onEditInput}
            onPaste={this.onEditInput}
            value={this.state.input}/>
          <textarea
            className="output"
            id={`output-${this.props.index}`}
            onChange={this.onEditOutput}
            onPaste={this.onEditOutput}
            // onResize={this.onResize}
            value={this.state.output}/>
          <Tooltip placement="bottom" overlay="Mark as sample">
            <input
              type="checkbox"
              name={`sample-${this.props.index}`}
              defaultChecked={this.state.isSample}
              onChange={this.onSampleChange}/>
          </Tooltip>
          <Tooltip placement="top" overlay="Remove">
            <a onClick={() => this.props.onRemove(this.props.index)}>
              <span role="img" aria-label="Remove this test case">✖️</span>
            </a>
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default TestCase;
