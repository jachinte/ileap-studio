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
            onChange={(e) => this.onFieldChange("id", e.target.value)}
            defaultValue={this.props.data.id}/>
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
            onChange={(e) => this.onFieldChange("inputDescription", e.target.value)}
            minRows={3}
            defaultValue={this.props.data.inputDescription}
          />
          <label>Output Description</label>
          <TextareaAutosize
            onChange={(e) => this.onFieldChange("outputDescription", e.target.value)}
            minRows={3}
            defaultValue={this.props.data.outputDescription}
          />
          <label htmlFor="tags">Tags (comma separated)</label>
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
