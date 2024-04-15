#!/usr/bin/env node

import { spawnSync } from "child_process";

// read the package.json file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pack = require(__dirname + "/../package.json");

// construct the archive base name
const baseName = pack.name + "-" + pack.version;

// unzip the .TGZ file to a .TAR file
const gunzip = spawnSync("gunzip", [baseName + ".tgz"]);
console.log(
  "gunzip:" + gunzip.stdout.toString() + " / " + gunzip.stderr.toString()
);

// rename the .TAR file to an .LKE file
const mv = spawnSync("mv", [baseName + ".tar", baseName + ".lke"]);
console.log("mv:" + mv.stdout.toString() + " / " + mv.stderr.toString());
