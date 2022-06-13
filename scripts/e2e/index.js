#!/usr/bin/env node
// const startServer = require('../../utility/start_server');
const { exec } = require('child_process');
const { green, red } = require('nanocolors');
// const generateReport = require('./generate-report');
const PORT = process.env.PORT;
const REPLACE = process.env.REPLACE;
const SMOKE = process.env.SMOKE;
let exitCode = 0;

// startServer({
//   port: PORT,
//   live: false
// })
//   .then(server => {
    new Promise((resolve, reject) => {
      console.log(`Serving examples at http://localhost:${green(PORT)}`);
      // if you are replacing the export image references, only run
      // the export tests
      const args = process.argv.slice(2).join(' ');
      let filter = REPLACE ? '--grep (image-test)' : '';
      filter = SMOKE ? '--grep smoke' : `'(?=${filter})^(?!.*smoke)'`;
      const testProcess = exec(
        `TESTOMATIO=${
          process.env.TESTOMATIO
        } REPLACE=${!!REPLACE} ./scripts/e2e/run.js ${filter} ${args}`,
        { maxBuffer: 1024 * 5000 },
        error => {
          if (error) return reject(error);
          resolve();
        }
      );
      testProcess.stdout.pipe(process.stdout);
      //testProcess.stderr.pipe(process.stderr);
    })
      .then(() => {
        console.log(green(' - all examples are fine'));
        // server.close();
      })
      .catch(({ message }) => {
        console.log(red(` - e2e test failed`));
        console.log(message)
        // server.close();
        exitCode = 1;
      });
  // })
  // .finally(() => (REPLACE ? Promise.resolve() : generateReport()))
  // .then(() => process.exit(exitCode));
