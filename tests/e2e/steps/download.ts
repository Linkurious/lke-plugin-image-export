import { assert } from 'chai';
import { BrowserContext, Page } from 'playwright';
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
const results = {};

const { I } = inject();
const ogma = {} as Ogma;

let download, downloadPath;


function compareImages(expectedPath, actualPath, diffPath ){
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
When(/^I click download$/, async () => {
  [ download, downloadPath ] = await I.download('text=Download');
});

Then(/^image is nice$/, () => {
  fs.readFile(downloadPath)
  .then(() => {
    console.log('read image, what should we do ?')
  })
})

//@ts-ignore
Before(async ({ tags }) => {
  if (!tags.includes('@image-test') || foldersCreated) return;
  await mkdir(path.resolve(screenshotFolder));
  await mkdir(path.resolve(diffFolder));
  await mkdir(path.resolve(baseFolder));
  foldersCreated = true;
});
//@ts-ignore
After(() => {
  // if (!tags.includes('@image-test')) return;
  return fs.writeFile(
    path.join(rootFolder, 'export-results.json'),
    JSON.stringify(results)
  );
});

When(
  /^I export png with (\w+) (\d+) (\d+) (.+)$/,
  async (clip, width, height, name) => {
    const fileName = `${name}.png`;
    await I.executeScript(
      ({ clip, width, height }) =>
        ogma.view.afterNextFrame().then(() =>
          ogma.export.png({
            clip,
            width: +width > 0 ? width : undefined,
            height: +height > 0 ? height : undefined,
            download: false
          })
        ),
      { clip, width, height }
    )
      .then(base64 => {
        return fs.writeFile(
          path.resolve(
            process.env.REPLACE ? baseFolder : screenshotFolder,
            fileName
          ),
          base64.replace(/^data:image\/\w+;base64,/, ''),
          'base64'
        );
      })
      .then(() => {
        if (process.env.REPLACE) return;
        return compareImages(
          path.join(baseFolder, fileName),
          path.join(screenshotFolder, fileName),
          path.join(diffFolder, fileName),
        )
      })
      .then(imagesMatch => {
        if (process.env.REPLACE) return;
        results[name] = imagesMatch;
        assert.equal(imagesMatch, true);
      });
  }
);

// When(
//   /^I export svg with (\w+) (\d+) (\d+) (\w+) (\w+) (\d+) (.+)$/,
//   async (clip, width, height, embedFonts, groupSemantically, margin, name) => {
//     const pngFilename = `${name}.png`;
//     const svgFilename = `${name}.svg`;

//     await I.executeScript(
//       ({ clip, width, height, groupSemantically, margin, embedFonts }) =>
//         ogma.view.afterNextFrame().then(() =>
//           ogma.export
//             .svg({
//               clip,
//               width: +width > 0 ? width : undefined,
//               height: +height > 0 ? height : undefined,
//               groupSemantically,
//               margin,
//               embedFonts,
//               download: false
//             })
//             .then(svg => {
//               // turn the svg into a png file, to get a
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
//             })
//         ),
//       { clip, width, height, groupSemantically, margin, embedFonts }
//     )
//       .then(({ svg, data64 }) =>
//         // write the png file in the root folder
//         Promise.all([
//           fs.writeFile(
//             path.resolve(
//               process.env.REPLACE ? baseFolder : screenshotFolder,
//               pngFilename
//             ),
//             data64.replace(/^data:image\/\w+;base64,/, ''),
//             {
//               encoding: 'base64'
//             }
//           ),
//           fs.writeFile(
//             path.resolve(
//               process.env.REPLACE ? baseFolder : screenshotFolder,
//               svgFilename
//             ),
//             svg,
//             {
//               encoding: 'utf-8'
//             }
//           )
//         ])
//       )
//       .then(async () => {
//         if (process.env.REPLACE) return;
//         // do a string comparision between svg files
//         const base = await fs.readFile(path.resolve(baseFolder, svgFilename), {
//           encoding: 'utf-8'
//         });
//         const reference = await fs.readFile(
//           path.resolve(screenshotFolder, svgFilename),
//           { encoding: 'utf-8' }
//         );
//         assert.equal(base, reference);
//         // do a visual comparision between png files
//         return compareImages(
//           path.join(baseFolder, pngFilename),
//           path.join(screenshotFolder, pngFilename),
//           path.join(diffFolder, pngFilename),
//           0
//         );
//       })
//       .then(imagesMatch => {
//         if (process.env.REPLACE) return;
//         results[name] = imagesMatch;
//         assert.equal(imagesMatch, true);
//       });
//   }
// );
