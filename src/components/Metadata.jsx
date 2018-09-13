import React, { Component } from 'react';

class Metadata extends Component {
  render() {
    return (
      <div className="metadata">
        <div className="form">
          <label htmlFor="id">Id</label>
          <input type="text" name="id" defaultValue={this.props.data.id} />
          <label htmlFor="title">Title</label>
          <input type="text" name="title" defaultValue={this.props.data.title} />
          <label htmlFor="description">Description</label>
          <textarea type="text" id="description" defaultValue={this.props.data.description} />
          <label htmlFor="inputDescription">Input Description</label>
          <textarea type="text" id="inputDescription" defaultValue={this.props.data.inputDescription} />
          <label htmlFor="outputDescription">Output Description</label>
          <textarea type="text" id="outputDescription" defaultValue={this.props.data.outputDescription} />
          <label htmlFor="tags">Tags</label>
          <input type="text" name="tags" defaultValue={this.props.data.tags.join(", ")} />
          <label htmlFor="hint">Hint</label>
          <textarea type="text" id="hint" defaultValue={this.props.data.hint} />
        </div>
        <nav className="buttons">
          <a onClick={this.props.onSave}>Save</a>
        </nav>
      </div>
    );
  }
}

export default Metadata;
