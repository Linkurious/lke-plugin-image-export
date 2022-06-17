import { assert } from 'chai';
import { BrowserContext, Page } from 'playwright';
import Ogma, {
} from '@linkurious/ogma';
import fs from 'fs/promises';

const { I } = inject();
const ogma = {} as Ogma;

let download, path;
When(/^I click download$/, async () => {
  [ download, path ] = await I.download('text=Download');
});

Then(/^image is nice$/, () => {
  fs.readFile(path)
  .then(() => {
    console.log('read image, what should we do ?')
  })
})