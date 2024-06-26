import { Download, Page } from "playwright";

class CustomHelper extends Helper {
  get page(): Page {
    return (this.helpers as { Playwright: { page: Page } }).Playwright.page;
  }

  doubleClickAtCoordinate(coordinate: { x: number; y: number }): Promise<void> {
    return this.page.mouse.dblclick(coordinate.x, coordinate.y);
  }

  download(button: string): Promise<[Download, string | null]> {
    return Promise.all([
      this.page.waitForEvent("download"),
      this.page.locator(button).click(),
    ]).then(([download]) => {
      return Promise.all([download, download.path()]);
    });
  }

  getImageSize(image: string): Promise<[number, number, number]> {
    return this.page.evaluate((image) => {
      const img = document.querySelector(image) as HTMLImageElement;
      return [img.width, img.height, window.devicePixelRatio];
    }, image);
  }

  getElementSize(selector: string): Promise<[number, number]> {
    return this.page.evaluate((selector) => {
      const element = document.querySelector(selector) as HTMLElement;
      return [element.clientWidth, element.clientHeight];
    }, selector);
  }

  getSvgElementSize(selector: string): Promise<[number, number]> {
    return this.page.evaluate((selector) => {
      const element = document.querySelector(selector) as SVGElement;
      return [
        Number(element.getAttribute("width")),
        Number(element.getAttribute("height")),
      ];
    }, selector);
  }

  clickAtCoordinate(options: {
    x: number;
    y: number;
    button?: "left" | "right" | "middle";
  }): Promise<void> {
    return this.page.mouse.click(options.x, options.y, {
      button: options.button,
    });
  }
  zoom(selector: string, value = 50): Promise<any> {
    // https://playwright.dev/docs/api/class-page#page-click
    // return this.page.evaluate(() => {
    //   window.scroll(100, 0)
    // });
    return this.page
      .click(selector)
      .then(() => this.page.mouse.move(500, 500))
      .then(() => this.page.mouse.wheel(value, 0))
      .then(() => new Promise((resolve) => setTimeout(resolve, 100)))
      .catch((e) => {
        console.error("error", e);
        return Promise.resolve();
      });
  }

  autoWaitClick(selector: string): Promise<void> {
    // https://playwright.dev/docs/api/class-page#page-click
    return this.page.click(selector);
  }

  autoWaitFillField(selector: string, query: string): Promise<void> {
    // https://playwright.dev/docs/api/class-page#page-fill
    return this.page.fill(selector, query);
  }
}

export = CustomHelper;
