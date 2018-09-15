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
  const options = { properties: ["openDirectory"] };
  dialog.showOpenDialog(options, directory => {
    if (directory === undefined) {
      return;
    }
    window.saveTo = directory[0];
    const tmp = path.join(os.tmpdir(), new UUID(4).format());
    mkdirp(tmp);
    const problem = JSON.parse(
      fs.readFileSync(path.join(directory[0], "problem.json"), "utf8")
    );
    problem.main = path.join(directory[0], "main.c");
    problem.description = problem.description.value;
    problem.input_description = problem.input_description.value;
    problem.output_description = problem.output_description.value;
    problem.tags = problem.tags.join(",");
    problem.hint = problem.hint.value;
    extract(path.join(directory[0], "test-cases.zip"), { dir: tmp }, error => {
      if (error) {
        alert(`Unexpected error: ${error}`);
        return;
      }
      const testCases = [];
      problem.samples.forEach(data => {
        testCases.push(tc(data.input, data.output, true));
      });
      fs.readdir(tmp, (error, files) => {
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
                fs.readFileSync(path.join(tmp, `${file}.in`), "utf8"),
                fs.readFileSync(path.join(tmp, `${file}.out`), "utf8"),
                false
              )
            );
          });
        callback(problem, testCases);
      });
    });
  });
}
