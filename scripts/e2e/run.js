#!/usr/bin/env node
const { exec } = require("child_process");
const argv = require("minimist")(process.argv.slice(2));

const grep = argv.grep || "";
const testProcess = exec(
  `TESTOMATIO_RUN=\${run} TESTOMATIO=${process.env.TESTOMATIO} npx codeceptjs run --debug --verbose --grep "${grep}" --reporter-options configFile=./tests/e2e/reporters.json`,
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  }
);
testProcess.stdout.pipe(process.stdout);
testProcess.stderr.pipe(process.stderr);
