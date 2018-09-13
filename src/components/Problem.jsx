import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MonacoEditor from 'react-monaco-editor';
import TestCases from './TestCases';
import Metadata from './Metadata';
import md5 from 'md5';
import UUID from 'pure-uuid';
import path from 'path';
import os from 'os';

const mkdirp = window.require('mkdirp');
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
      metadata: {
        id: '',
        title: '',
        description: '',
        inputDescription: '',
        outputDescription: '',
        sampleInput: '',
        sampleOutput: '',
        tags: '',
        hint: '',
        main: './basic.c'
      },
      sourceCode: '',
      testCases: [],
      windowHeight: undefined,
      windowWidth: undefined,
    };
  }
  componentDidMount = () => {
    this.onAddTestCase(true);
    this.onResize();
    window.addEventListener('resize', this.onResize);
    import(`${this.state.metadata.main}`)
      .then(file => fetch(file))
      .then(response => response.text())
      .then(text => this.setState({ sourceCode: text }));
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
    const info = { spj: false, test_cases: {} };
    const directory = path.join(os.tmpdir(), new UUID(4).format());
    const testCases = this.state.testCases
      .filter((tc) => !tc.isSample)
      .map((tc, i) => {
        tc.index = i + 1; // iLeap expects natural numbers
        tc.outputMd5 = md5(tc.output);
        return tc;
      });
    const sample = this.state.testCases.filter((tc) => tc.isSample)[0];
    const metadata = this.state.metadata;
    metadata.sampleInput = sample.input;
    metadata.sampleOutput = sample.output;
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
    const options = { properties: ['openDirectory', 'createDirectory', 'promptToCreate'] };
    dialog.showOpenDialog(options, (dir) => {
      if (dir === undefined){
        return;
      }
      fs.writeFileSync(
        path.join(dir[0], 'problem.json'),
        JSON.stringify(metadata, null, 2)
      );
      fs.writeFileSync(
        path.join(dir[0], 'main.c'),
        this.state.sourceCode
      );
      const output = fs.createWriteStream(path.join(dir[0], 'test-cases.zip'));
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('error', (error) => alert(`Unexpected error: ${error}`));
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
            <Tab>Metadata</Tab>
            <Tab>Source code</Tab>
            <Tab>Test cases</Tab>
          </TabList>
          <TabPanel>
            <Metadata
              data={this.state.metadata}
              onChange={this.onMetadataChange}
              onSave={this.onSave}/>
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
              <nav className="buttons">
                <a onClick={this.onSave}>Save</a>
              </nav>
          </TabPanel>
          <TabPanel className="test-cases-panel">
            <TestCases
              testCases={this.state.testCases}
              onDidMount={() => mkdirp(os.tmpdir())}
              onAddTestCase={this.onAddTestCase.bind(this, false)}
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
