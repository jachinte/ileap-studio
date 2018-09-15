import md5 from "md5";
import UUID from "pure-uuid";
import path from "path";
import os from "os";

const archiver = window.require("archiver");
const remote = window.require("electron").remote;
const dialog = remote.dialog;
const fs = remote.require("fs");

export default function Save(_testCases, metadata, sourceCode) {
  const info = { spj: false, test_cases: {} };
  const directory = path.join(os.tmpdir(), new UUID(4).format());
  const testCases = _testCases.filter(tc => !tc.isSample).map((tc, i) => {
    tc.index = i + 1; // iLeap expects natural numbers
    tc.outputMd5 = md5(tc.output);
    return tc;
  });
  metadata.main = "./main.c";
  metadata.tags = metadata.tags.replace(" ", "").split(",");
  metadata.samples = _testCases
    .filter(tc => tc.isSample)
    .map(tc => ({ input: tc.input, output: tc.output }));
  // compatibility with iLeap import feature
  metadata.description = {
    format: "html",
    value: metadata.description
  };
  metadata.input_description = {
    format: "html",
    value: metadata.input_description
  };
  metadata.output_description = {
    format: "html",
    value: metadata.output_description
  };
  metadata.hint = {
    format: "html",
    value: metadata.hint
  };
  metadata.test_case_score = null;
  metadata.time_limit = 1000;
  metadata.memory_limit = 256;
  metadata.template = {};
  metadata.spj = null;
  metadata.rule_type = "ACM";
  metadata.source = "iLeap http://ileap.csc.uvic.ca";
  metadata.answers = [];
  // the rest
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
  fs.writeFileSync(path.join(directory, "info"), JSON.stringify(info, null, 2));
  const options = {
    properties: ["openDirectory", "createDirectory", "promptToCreate"]
  };
  const createFiles = (dir, isNew) => {
    window.saveTo = dir;
    fs.writeFileSync(
      path.join(dir, "problem.json"),
      JSON.stringify(metadata, null, 2)
    );
    fs.writeFileSync(path.join(dir, "main.c"), sourceCode);
    const output = fs.createWriteStream(path.join(dir, "test-cases.zip"));
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", error => alert(`Unexpected error: ${error}`));
    archive.on("end", () =>
      alert(
        isNew
          ? "The project was saved successfully"
          : "The project was updated successfully"
      )
    );
    archive.pipe(output);
    archive.directory(directory, false);
    archive.finalize();
  };
  if (window.saveTo) {
    createFiles(window.saveTo, false);
  } else {
    dialog.showOpenDialog(options, dir => {
      if (dir === undefined) {
        return;
      }
      createFiles(dir[0], true);
    });
  }
}
