const getWorldParams = () => {
  const params = {
    foo: "bar",
    IS_DEV: process.env.NODE_ENV === "development",
  };

  return params;
};

const config = {
  import: ["tsx", "tests/e2e/**/*.ts"],
  paths: ["tests/e2e/features/preview.feature"],
  format: [
    // 'message:e2e/reports/cucumber-report.ndjson',
    "json:reports/cucumber-report.json",
    "html:reports/report.html",
    "summary",
    "progress-bar",
    "@cucumber/pretty-formatter",
  ],
  formatOptions: { snippetInterface: "async-await" },
  worldParameters: getWorldParams(),
};

export default config;
