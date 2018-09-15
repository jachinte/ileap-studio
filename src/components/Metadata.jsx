import React, { Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

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
          <input
            type="text"
            name="id"
            onChange={(e) => this.onFieldChange("display_id", e.target.value)}
            defaultValue={this.props.data.display_id}/>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            onChange={(e) => this.onFieldChange("title", e.target.value)}
            defaultValue={this.props.data.title}/>
          <label>Description</label>
          <TextareaAutosize
            onChange={(e) => this.onFieldChange("description", e.target.value)}
            minRows={3}
            defaultValue={this.props.data.description}
          />
          <label>Input Description</label>
          <TextareaAutosize
            onChange={(e) => this.onFieldChange("input_description", e.target.value)}
            minRows={3}
            defaultValue={this.props.data.input_description}
          />
          <label>Output Description</label>
          <TextareaAutosize
            onChange={(e) => this.onFieldChange("output_description", e.target.value)}
            minRows={3}
            defaultValue={this.props.data.output_description}
          />
          <label htmlFor="tags">Tags (comma separated, no spaces)</label>
          <input
            type="text"
            name="tags"
            onChange={(e) => this.onFieldChange("tags", e.target.value)}
            defaultValue={this.props.data.tags}/>
          <label>Hint</label>
          <TextareaAutosize
            onChange={(e) => this.onFieldChange("hint", e.target.value)}
            minRows={3}
            defaultValue={this.props.data.hint}
          />
        </div>
      </div>
    );
  }
}

export default Metadata;
