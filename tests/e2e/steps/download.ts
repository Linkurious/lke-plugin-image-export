import Ogma, {
} from '@linkurious/ogma';
import fs from 'fs/promises';
import mkdir from 'mkdirp';
import path from 'path';
import BlinkDiff from 'blink-diff';

const { I } = inject();
const ogma = {} as Ogma;

const rootFolder = '../../reports/html/e2e/';
const screenshotFolder = path.join(rootFolder, 'screenshot/');
const diffFolder = path.join(rootFolder, 'diff/');
const baseFolder = './ref-images';
let foldersCreated = false;
const results: any[] = [];

const shouldReplace = process.env.REPLACE === 'true' ? true: false;
function getPaths(fileName: string){
  return {
    diffPath: path.join(diffFolder, fileName),
    expectedPath: path.join(baseFolder, fileName),
    actualPath: path.join(screenshotFolder, fileName), 
  }
}

function compareImages(expectedPath: string, actualPath: string, diffPath: string ){
  const diff = new BlinkDiff({
    imageAPath:expectedPath,
    imageBPath: actualPath,
    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold: 0.01, // 1% threshold
    imageOutputPath: diffPath,
  });

  return new Promise((resolve, reject) => {
    diff.run((error, result) => {
      if (error) {
        reject(error);
      } else {
        diff.hasPassed(result.code) 
          ? resolve(result.differences) 
          : reject(result.differences);
      }
    });
  });
}

// function convertToPng(){
  // turn the svg into a png file, to get a
//               // visual comparision
//               const blobURL = URL.createObjectURL(
//                 new Blob([svg], {
//                   type: 'image/svg+xml;charset=utf-8'
//                 })
//               );
//               const img = document.createElement('img');
//               return new Promise(resolve => {
//                 img.addEventListener('load', () => {
//                   const canvas = document.createElement('canvas');
//                   canvas.width = width;
//                   canvas.height = height;
//                   const ctx = canvas.getContext('2d');
//                   // @ts-ignore
//                   ctx.drawImage(img, 0, 0, width, height);
//                   resolve({
//                     svg,
//                     data64: canvas.toDataURL()
//                   });
//                 });
//                 img.src = blobURL;
//               });
// }

When(/^I select output format (.+)$/, async (format) => {
  if(format ==='svg')return;
  await I.click('SVG');
  await I.click('.ant-dropdown-menu-title-content');
})

When(/^I click download (.+)$/, async (name) => {
  const [download, downloadPath] = await I.download('text=Download');
  const {expectedPath, actualPath} = getPaths(name);
  if(!downloadPath){
    throw('download failed');
  }
  if(shouldReplace){
    return await fs.copyFile(downloadPath, expectedPath);
  }else{
    return await fs.copyFile(downloadPath, actualPath);
  }
});

Then(/^image is nice (.+)$/, (name) => {
  const {expectedPath, actualPath, diffPath} = getPaths(name);
  if(shouldReplace){
    return;
  }else{
    return compareImages(
      actualPath,
      expectedPath,
      diffPath,
      )
    .then(() => {
      results.push({name, path: diffPath, success: true});
      console.log("ICI", results)
    })
    .catch(e => {
      results.push({name, path: diffPath, success: false});
      throw(e);
    });
  }
})

//@ts-ignore
Before(async ({ tags }) => {
  if (!tags.includes('@download') || foldersCreated) return;
  await mkdir(path.resolve(screenshotFolder));
  await mkdir(path.resolve(diffFolder));
  await mkdir(path.resolve(baseFolder));
  foldersCreated = true;
});
//@ts-ignore
After(({tags}) => {
  // if (!tags.includes('@download')) return;
  console.log("AFTER", results)
  return fs.writeFile(
    path.join(rootFolder, 'export-results.json'),
    JSON.stringify(results)
  );
});
