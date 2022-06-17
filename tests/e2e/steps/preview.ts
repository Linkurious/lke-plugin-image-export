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

