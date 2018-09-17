import md5 from "md5";
import UUID from "pure-uuid";
import path from "path";
import os from "os";

const archiver = window.require("archiver");
const remote = window.require("electron").remote;
const fs = remote.require("fs");

export default function Save(_testCases, metadata, sourceCode, projectFile) {
  const info = { spj: false, test_cases: {} };
  const tmpDir = path.join(os.tmpdir(), new UUID(1).format());
  const projectDir = path.join(tmpDir, "1");
  const testCaseDir = path.join(projectDir, "testcase");
  fs.mkdirSync(tmpDir);
  fs.mkdirSync(projectDir);
  fs.mkdirSync(testCaseDir);
  const testCases = _testCases.filter(tc => !tc.isSample).map((tc, i) => {
    tc.index = i + 1; // iLeap expects natural numbers
    tc.outputMd5 = md5(tc.output);
    return tc;
  });
  const problem = JSON.parse(JSON.stringify(metadata));
  problem.main = "./main.c";
  problem.tags = problem.tags.replace(" ", "").split(",");
  problem.samples = _testCases.filter(tc => tc.isSample).map(tc => ({
    input: tc.input,
    output: tc.output
  }));
  // compatibility with iLeap import feature
  problem.description = { format: "html", value: problem.description };
  problem.input_description = {
    format: "html",
    value: problem.input_description
  };
  problem.output_description = {
    format: "html",
    value: problem.output_description
  };
  problem.hint = { format: "html", value: problem.hint };
  problem.test_case_score = null;
  problem.time_limit = 1000;
  problem.memory_limit = 256;
  problem.template = {};
  problem.spj = null;
  problem.rule_type = "ACM";
  problem.source = "iLeap http://ileap.csc.uvic.ca";
  problem.answers = [];
  // the rest
  testCases.forEach(tc => {
    const inputFile = path.join(testCaseDir, `${tc.index}.in`);
    const outputFile = path.join(testCaseDir, `${tc.index}.out`);
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
  fs.writeFileSync(
    path.join(testCaseDir, "info"),
    JSON.stringify(info, null, 2)
  );
  const isNew = window.saveTo === undefined;
  window.saveTo = projectFile;
  fs.writeFileSync(
    path.join(projectDir, "problem.json"),
    JSON.stringify(problem, null, 2)
  );
  fs.writeFileSync(path.join(projectDir, "main.c"), sourceCode);
  const output = fs.createWriteStream(projectFile);
  const archive = archiver("zip", {
    zlib: { level: 9 }
  });
  archive.on("error", error => alert(`Unexpected error: ${error}`));
  archive.on("end", () =>
    alert(
      isNew
        ? "The project was saved successfully"
        : "The project was updated successfully"
    )
  );
  archive.pipe(output);
  archive.directory(tmpDir, false);
  archive.finalize();
}
