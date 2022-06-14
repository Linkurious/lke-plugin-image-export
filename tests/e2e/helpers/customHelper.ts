import { Page } from 'playwright';

class CustomHelper extends Helper {
  get page(): Page {
    return (this.helpers as { Playwright: { page: Page } }).Playwright.page;
  }

  doubleClickAtCoordinate(coordinate: { x: number; y: number }): Promise<void> {
    return this.page.mouse.dblclick(coordinate.x, coordinate.y);
  }

  clickAtCoordinate(options: {
    x: number;
    y: number;
    button?: 'left' | 'right' | 'middle';
  }): Promise<void> {
    return this.page.mouse.click(options.x, options.y, {
      button: options.button
    });
  }
  zoom(selector: string, value = 50): Promise<any> {
    // https://playwright.dev/docs/api/class-page#page-click
    // return this.page.evaluate(() => {
    //   window.scroll(100, 0)
    // });
    return this.page.click(selector)
    .then(() => {
      this.page.mouse.wheel(value, 0);
    })
    .then(() => new Promise(resolve => setTimeout(resolve, 100)))
    .catch(e => {
      console.error('error', e);
      return Promise.resolve();
    })
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
