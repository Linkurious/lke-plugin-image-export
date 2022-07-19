/// <reference types='codeceptjs' />

type CustomHelper = import('./helpers/customHelper');
type Ogma = typeof import('@linkurious/ogma');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    customHelper: CustomHelper;
  }
  interface Methods extends Playwright, CustomHelper {}
  interface I extends WithTranslation<Methods> {}

  namespace Translation {
    interface Actions {}
  }
}
