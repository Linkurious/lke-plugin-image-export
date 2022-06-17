import { assert } from 'chai';
import Ogma, {
} from '@linkurious/ogma';

const { I } = inject();
const ogma = {} as Ogma;

When(/^I click preview$/, async () => {
  I.click('Preview');
});
Then(/^I see the preview modal$/, () => {
  I.seeElement('div[role="dialog"]')
})
Then(/^I click outside the modal$/, async () => {
  I.clickAtCoordinate({x: 1,y: 1});
});

Then(/^the modal closes$/, async () => {
  I.dontSeeElement('div[role="dialog"]')
});

When(/^I click the close button$/, async () => {
  I.click('button[aria-label="Close"]');
});
const getPreviewScale = () => {
  //@ts-ignore
  console.log([...document.querySelectorAll('button')].map(b => b.innerText))
  //@ts-ignore
  return Number(document.querySelector('.react-transform-component')
  //@ts-ignore
  .style.transform.match(/scale\((.*)\)/)[1]);
}

let previousZoom = 0;
let startZoom;
Given(/I open preview/, async () => {
  I.amOnPage('/');
  I.click('Preview');
  I.waitForElement('.react-transform-component');
  startZoom = await I.executeScript(getPreviewScale) as any as number;
});
When(/I click zoomin/, async () => {
  previousZoom = await I.executeScript(getPreviewScale) as any as number;
  I.click('button[title="Zoom in"]');
  I.wait(0.1)
});
Then(/Preview zooms in/, async () => {
  const currentZoom = await I.executeScript(getPreviewScale) as any as number;
  assert.isAbove(currentZoom, previousZoom)
});
When(/I click zoomout/, async () => {
  previousZoom = await I.executeScript(getPreviewScale) as any as number;
  I.click('button[title="Zoom out"]');
  I.wait(0.1)
});
Then(/Preview zooms out/, async () => {
  const currentZoom = await I.executeScript(getPreviewScale) as any as number;
  assert.isBelow(currentZoom, previousZoom)
});

When(/I click reset/, async () => {
  I.click('button[title="Reset"]');
  I.wait(0.1)
});
Then(/Preview resets zoom/, async () => {
  const currentZoom = await I.executeScript(getPreviewScale) as any as number;
  assert.equal(currentZoom, startZoom);
})