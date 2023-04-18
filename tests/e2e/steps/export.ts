import { assert } from "chai";
const { I } = inject();

When(
  /^image is of size (\d+) (\d+)$/,
  async (width: string, height: string) => {
    // image-viewer--content
    const size = await I.getSvgElementSize(".ogma-svg-background");
    assert.deepEqual(
      {
        width: size[0],
        height: size[1],
      },
      { width: +width, height: +height }
    );
  }
);
