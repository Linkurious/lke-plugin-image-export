#!/usr/bin/env node
const { green, red } = require("nanocolors");
const { spawn, exec, execSync } = require("child_process");
const generateReport = require("./generate-report");
const REPLACE = process.env.REPLACE;

function startServer() {
  const server = spawn("npm", ["run", "serve:web"]);
  return new Promise((resolve, reject) => {
    server.stdout.on("data", (data) => {
      const message = data.toString();
      const matches = message.match(/http\:\/\/localhost\:(\d+)/);
      if (!matches || matches.length < 2) return;
      console.log(" - web server is running on port", matches[1]);
      resolve({ server, port: matches[1] });
    });
    server.stderr.on("data", (data) => {
      if (!data.toString().match(/Checking for updates failed/))
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
      console.error("mockserver error", data.error);
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
    if (server) server.kill("SIGINT");
    if (mockServer) mockServer.kill("SIGINT");
    process.exit(exitCode);
  });
