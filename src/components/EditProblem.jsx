import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MonacoEditor from 'react-monaco-editor';
import Save from '../util/Save';
import TestCase from './TestCase';
import Metadata from './Metadata';
import UUID from "pure-uuid";

const remote = window.require("electron").remote;
const dialog = remote.dialog;
const fs = remote.require("fs");

const options = {
  contextmenu: false,
  fontSize: 15,
  minimap: {
    enabled: true
  },
  selectOnLineNumbers: true,
};

class EditProblem extends Component {
  constructor(props) {
    super(props);
    if (!this.props.location.state) {
      this.props.history.push({ pathname: '/' });
    }
    this.state = {
      metadata: this.props.location.state.metadata,
      sourceCode: '',
      testCases: this.props.location.state.testCases,
      windowHeight: undefined,
      windowWidth: undefined,
    };
  }
  componentDidMount = () => {
    this.onResize();
    window.addEventListener('resize', this.onResize);
    fs.readFile(this.state.metadata.main, 'UTF-8', (err, data) => {
      if (err) {
        console.log(err);
        alert('Error reading source code');
      }
      this.setState({ sourceCode: data });
    });
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onResize);
  }
  onResize = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    });
  }
  onMetadataChange = (metadata) => {
    this.setState({ metadata });
  }
  onAddTestCase = (isSample = false) => {
    const testCases = this.state.testCases;
    testCases.push({
      input: '',
      output: '',
      isSample: (isSample || testCases.length === 0),
      uuid: new UUID(1).format()
    });
    this.setState({ testCases });
  }
  onEditTestCase = (index, testCase) => {
    const testCases = this.state.testCases;
    testCases[index] = testCase;
    this.setState({ testCases });
  }
  onRemoveTestCase = (index) => {
    const testCases = this.state.testCases;
    const wasSample = testCases[index].isSample;
    testCases.splice(index, 1);
    if (wasSample && testCases.length > 0) {
      testCases[0].isSample = true;
    }
    this.setState({ testCases });
  }
  onSave = () => {
    const {testCases, metadata, sourceCode} = this.state;
    if (window.saveTo) {
      Save(testCases, metadata, sourceCode, window.saveTo);
    } else {
      // Not working: save new project
      const options = {
        defaultPath: 'problem.zip',
        filters: [
          { name: 'Zip files', extensions: ['zip'] }
        ]
      };
      dialog.showSaveDialog(options, dir => {
        if (dir !== undefined) {
          Save(testCases, metadata, sourceCode, dir);
        }
      });
    }
  }
  render() {
    return (
      <div id="app">
        <header>
          <h1>iLeap</h1>
        </header>
        <Tabs id="tabs">
          <TabList>
            <Tab>Metadata</Tab>
            <Tab>Source code</Tab>
            <Tab>Test cases</Tab>
          </TabList>
          <TabPanel>
            <Metadata
              data={this.state.metadata}
              onChange={this.onMetadataChange}
              onSave={this.onSave}/>
            {this.renderNav(false)}
          </TabPanel>
          <TabPanel>
            <MonacoEditor
              height={this.state.windowHeight - 200}
              language="c"
              theme="vs-light"
              value={this.state.sourceCode}
              options={options}
              onChange={(value) => this.setState({ sourceCode: value })}
              editorDidMount={(editor, monaco) => editor.focus()}/>
              {this.renderNav(false)}
          </TabPanel>
          <TabPanel className="test-cases-panel">
            <div className="test-cases">
              {this.renderTestCases()}
            </div>
            {this.renderNav(true)}
          </TabPanel>
        </Tabs>
      </div>
    );
  }
  renderNav(inTestCases) {
    var add;
    if (inTestCases) {
      add = (<a onClick={this.onAddTestCase.bind(this, false)}>Add</a>);
    }
    return (
      <nav className="buttons">
        <Link to="/" onClick={() => (window.saveTo = undefined)}>Home</Link>
        {add}
        <a onClick={this.onSave} className="primary">Save</a>
      </nav>
    );
  }
  renderTestCases() {
    return this.state.testCases.map((testCase, i) =>
      <TestCase
        key={testCase.uuid}
        index={i}
        data={testCase}
        onEdit={this.onEditTestCase}
        onRemove={this.onRemoveTestCase}/>
    );
  }
}

export default EditProblem;
