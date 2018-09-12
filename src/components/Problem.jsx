import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MonacoEditor from 'react-monaco-editor';
import TestCases from './TestCases';
import md5 from 'md5';
import UUID from 'pure-uuid';
import path from 'path';
import os from 'os';

const archiver = window.require('archiver');
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const fs = remote.require('fs');

const options = {
  contextmenu: false,
  fontSize: 15,
  minimap: {
    enabled: true
  },
  selectOnLineNumbers: true,
};

class Problem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceCode: '',
      testCases: [],
      windowHeight: undefined,
      windowWidth: undefined,
    };
    this.onResize = this.onResize.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.editorDidMount = this.editorDidMount.bind(this);
    this.onAddTestCase = this.onAddTestCase.bind(this);
    this.onEditTestCase = this.onEditTestCase.bind(this);
    this.onRemoveTestCase = this.onRemoveTestCase.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
    import('./basic.c')
      .then(file => fetch(file))
      .then(response => response.text())
      .then(text => this.setState({ sourceCode: text }));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }
  onResize() {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    });
  }
  onEditorChange(newValue, e) {
    this.setState({ sourceCode: newValue });
  }
  editorDidMount(editor, monaco) {
    editor.focus();
  }
  onAddTestCase() {
    const _testCases = this.state.testCases;
    _testCases.push({
      input: '',
      output: ''
    });
    this.setState({ testCases: _testCases });
  }
  onEditTestCase(index, testCase) {
    const _testCases = this.state.testCases;
    _testCases[index] = testCase;
    this.setState({ testCases: _testCases });
  }
  onRemoveTestCase(index) {
    const _testCases = this.state.testCases;
    _testCases.splice(index, 1);
    this.setState({ testCases: _testCases });
  }
  onSave() {
    const info = { spj: false, test_cases: {} };
    const directory = path.join(os.tmpdir(), new UUID(4).format());
    const testCases = this.state.testCases.map((tc, i) => {
      tc.index = i + 1; // iLeap expects natural numbers
      tc.outputMd5 = md5(tc.output);
      return tc;
    });
    fs.mkdirSync(directory);
    testCases.forEach(tc => {
      const inputFile = path.join(directory, `${tc.index}.in`);
      const outputFile = path.join(directory, `${tc.index}.out`);
      fs.writeFileSync(inputFile, tc.input);
      fs.writeFileSync(outputFile, tc.output);
      info.test_cases[`${tc.index}`] = {
        striped_output_md5: tc.outputMd5,
        output_size: fs.statSync(outputFile).size,
        output_name: `${tc.index}.out`,
        input_name: `${tc.index}.in`,
        input_size: fs.statSync(inputFile).size
      };
    });
    fs.writeFileSync(path.join(directory, 'info'), JSON.stringify(info, null, 2));
    dialog.showSaveDialog({ defaultPath: 'test-cases.zip' }, (filename) => {
      if (filename === undefined){
        return;
      }
      const output = fs.createWriteStream(filename);
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('error', (error) => alert(`Unexpected error: ${error}`));
      archive.on('end', () => alert('The file was exported successfully.'));
      archive.pipe(output);
      archive.directory(directory, false);
      archive.finalize();
    });
  }
  render() {
    return (
      <div>
        <Tabs id="tabs">
          <TabList>
            <Tab>Source code</Tab>
            <Tab>Test cases</Tab>
          </TabList>
          <TabPanel>
            <MonacoEditor
              height={this.state.windowHeight - 200}
              language="c"
              theme="vs-light"
              value={this.state.sourceCode}
              options={options}
              onChange={this.onEditorChange}
              editorDidMount={this.editorDidMount}/>
              <nav className="buttons">
                <a onClick={this.onSave}>Save</a>
              </nav>
          </TabPanel>
          <TabPanel className="test-cases-panel">
            <TestCases
              testCases={this.state.testCases}
              onAddTestCase={this.onAddTestCase}
              onEditTestCase={this.onEditTestCase}
              onRemoveTestCase={this.onRemoveTestCase}
              onSave={this.onSave}/>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default Problem;
