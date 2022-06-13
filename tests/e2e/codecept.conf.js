require('ts-node/register');

const { setHeadlessWhen, setWindowSize } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.CI);

// Window size
const windowWidth = 1280;
const windowHeight = 720;
setWindowSize(windowWidth, windowHeight);
const baseUrl = `http://localhost:${process.env.PORT || 8000}`;

const emulateOptions = process.env.TEST_RETINA
  ? { isMobile: false, deviceScaleFactor: 2 }
  : undefined;

exports.config = {
  output: '../../reports/html/e2e',
  timeout: 5000,
  helpers: {
    Playwright: {
      url: baseUrl,
      show: false,
      browser: 'chromium',
      emulate: emulateOptions,
      chromium: {
        chromiumSandbox: true, // https://playwright.dev/docs/ci/#docker
        args: []
      }
    },
    CustomHelper: {
      require: './helpers/customHelper'
    }
  },
  gherkin: {
    features: './features/**/*.feature',
    steps: './steps/**/*.ts'
  },
  name: 'Ogma',
  grep: process.env.GREP,
  plugins: {
    testomat: {
      enabled: true,
      require: '@testomatio/reporter/lib/adapter/codecept',
      apiKey: process.env.TESTOMATIO
    },
    stepByStepReport: {
      enabled: process.env.CI,
      output: '../../reports/html/e2e',
      ignoreSteps: ['grab*', 'wait*'],
      fullPageScreenshots: true
    }
  },
  async bootstrap() {}
};
