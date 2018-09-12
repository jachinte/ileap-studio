import React, { Component } from 'react';

class TestCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: props.input,
      output: props.output
    };
    this.onEditInput = this.onEditInput.bind(this);
    this.onEditOutput = this.onEditOutput.bind(this);
    this.onResize = this.onResize.bind(this);
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
    const random = Math.floor((Math.random() * 1000) + 1);
    return (
      <div className="test-case">
        <div className="labels">
          <span style={{visibility: 'hidden'}}>{this.props.index + 1}.</span>
          <label htmlFor={`input-${random}`}>Input</label>
          <label htmlFor={`output-${random}`}>Output</label>
          {/*<a style={{visibility: 'hidden'}}>x</a>*/}
        </div>
        <div className="fields">
          <span>{this.props.index + 1}.</span>
          <textarea
            className="input"
            id={`input-${random}`}
            onChange={this.onEditInput}
            onPaste={this.onEditInput}
            value={this.state.input}/>
          <textarea
            className="output"
            id={`output-${random}`}
            onChange={this.onEditOutput}
            onPaste={this.onEditOutput}
            // onResize={this.onResize}
            value={this.state.output}/>
          {/*<a onClick={this.props.onRemove}>x</a>*/}
        </div>
      </div>
    );
  }
}

export default TestCase;
