import { assert } from 'chai';
import { BrowserContext, Page } from 'playwright';
import Ogma, {
} from '@linkurious/ogma';
import {formats, fontSizes} from '../../../src/constants'
import { useDebugValue } from 'react';
import { locator } from 'codeceptjs';

const { I } = inject();
const ogma = {} as Ogma;

function getFormat(selectedFormat){
  return formats.find(f => f.label === selectedFormat);
}
When(/^I select format (.*)$/, async (format) => {
  I.amOnPage('/');
  I.click({react: 'Select'});
  I.click(format);
});
Then(/^I see it's size within the panel (.*)$/, async (selectedFormat) => {
  const format = getFormat(selectedFormat)
  if(format && format.value){
    I.see(`${format.value.width} × ${format.value.height} px`, '.dimensions');
  }
})

Then(/^it updates on zoom (.*)$/, async (selectedFormat) => {
  const format = getFormat(selectedFormat);
  const before = await I.grabTextFrom('.dimensions')
  I.zoom('canvas', 100)
  I.wait(1)
  const after = await I.grabTextFrom('.dimensions')
  if(format && !format.value){
    assert.notEqual(before, after)
  }else{
    assert.equal(before, after)
  }
})

let sizeBefore = 0;
const getTextSize = async () => I.executeScript(() => {
  return Math.max(...(ogma.getNodes().getAttribute('text.size') as number[]));
});
When(/^I select text size (.*)$/, async (size) => {
  I.amOnPage('/');
  sizeBefore = (await getTextSize()) as any as number;
  I.click(locator.build('.ant-slider-mark>span').withText('200%'));
});

Then(/^I see it's updated within the viz (.*)$/, async (size) => {
  const sizeAfter = (await getTextSize()) as any as number;
  const ratio= (+size.slice(0, -1))/ 100;
  if(ratio > 1){
    assert.isAbove(sizeAfter - sizeBefore, 0);
  }else{
    assert.isBelow(sizeBefore - sizeAfter, 0);
  }
});
When(/^I go to main page$/, async () => {
  I.amOnPage('/');
});
When(/^I toggle text slider$/, async () => {
  I.click('.caption-switch');
});

Then(/^text disappear$/, async () => {
  const areTextVisible = await I.executeScript(() => {
    //@ts-ignore
    return ogma.modules.graphics._visibility['nodeTexts'] > 0;
  });
});
Then(/^text reapear$/, async () => {
  assert.isTrue(await I.executeScript(() => {
    //@ts-ignore
    return ogma.modules.graphics._visibility['nodeTexts'] <= 0;
  }));
});

When(/^I toggle text collision$/, async () => {
  I.click('.collision-switch');
});

Then(/^text collide accordingly (\w+)$/, async (shouldCollide) => {
  const overlapRemoval = await I.executeScript(() => {
    const overlapRemoval = ogma.getOptions().texts?.preventOverlap;
    return overlapRemoval === undefined || overlapRemoval
    ? true : false;
  });
  assert.equal(overlapRemoval, shouldCollide === 'true' ? true : false)
});