import React, { Component } from 'react';
import TestCase from './TestCase';
import md5 from 'md5';
import UUID from 'pure-uuid';
import path from 'path';
import os from 'os';

const archiver = window.require('archiver');
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const fs = remote.require('fs');

class TestCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testCases: [
        {
          input: '1 2',
          output: '3'
        }
      ]
    };
    this.onAddTestCase = this.onAddTestCase.bind(this);
    this.onEditTestCase = this.onEditTestCase.bind(this);
    this.onRemoveTestCase = this.onRemoveTestCase.bind(this);
    this.onCreateZip = this.onCreateZip.bind(this);
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
  onCreateZip() {
    const info = {
      spj: false,
      test_cases: {}
    };
    const testCases = this.state.testCases.map((tc, i) => {
      tc.index = i;
      tc.outputMd5 = md5(tc.output);
      return tc;
    });
    const id = new UUID(4).format();
    const directory = path.join(os.tmpdir(), id);
    fs.mkdirSync(directory);
    testCases.forEach(tc => {
      info.test_cases[`${tc.index}`] = {
        striped_output_md5: tc.outputMd5,
        output_size: tc.output.length,
        output_name: `${tc.index}.out`,
        input_name: `${tc.index}.in`,
        input_size: tc.input.length
      };
      fs.writeFileSync(path.join(directory, `${tc.index}.in`), tc.input);
      fs.writeFileSync(path.join(directory, `${tc.index}.out`), tc.output);
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
        <div className="test-cases">
          {this.renderTestCases()}
        </div>
        <nav id="buttons">
          <a onClick={this.onAddTestCase}>Add test case</a>
          <a onClick={this.onCreateZip}>Create zip file</a>
        </nav>
      </div>
    );
  }
  renderTestCases() {
    return this.state.testCases.map((testCase, i) => 
      <TestCase
        key={i}
        index={i}
        input={testCase.input}
        output={testCase.output}
        onEdit={this.onEditTestCase}
        onRemove={this.onRemoveTestCase}/>
    );
  }
}

export default TestCases;
