import { assert } from 'chai';
import { BrowserContext, Page } from 'playwright';
import Ogma, {
  BoundingBox,
  Point,
  SimpleBoundingBox,
  View
} from '@linkurious/ogma';
const { I } = inject();
const ogma = {} as Ogma;

// When I layout the graph
//     And I locate the graph
//     Then the graph is in the viewport

When(/^I select format$/, async () => {
  console.log('TEST!')
  await I.executeScript(() => {
    
  });
});
Then(/^I see it's size within the panel$/, async () => {
  console.log('step')
})

// When(/^I locate the graph$/, async () => {
//   await I.executeScript(() => {
//     return ogma.view.locateGraph();
//   });
// });

// Then(/^the graph is in the viewport$/, async () => {
//   const { graph, view }: { graph: BoundingBox; view: SimpleBoundingBox } =
//     await I.executeScript(() => {
//       const { width, height } = ogma.view.get();
//       const tl = ogma.view.screenToGraphCoordinates({ x: 0, y: 0 });
//       const br = ogma.view.screenToGraphCoordinates({ x: width, y: height });

//       return {
//         graph: ogma.getNodes().getBoundingBox(),
//         view: { minX: tl.x, minY: tl.y, maxX: br.x, maxY: br.y }
//       };
//     });
//   assert.isBelow(view.minX, graph.minX);
//   assert.isBelow(view.minY, graph.minY);
//   assert.isAbove(view.maxX, graph.maxX);
//   assert.isAbove(view.maxY, graph.maxY);
// });

// let initialCenter: Point;
// When(/I pan to (\d+),(\d+)/, async (x, y) => {
//   const dx = parseFloat(x);
//   const dy = parseFloat(y);

//   initialCenter = await I.executeScript(() => {
//     ogma.getNodes().setAttribute('draggable', false);
//     const { cx, cy } = ogma.getNodes().getBoundingBox();
//     return ogma.view.graphToScreenCoordinates({ x: cx, y: cy });
//   });
//   await I.usePlaywrightTo(
//     'drag the view',
//     async ({ page }: { page: Page; context: BrowserContext }) => {
//       const view = page.viewportSize();
//       if (!view) throw new Error('Could not get viewport size');
//       const cx = view.width / 2;
//       const cy = view.height / 2;
//       await page.mouse.move(cx, cy);
//       await page.mouse.down();
//       await page.waitForTimeout(200);
//       await page.mouse.move(cx + dx, cy + dy, { steps: 20 });
//       await page.mouse.up();
//     }
//   );
// });

// Then(/^center should be moved by (\d+),(\d+)/, async (x, y) => {
//   const dx = parseFloat(x);
//   const dy = parseFloat(y);

//   const center = await I.executeScript(() => {
//     const { cx, cy } = ogma.getNodes().getBoundingBox();
//     return ogma.view.graphToScreenCoordinates({ x: cx, y: cy });
//   });

//   // 15% is the delay error
//   assert.approximately(center.x - initialCenter.x, dx, dx * 0.15);
//   assert.approximately(center.y - initialCenter.y, dy, dy * 0.15);
// });

// let initialView: Required<View>;
// When(/^I move cursor to (\d+),(\d+)/, async (xs, ys) => {
//   const x = parseFloat(xs);
//   const y = parseFloat(ys);
//   await I.moveCursorTo('#graph-container', x, y);
//   initialView = await I.executeScript(() => ogma.view.get());
// });

// When(/^I mousewheel (\d+)/, deltaStr => {
//   const delta = parseFloat(deltaStr);
//   I.usePlaywrightTo('mousewheel', async ({ page }: { page: Page }) => {
//     await page.mouse.move(0, 0);
//     await page.mouse.wheel(0, delta);
//   });
// });

// Then(/the graph should be zoomed by (\d+\.?\d*)/, async zoomDeltaStr => {
//   I.wait(0.5);
//   const zoomDelta = parseFloat(zoomDeltaStr);
//   const view = await I.executeScript(() => ogma.view.get());
//   if (!initialView) throw new Error('initialView is not set');
//   assert.approximately(
//     view.zoom / (initialView.zoom as number),
//     zoomDelta,
//     0.1
//   );
// });

// Then(/^graph should be moved by (\d+),(\d+)/, async (dxs, dys) => {
//   const dx = parseFloat(dxs);
//   const dy = parseFloat(dys);
//   const view = await I.executeScript(() => ogma.view.get());
//   if (!initialView) throw new Error('initialView is not set');
//   assert.approximately(view.x - initialView.x, dx, 10);
//   assert.approximately(view.y - initialView.y, dy, 10);
// });
