import React, { Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Tooltip from 'rc-tooltip';

class Metadata extends Component {
  onFieldChange = (property, value) => {
    const data = this.props.data;
    data[property] = value;
    this.props.onChange(data);
  }
  render() {
    return (
      <div className="metadata">
        <div className="form">
          <label htmlFor="id">Id</label>
          <Tooltip placement="top" overlay="A unique word to identify this problem (no spaces)">
            <input
              type="text"
              name="id"
              onChange={(e) => this.onFieldChange("display_id", e.target.value)}
              defaultValue={this.props.data.display_id}/>
          </Tooltip>
          <label htmlFor="title">Title</label>
          <Tooltip placement="top" overlay="A descriptive title">
            <input
              type="text"
              name="title"
              onChange={(e) => this.onFieldChange("title", e.target.value)}
              defaultValue={this.props.data.title}/>
          </Tooltip>
          <label>Description</label>
          <Tooltip placement="top" overlay="A description statement in HTML">
            <TextareaAutosize
              onChange={(e) => this.onFieldChange("description", e.target.value)}
              minRows={3}
              defaultValue={this.props.data.description}
            />
          </Tooltip>
          <label>Input Description</label>
          <Tooltip placement="top" overlay="An input description in HTML. This is NOT the input data">
            <TextareaAutosize
              onChange={(e) => this.onFieldChange("input_description", e.target.value)}
              minRows={3}
              defaultValue={this.props.data.input_description}
            />
          </Tooltip>
          <label>Output Description</label>
          <Tooltip placement="top" overlay="An output description in HTML. This is NOT the output data">
            <TextareaAutosize
              onChange={(e) => this.onFieldChange("output_description", e.target.value)}
              minRows={3}
              defaultValue={this.props.data.output_description}
            />
          </Tooltip>
          <label htmlFor="tags">Tags</label>
          <Tooltip placement="top" overlay="A comma-separated list of tags (no spaces)">
            <input
              type="text"
              name="tags"
              onChange={(e) => this.onFieldChange("tags", e.target.value)}
              defaultValue={this.props.data.tags}/>
          </Tooltip>
          <label>Hint</label>
          <Tooltip placement="top" overlay="A hint to solve the problem. In templates, do not forget to use &;lt; and &;gt; instead of < and >">
            <TextareaAutosize
              onChange={(e) => this.onFieldChange("hint", e.target.value)}
              minRows={3}
              defaultValue={this.props.data.hint}
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default Metadata;
