import { assert } from 'chai';
import { BrowserContext, Page } from 'playwright';
import Ogma, {
} from '@linkurious/ogma';

const { I } = inject();
const ogma = {} as Ogma;

let download, path;
When(/^I click download$/, async () => {
  [ download, path ] = await I.download('text=Download');
  console.log({path})
});
Then(/^image is nice$/, () => {
})