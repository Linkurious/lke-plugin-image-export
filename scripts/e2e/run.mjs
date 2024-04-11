#!/usr/bin/env node
import { exec } from "child_process";
import minimist from "minimist";
const argv = minimist(process.argv.slice(2));

const grep = argv.grep || "";
const TESTOMATIO = process.env.TESTOMATIO || "";
const testProcess = exec(
  `TESTOMATIO_RUN=\${run} TESTOMATIO=${TESTOMATIO} npx codeceptjs run --grep "${grep}" --reporter-options configFile=./tests/e2e/reporters.json`,
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  }
);
testProcess.stdout.pipe(process.stdout);
testProcess.stderr.pipe(process.stderr);
