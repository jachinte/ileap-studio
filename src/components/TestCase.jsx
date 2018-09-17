import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
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
    return (
      <div className="test-case">
        <span>{this.props.index + 1}.</span>
        <SplitPane
          className="field-wrapper"
          split="vertical"
          minSize={50}
          defaultSize="50%">
          <div className="field">
            <label htmlFor={`input-${this.props.index}`}>Input</label>
            <TextareaAutosize
              id={`input-${this.props.index}`}
              className="input"
              minRows={this.state.inputHeight}
              maxRows={15}
              defaultValue={this.props.data.input}
              onChange={this.onEditInput}
              onHeightChange={this.onInputHeightChange}
            />
          </div>
          <div className="field">
            <label htmlFor={`output-${this.props.index}`}>Output</label>
            <TextareaAutosize
              id={`output-${this.props.index}`}
              className="output"
              minRows={this.state.outputHeight}
              maxRows={15}
              defaultValue={this.props.data.output}
              onChange={this.onEditOutput}
              onHeightChange={this.onOutputHeightChange}
            />
          </div>
        </SplitPane>
        <Tooltip placement="bottom" overlay="Mark as sample input / output">
          <input
            type="checkbox"
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
    );
  }
}

export default TestCase;
