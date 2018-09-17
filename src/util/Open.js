import path from "path";
import os from "os";
import UUID from "pure-uuid";

const mkdirp = window.require("mkdirp");
const extract = window.require("extract-zip");
const remote = window.require("electron").remote;
const dialog = remote.dialog;
const fs = remote.require("fs");

const tc = (input, output, isSample) => {
  return {
    input,
    output,
    isSample,
    uuid: new UUID(1).format()
  };
};

export default function Open(callback) {
  const options = { properties: ["openFile"] };
  dialog.showOpenDialog(options, projectFile => {
    if (projectFile === undefined) {
      return;
    }
    window.saveTo = projectFile[0];
    const tmp = path.join(os.tmpdir(), new UUID(4).format());
    mkdirp(tmp);
    extract(projectFile[0], { dir: tmp }, error => {
      if (error) {
        alert(`Unexpected error: ${error}`);
        return;
      }
      const problem = JSON.parse(
        fs.readFileSync(path.join(tmp, "1", "problem.json"), "utf8")
      );
      problem.main = path.join(tmp, "1", "main.c");
      problem.description = problem.description.value;
      problem.input_description = problem.input_description.value;
      problem.output_description = problem.output_description.value;
      problem.tags = problem.tags.join(",");
      problem.hint = problem.hint.value;
      const testCases = [];
      const testcaseDir = path.join(tmp, "1", "testcase");
      problem.samples.forEach(data => {
        testCases.push(tc(data.input, data.output, true));
      });
      fs.readdir(testcaseDir, (error, files) => {
        const seen = {};
        files
          .filter(file => file.endsWith(".in") || file.endsWith(".out"))
          .map(file => file.replace(/\.[^/.]+$/, ""))
          .filter(
            file => (seen.hasOwnProperty(file) ? false : (seen[file] = true))
          )
          .forEach(file => {
            testCases.push(
              tc(
                fs.readFileSync(path.join(testcaseDir, `${file}.in`), "utf8"),
                fs.readFileSync(path.join(testcaseDir, `${file}.out`), "utf8"),
                false
              )
            );
          });
        callback(problem, testCases);
      });
    });
  });
}
