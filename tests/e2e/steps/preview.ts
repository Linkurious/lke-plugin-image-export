import { assert } from "chai";

const { I } = inject();

When(/^I click preview$/, async () => {
  I.waitForElement(".preview--button");
  I.click(".preview--button");
});
Then(/^I see the preview modal$/, () => {
  I.wait(0.2);
  I.seeElement('div[role="dialog"]');
});
Then(/^I click outside the modal$/, async () => {
  I.clickAtCoordinate({ x: 1, y: 1 });
});

Then(/^the modal closes$/, async () => {
  I.wait(1);
  I.dontSeeElement('div[role="dialog"]');
});

When(/^I click the close button$/, async () => {
  I.click('button[aria-label="Close"]');
});
const getPreviewScale = () => {
  console.log(
    Array.prototype.map.call(
      document.querySelectorAll("button"),
      (b: HTMLButtonElement) => b.innerText
    )
  );
  const transformEl = document.querySelector<HTMLElement>(
    ".react-transform-component"
  )!;
  return Number(transformEl.style.transform.match(/scale\((.*)\)/)![1]);
};

let previousZoom = 0;
let startZoom: number;

Given(/I open preview and wait for loading/, async () => {
  I.waitForElement(".preview--button");
  I.click(".preview--button");
  I.waitForElement(".react-transform-component", 3);
  startZoom = (await I.executeScript(getPreviewScale)) as unknown as number;
});

When(/I click zoomin/, async () => {
  previousZoom = (await I.executeScript(getPreviewScale)) as unknown as number;
  I.click('[title="Zoom in"]');
  I.wait(0.5);
});
Then(/Preview zooms in/, async () => {
  const currentZoom = (await I.executeScript(
    getPreviewScale
  )) as unknown as number;
  assert.equal(currentZoom, previousZoom);
});

When(/I click zoomout/, async () => {
  previousZoom = (await I.executeScript(getPreviewScale)) as unknown as number;
  I.click('[title="Zoom out"]');
  I.wait(0.5);
});
Then(/Preview zooms out/, async () => {
  const currentZoom = (await I.executeScript(getPreviewScale)) as any as number;
  assert.isBelow(currentZoom, previousZoom);
});

When(/I click reset/, async () => {
  I.click('[title="Reset"]');
  I.wait(0.5);
});
Then(/Preview resets zoom/, async () => {
  const currentZoom = (await I.executeScript(getPreviewScale)) as any as number;
  assert.closeTo(currentZoom, startZoom, 0.01);
});
