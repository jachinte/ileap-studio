import path from "path";
import os from "os";
import UUID from "pure-uuid";

const mkdirp = window.require("mkdirp");
const remote = window.require("electron").remote;
const fs = remote.require("fs");

export default function New(callback) {
  const tmp = path.join(os.tmpdir(), new UUID(1).format());
  mkdirp(tmp);
  const createAndNavigate = code => {
    const filename = path.join(tmp, "basic.c");
    fs.writeFileSync(filename, code);
    const metadata = {
      id: "",
      title: "",
      description: "",
      inputDescription: "",
      outputDescription: "",
      sampleInput: "",
      sampleOutput: "",
      tags: "",
      hint: "",
      main: filename
    };
    const testCases = [];
    callback(metadata, testCases);
  };
  import("./basic.c")
    .then(file => fetch(file))
    .then(response => response.text())
    .then(text => createAndNavigate(text));
}
