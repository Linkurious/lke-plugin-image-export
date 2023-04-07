import Ogma from "@linkurious/ogma";
import fs from "fs/promises";
import mkdir from "mkdirp";
import path from "path";
import BlinkDiff from "blink-diff";
import { BrowserContext, Page } from "playwright";
import sharp from "sharp";

const { I } = inject();
const ogma = {} as Ogma;

const rootFolder = "../../reports/html/e2e/";
const screenshotFolder = path.join(rootFolder, "screenshot/");
const diffFolder = path.join(rootFolder, "diff/");
const baseFolder = "./ref-images";
let foldersCreated = false;
const results: any[] = [];

const shouldReplace = process.env.REPLACE === "true" ? true : false;
function getPaths(fileName: string) {
  fileName = fileName.trim();
  return {
    diffPath: path.join(diffFolder, fileName),
    expectedPath: path.join(baseFolder, fileName),
    actualPath: path.join(screenshotFolder, fileName),
  };
}

function compareImages(
  expectedPath: string,
  actualPath: string,
  diffPath: string
) {
  const diff = new BlinkDiff({
    imageAPath: expectedPath,
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

When(/^I drag the viz (\w+)/, async (shouldDrag) => {
  if (shouldDrag === "false") return;
  await I.executeScript(() => {
    ogma.setOptions({ interactions: { drag: { enabled: false } } });
  });
  await I.usePlaywrightTo(
    "drag the view",
    async ({ page }: { page: Page; context: BrowserContext }) => {
      const view = page.viewportSize();
      if (!view) throw new Error("Could not get viewport size");
      const cx = view.width / 2;
      const cy = view.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.waitForTimeout(200);
      await page.mouse.move(cx + 300, cy + 300, { steps: 60 });
      await page.waitForTimeout(200);
      await page.mouse.up();
    }
  );
  await I.executeScript(() => {
    ogma.setOptions({ interactions: { drag: { enabled: true } } });
  });
});

When(/^I set text visibility (\w+)$/, async (shouldShow) => {
  if (shouldShow === "true") return;
  I.click(".caption-switch");
});

When(/^I set text collision removal (\w+)$/, async (shouldRemoveCollision) => {
  if (shouldRemoveCollision === "true") return;
  I.click(".collision-switch");
});

When(/^I select output format (.+)$/, async (format) => {
  if (format === "svg") return;
  await I.click("SVG");
  await I.click(".ant-dropdown-menu-title-content");
});

When(/^I click download (.+) (.+)$/, async (name, format) => {
  const [download, downloadPath] = await I.download("text=Download");
  const { expectedPath, actualPath } = getPaths(name);
  if (!downloadPath) {
    throw "download failed";
  }
  const outPath = shouldReplace ? expectedPath : actualPath;
  if (format === "svg") return await fs.copyFile(downloadPath, outPath);
  return await sharp(downloadPath).png().toFile(outPath);
});

Then(/^image is nice (.+)$/, (name) => {
  const { expectedPath, actualPath, diffPath } = getPaths(name);
  if (shouldReplace) {
    return;
  } else {
    return compareImages(actualPath, expectedPath, diffPath)
      .then(() => {
        results.push({ name, path: diffPath, success: true });
      })
      .catch((e) => {
        results.push({ name, path: diffPath, success: false });
        throw e;
      });
  }
});

When(/^I select background color (\w+)$/, async (background) => {
  let checked = await I.grabAttributeFrom(
    ".preview-background-selector>button",
    "aria-checked"
  );
  if (background !== checked) {
    I.click(".preview-background-selector>button");
  }
});

//@ts-ignore
Before(async ({ tags }) => {
  if (!tags.includes("@download") || foldersCreated) return;
  await mkdir(path.resolve(screenshotFolder));
  await mkdir(path.resolve(diffFolder));
  await mkdir(path.resolve(baseFolder));
  foldersCreated = true;
});

//@ts-ignore
After(({ tags }) => {
  return fs.writeFile(
    path.join(rootFolder, "export-results.json"),
    JSON.stringify(results)
  );
});
