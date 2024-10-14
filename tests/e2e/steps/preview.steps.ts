import { ICustomWorld } from "../utils/world";
import { Given, When, Then } from "@cucumber/cucumber";
import { config } from "../utils/config";
import { expect } from "@playwright/test";

Given("I go to main page", async function (this: ICustomWorld) {
  await this.page?.goto(config.BASE_URL);
  await this.page
    ?.locator(".visualisation--container")
    .waitFor({ state: "visible" });
});

When("I click preview", async function (this: ICustomWorld) {
  await this.page?.locator(".preview--button").waitFor();
  await this.page?.click(".preview--button");
});

Then("I see the preview modal", async function (this: ICustomWorld) {
  await this.page?.waitForSelector('div[role="dialog"]');
});

Then("I click outside the modal", async function (this: ICustomWorld) {
  await this.page?.locator("body").click({ position: { x: 1, y: 1 } });
});

Then("the modal closes", async function (this: ICustomWorld) {
  await this.page?.waitForTimeout(1000);
  expect(await this.page?.locator('div[role="dialog"]').isVisible()).toBe(
    false
  );
});

When("I click the close button", async function (this: ICustomWorld) {
  await this.page?.click('button[aria-label="Close"]');
});

const getPreviewScale = () => {
  const transformEl = document.querySelector<SVGGElement>(".transform-group")!;
  const matrix = transformEl
    .getAttribute("transform")!
    .match(/matrix\(([^)]+)\)/)![1]
    .split(" ")
    .map(Number);
  return matrix[0];
};

let previousZoom = 0;
let startZoom: number;

Given(
  "I open preview and wait for loading",
  async function (this: ICustomWorld) {
    await this.page?.waitForSelector(".preview--button");
    await this.page?.click(".preview--button");
    await this.page?.waitForSelector(".transform-group");
    startZoom = (await this.page?.evaluate(
      getPreviewScale
    )) as unknown as number;
  }
);

When("I click zoomin", async function (this: ICustomWorld) {
  previousZoom = await this.page!.evaluate<number>(getPreviewScale);
  await this.page?.click('[title="Zoom in"]');
  await this.page?.waitForTimeout(500);
});

Then("Preview zooms in", async function (this: ICustomWorld) {
  const currentZoom = await this.page?.evaluate<number>(getPreviewScale);
  expect(currentZoom).toEqual(previousZoom);
});

When("I click zoomout", async function (this: ICustomWorld) {
  previousZoom = await this.page!.evaluate<number>(getPreviewScale);
  await this.page?.click('[title="Zoom out"]');
  await this.page?.waitForTimeout(500);
});

Then("Preview zooms out", async function (this: ICustomWorld) {
  const currentZoom = await this.page?.evaluate<number>(getPreviewScale);
  expect(currentZoom).toBeLessThan(previousZoom);
});

When("I click reset", async function (this: ICustomWorld) {
  await this.page?.click('[title="Reset"]');
  await this.page?.waitForTimeout(500);
});

Then("Preview resets zoom", async function (this: ICustomWorld) {
  const currentZoom = await this.page?.evaluate<number>(getPreviewScale);
  expect(currentZoom).toBeCloseTo(startZoom, 0.01);
});
