import { assert } from 'chai';
import { BrowserContext, Page } from 'playwright';
import Ogma, {
} from '@linkurious/ogma';
import {formats} from '../../../src/constants'
import { useDebugValue } from 'react';

const { I } = inject();
const ogma = {} as Ogma;

function getFormat(selectedFormat){
  return formats.find(f => f.label === selectedFormat);
}
When(/^I select format (.*)$/, async (format) => {
  console.log('TEST!')
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
