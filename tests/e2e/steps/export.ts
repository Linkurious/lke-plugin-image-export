import { assert } from "chai";
import Ogma from "@linkurious/ogma";

const { I } = inject();
const ogma = {} as Ogma;

When(/^image is of size (\d+) (\d+)$/, async (width, height) => {
  // image-viewer--content
  console.log("expected", width, height);
  const size = await I.getSvgElementSize(".ogma-svg-background");
  assert.deepEqual(
    {
      width: size[0],
      height: size[1],
    },
    { width: +width, height: +height }
  );
});
