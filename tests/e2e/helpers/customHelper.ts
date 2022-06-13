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
