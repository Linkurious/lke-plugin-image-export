const fs = require('fs/promises');
const copyDir = require('recursive-copy');
const rimraf = require('rimraf');
const path = require('path');

const resultJsonFile = 'export-results.json';
const referencePath = './tests/e2e/ref-images';
const reportRootDir = './reports/html/';
const testOutputPath = path.join(reportRootDir, 'e2e/');
const reportPath = path.join(reportRootDir, 'exports/');
const templatePath = './scripts/tests/e2e/template.html';

function getReportContent(results) {
  return fs
    .readdir(referencePath)
    .then(refs => {
      const rows = refs
        .filter(ref => ref.match(/\.png/))
        .reduce((rows, ref) => {
          const name = ref.replace('.png', '');
          const style = `style="color: ${results[name] ? 'green' : 'red'}"`;
          return (
            rows +
            `<tr><td colspan="3" align="center" ${style}><h3>${name}</h3></td></tr>` +
            `<tr>
              <td><img src=./screenshot/${ref} /></td>
              <td><img src=./ref-images/${ref} /></td>
              <td><img src=./diff/${ref} /></td>
              </tr>`
          );
        }, '');
      return `<table><tbody>${rows}<tbody></table>`;
    })
    .then(table => {
      const intro = `<p>Images are displayed in the following order: actual result (left), expected result (middle), difference (right).</p>`;
      return intro + table;
    });
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
        copyDir(referencePath, path.join(reportPath, 'ref-images'))
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
