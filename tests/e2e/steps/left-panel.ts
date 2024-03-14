import { assert } from "chai";
import Ogma from "@linkurious/ogma";
import { formats } from "../../../src/constants";
import { locator } from "codeceptjs";

const { I } = inject();
const ogma = {} as Ogma;

function getFormat(selectedFormat: string) {
  return formats.find((f) => f.label === selectedFormat);
}
When(/^I select format (.*)$/, async (format: string) => {
  if (format === 'Full Size') return;
  I.waitForElement(locator.build(".format-select"));
  I.click(locator.build(".format-select"));
  I.waitForElement(locator.build("span").withText(format));
  I.click(locator.build("span").withText(format), undefined, { force: true });
});
Then(
  /^I see it's size within the panel (.*)$/,
  async (selectedFormat: string) => {
    const format = getFormat(selectedFormat);
    if (format && format.value) {
      I.see(`${format.value.width} × ${format.value.height} px`, ".dimensions");
    }
  }
);

// TODO: restore this test
Then(/^it updates on zoom (.*)$/, async (selectedFormat: string) => {
  const format = getFormat(selectedFormat);
  const before = await I.grabTextFrom(".dimensions");
  I.zoom(".visualisation--container", 100);
  I.wait(1);
  const after = await I.grabTextFrom(".dimensions");
  if (format && !format.value) {
    assert.notEqual(before, after);
  } else {
    assert.equal(before, after);
  }
});

let sizeBefore = 0;
const getTextSize = async () =>
  I.executeScript(() => {
    return Math.max(...(ogma.getNodes().getAttribute("text.size") as number[]));
  });
When(/^I select text size (.*)$/, async (size: string) => {
  sizeBefore = (await getTextSize()) as any as number;
  I.click(locator.build(".ant-slider-mark>span").withText("200%"));
});

Then(/^I see it's updated within the viz (.*)$/, async (size: string) => {
  const sizeAfter = (await getTextSize()) as any as number;
  const ratio = +size.slice(0, -1) / 100;
  if (ratio > 1) {
    assert.isAbove(sizeAfter - sizeBefore, 0);
  } else {
    assert.isBelow(sizeBefore - sizeAfter, 0);
  }
});
When(/^I go to main page$/, async () => {
  await I.amOnPage("/");
  await I.wait(1);
});
When(/^I toggle text slider$/, async () => {
  I.click(".caption-switch");
});

Then(/^text disappear$/, async () => {
  const areTextVisible = await I.executeScript(() => {
    //@ts-ignore
    return ogma.modules.graphics._visibility["nodeTexts"] > 0;
  });
});
Then(/^text reapear$/, async () => {
  assert.isTrue(
    await I.executeScript(() => {
      //@ts-ignore
      return ogma.modules.graphics._visibility["nodeTexts"] <= 0;
    })
  );
});

When(/^I toggle text collision$/, async () => {
  I.click(".collision-switch");
});

Then(/^text collide accordingly (\w+)$/, async (shouldCollide: string) => {
  const overlapRemoval = (await I.executeScript(() => {
    const overlapRemoval = ogma.getOptions().texts?.preventOverlap;
    return overlapRemoval === undefined || overlapRemoval ? true : false;
  })) as unknown as boolean;
  assert.equal(overlapRemoval, shouldCollide === "true" ? true : false);
});

When(/^I toggle snapping$/, async () => {
  I.click(".snap-switch");
});

Then(/^snapping toggles accordingly (\w+)$/, async (shouldSnap: string) => {
  const snapEnabled = (await I.executeScript(() =>
    ogma.tools.snapping.enabled()
  )) as unknown as boolean;
  assert.equal(snapEnabled, shouldSnap === "true" ? true : false);
});
