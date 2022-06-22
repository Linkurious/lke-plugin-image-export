const fs = require('fs/promises');
const copyDir = require('recursive-copy');
const rimraf = require('rimraf');
const path = require('path');

const resultJsonFile = 'export-results.json';
const reportRootDir = './reports/html/';
const testOutputPath = path.join(reportRootDir, 'e2e/');
const reportPath = path.join(reportRootDir, 'exports/');
const templatePath = './scripts/e2e/template.html';

function getReportContent(results) {
  console.log('results', results)
  const rows = results
  .reduce((rows, {name, success}) => {
    const testName = name.replace('.png', '');
    const style = `style="color: ${success ? 'green' : 'red'}"`;
    return (
      rows +
      `<tr><td colspan="3" align="center" ${style}><h3>${testName}</h3></td></tr>` +
      `<tr>
        <td><img src=./diff/${name} /></td>
        </tr>`
    );
  }, '');
  const table = `<table><tbody>${rows}<tbody></table>`;
  const intro = `<p>Images are displayed in the following order: actual result (left), difference result (middle), expected result (right).</p>`;
  return intro + table;
}

function rm(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function generateReport() {
  return rm(reportPath)
    .then(() =>
      Promise.all([
        copyDir(testOutputPath, reportPath),
      ])
    )
    .then(() =>
      fs.readFile(path.join(reportPath, resultJsonFile), {
        encoding: 'utf-8'
      })
    )
    .then(results =>
      Promise.all([
        fs.readFile(templatePath, { encoding: 'utf-8' }),
        getReportContent(JSON.parse(results))
      ])
    )
    .then(([template, content]) => {
      return template.replace('{{content}}', content);
    })
    .then(html => fs.writeFile('./reports/html/exports/index.html', html));
}

module.exports = generateReport;
