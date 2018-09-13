import React, { Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

class TestCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputHeight: 3,
      outputHeight: 3
    };
  }
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
  onInputHeightChange = (height, instance) => {
    if (instance.rowCount > this.state.outputHeight) {
      this.setState({ outputHeight: instance.rowCount });
    } else {
      this.setState({ inputHeight: this.state.outputHeight });
    }
  }
  onOutputHeightChange = (height, instance) => {
    if (instance.rowCount > this.state.inputHeight) {
      this.setState({ inputHeight: instance.rowCount });
    } else {
      this.setState({ outputHeight: this.state.inputHeight });
    }
  }
  render() {
    const hidden = {visibility: 'hidden'};
    return (
      <div className="test-case">
        <div className="labels">
          <span style={hidden}>{this.props.index + 1}.</span>
          <label htmlFor={`input-${this.props.index}`}>Input</label>
          <label htmlFor={`output-${this.props.index}`}>Output</label>
          <input type="radio" style={hidden}/>
          <a style={hidden}>
            <span role="img" aria-label="Remove this test case">✖️</span>
          </a>
        </div>
        <div className="fields">
          <span>{this.props.index + 1}.</span>
          <TextareaAutosize
            id={`input-${this.props.index}`}
            className="input"
            minRows={this.state.inputHeight}
            maxRows={15}
            defaultValue={this.props.data.input}
            onChange={this.onEditInput}
            onHeightChange={this.onInputHeightChange}
          />
          <TextareaAutosize
            id={`output-${this.props.index}`}
            className="output"
            minRows={this.state.outputHeight}
            maxRows={15}
            defaultValue={this.props.data.output}
            onChange={this.onEditOutput}
            onHeightChange={this.onOutputHeightChange}
          />
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
