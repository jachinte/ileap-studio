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
      display_id: "",
      title: "",
      description: "<p></p>",
      input_description: "<p></p>",
      output_description: "<p></p>",
      samples: [],
      tags: "",
      hint: "<pre><code></code></pre>",
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
