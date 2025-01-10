"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/nodeEntry.ts
var nodeEntry_exports = {};
__export(nodeEntry_exports, {
  runPythonScript: () => runPythonScript
});
module.exports = __toCommonJS(nodeEntry_exports);

// src/impl/runScript.ts
var import_node_path = require("path");
async function runPythonScript(_context, path, args) {
  if (path === "") {
    path = (0, import_node_path.join)(__dirname, "..", "scripts", "python-script.py");
  }
  const api = _context.getPluginConfig("api") || "no api url. check plugin config";
  const sk = _context.getPluginConfig("sk") || "no sk url check plugin config";
  const payload = {
    pk: sk,
    module: "cowsay:v0.0.4",
    inputs: `-i "Message=test"`,
    stream: "true"
  };
  const result = await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': `Bearer ${apisk}`
    },
    body: JSON.stringify(payload)
  });
  console.log(result);
  return "test";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runPythonScript
});
