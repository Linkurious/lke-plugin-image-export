/// <reference types='codeceptjs' />

type CustomHelper = import("./helpers/customHelper");
type Ogma = typeof import("@linkurious/ogma");

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

declare module "blink-diff" {
  interface BlinkDiffOptions {
    imageAPath: string;
    imageBPath: string;
    thresholdType: number;
    threshold: number;
    delta?: number;
    composition?: boolean;
    imageOutputPath?: string;
  }

  export default class BlinkDiff {
    constructor(options: BlinkDiffOptions): BlinkDiff;
    run(
      callback: (
        error: Error,
        result: { code: number; differences: any }
      ) => void
    ): void;
    hasPassed(code: number): boolean;
    static THRESHOLD_PERCENT: number;
  }
}
