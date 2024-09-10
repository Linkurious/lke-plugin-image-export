import { LaunchOptions } from "playwright";

const headless = process.env.HEADLESS === "false" ? false : true;

const port = process.env.PORT || 4001;
export const config = {
  browser: process.env.BROWSER || "chromium",
  browserOptions: {
    headless,
  } as LaunchOptions,
  BASE_URL: `http://localhost:${port}`,
  PORT: port,
  BASE_SERVER_URL: `http://localhost:${port}`,
  IMG_THRESHOLD: { threshold: 0.4 },
};
