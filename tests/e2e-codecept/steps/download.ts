import Ogma from "@linkurious/ogma";
import * as fs from "fs/promises";
import { mkdirp } from "mkdirp";
import * as path from "path";
import BlinkDiff from "blink-diff";
import { BrowserContext, Page } from "playwright";
import { Jimp } from "jimp";
import { svg2png, initialize } from "svg2png-wasm";

const { I } = inject();
const ogma = {} as Ogma;

const rootFolder = path.resolve(__dirname, "../../../reports/html/e2e/");
const screenshotFolder = path.join(rootFolder, "screenshot/");
const diffFolder = path.join(rootFolder, "diff/");
const baseFolder = path.resolve(__dirname, "../ref-images");
let foldersCreated = false;
const results: { name: string; path: string; success: boolean }[] = [];

const shouldReplace = process.env.REPLACE === "true";
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
      if (error) return reject(error);
      else {
        if (diff.hasPassed(result.code)) return resolve(result.differences);
        reject(result.differences);
      }
    });
  });
}

When(/^I drag the viz (\w+)/, async (shouldDrag: string) => {
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

When(/^I set text visibility (\w+)$/, async (shouldShow: string) => {
  if (shouldShow === "true") return;
  I.click(".caption-switch");
});

When(
  /^I set text collision removal (\w+)$/,
  async (shouldRemoveCollision: string) => {
    if (shouldRemoveCollision === "true") return;
    I.click(".collision-switch");
  }
);

When(/^I select output format (.+)$/, async (format: string) => {
  if (format === "svg") return;
  await I.click("SVG");
  await I.click(".ant-dropdown-menu-title-content");
});

let initialized = false;

When(/^I click download (.+) (.+)$/, async (name: string, format: string) => {
  const [, downloadPath] = await I.download("text=Download");
  const { expectedPath, actualPath } = getPaths(name);
  if (!downloadPath) throw "download failed";
  const outPath = shouldReplace ? expectedPath : actualPath;
  console.log({ downloadPath, format });
  if (format === "svg") {
    if (!initialized) {
      const wasm = await fs.readFile(
        path.resolve(
          __dirname,
          "../../../node_modules/svg2png-wasm/svg2png_wasm_bg.wasm"
        )
      );
      await initialize(wasm);
      initialized = true;
    }
    const svg = await svg2png(await fs.readFile(downloadPath, "utf-8"));
    await fs.writeFile(outPath, svg);
    return;
  }

  const file = await fs.readFile(downloadPath);
  await fs.writeFile(outPath as `${string}.${string}`, file);
  return file;
});

When(/^I download (.+) (.+)$/, async (name: string, format: string) => {
  const [download, downloadPath] = await I.download("text=Download");
  const { actualPath } = getPaths(name);
  if (!downloadPath) throw "download failed";
  return await download.saveAs(actualPath);
});

Then(/^image is nice (.+)$/, (name: string) => {
  const { expectedPath, actualPath, diffPath } = getPaths(name);
  if (shouldReplace) return;
  else {
    return compareImages(actualPath, expectedPath, diffPath)
      .then(() => results.push({ name, path: diffPath, success: true }))
      .catch((e) => {
        results.push({ name, path: diffPath, success: false });
        throw e;
      });
  }
});

When(/^I select background color (\w+)$/, async (background: string) => {
  const checked = await I.grabAttributeFrom(
    ".preview-background-selector>button",
    "aria-checked"
  );
  if (background !== checked) {
    I.click(".preview-background-selector>button");
  }
});

// @ts-expect-error Tags are missing
Before(async ({ tags }) => {
  if (!tags.includes("@download") || foldersCreated) return;
  await mkdirp(path.resolve(screenshotFolder));
  await mkdirp(path.resolve(diffFolder));
  await mkdirp(path.resolve(baseFolder));
  foldersCreated = true;
});

After(() => {
  return fs.writeFile(
    path.join(rootFolder, "export-results.json"),
    JSON.stringify(results)
  );
});
