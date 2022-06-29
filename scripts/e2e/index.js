#!/usr/bin/env node
const { green, red } = require("nanocolors");
const { spawn, exec } = require("child_process");
const generateReport = require("./generate-report");
const REPLACE = process.env.REPLACE;

function startServer() {
  const server = spawn("npm", ["run", "serve"]);
  return new Promise((resolve, reject) => {
    server.stdout.on("data", (data) => {
      const message = data.toString();
      const matches = message.match(
        /Server available at http:\/\/127\.0\.0\.1:(\d+)/
      );
      if (!matches || matches.length < 2) return;
      resolve({ server, port: matches[1] });
    });
    server.stderr.on("data", (data) => {
      reject({ server, error: data.toString() });
    });
  });
}

function startMockServer() {
  const mockServer = spawn("node", ["scripts/mock-server.js"]);
  return new Promise((resolve, reject) => {
    mockServer.stdout.on("data", (data) => {
      const message = data.toString();
      const matches = message.match(/JSON Server is running/);
      if (!matches || !matches.length) return;
      resolve({ mockServer });
    });
    mockServer.stderr.on("data", (data) => {
      console.error(data.toString);
      reject({ mockServer, error: data.toString() });
    });
  });
}

function runTests(PORT) {
  let testProcess;
  return new Promise((resolve, reject) => {
    // if you are replacing the export image references, only run
    // the export tests
    const args = process.argv.slice(2).join(" ");
    let filter = REPLACE
      ? "--grep download"
      : process.env.GREP !== undefined
      ? `--grep ${process.env.GREP}`
      : "";
    console.log(filter);
    testProcess = exec(
      `TESTOMATIO=${
        process.env.TESTOMATIO
      } REPLACE=${!!REPLACE} PORT=${PORT} ./scripts/e2e/run.js ${filter} ${args}`,
      { maxBuffer: 1024 * 5000 },
      (error) => {
        if (error) return reject(error);
        resolve();
      }
    );
    testProcess.stdout.pipe(process.stdout);
    testProcess.stderr.pipe(process.stderr);
  })
    .then(() => {
      console.log(green(" - all examples are fine"));
    })
    .catch(({ message }) => {
      console.log(red(` - e2e test failed`));
      testProcess.kill("SIGINT");
      throw message;
    });
}

let server, mockServer;
let exitCode = 0;
startMockServer()
  .then((data) => {
    mockServer = data.mockServer;
    return startServer();
  })
  .then((data) => {
    server = data.server;
    return runTests(data.port);
  })
  .catch((e) => {
    exitCode = 1;
    if (e.server) {
      console.error(`problem starting server`, e.error);
    }
    if (e.mockServer) {
      console.error(`problem starting mock server`, e.error);
    }
    console.error(e);
  })
  .then(() => (REPLACE ? Promise.resolve() : generateReport()))
  .finally(() => {
    console.log("killing server");
    server.kill("SIGINT");
    mockServer.kill("SIGINT");
    process.exit(exitCode);
  });
