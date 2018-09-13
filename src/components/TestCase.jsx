import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

class TestCase extends Component {
  onSampleChange = (event) => {
    const data = this.props.data;
    data.isSample = event.target.checked;
    this.props.onEdit(this.props.index, data);
  }
  onEditInput = (event) => {
    const data = this.props.data;
    data.input = event.target.value;
    this.props.onEdit(this.props.index, data);
  }
  onEditOutput = (event) => {
    const data = this.props.data;
    data.output = event.target.value;
    this.props.onEdit(this.props.index, data);
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
            value={this.props.data.input}/>
          <textarea
            className="output"
            id={`output-${this.props.index}`}
            onChange={this.onEditOutput}
            onPaste={this.onEditOutput}
            value={this.props.data.output}/>
          <Tooltip placement="bottom" overlay="Mark as sample input / output">
            <input
              type="radio"
              name="sample"
              checked={this.props.data.isSample}
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
