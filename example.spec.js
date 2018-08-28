import * as selenium from "selenium-standalone";
import * as webdriverio from "webdriverio";

// We expect the test to take a while, by nature.
jest.setTimeout(60000);

let seleniumProcess;
let browser;

beforeAll(async () => {
  // Install Selenium if required.
  await new Promise(resolve => {
    selenium.install(resolve);
  });
  // Start Selenium server.
  seleniumProcess = await new Promise((resolve, reject) =>
    selenium.start((error, childProcess) => {
      if (error) {
        reject(error);
      } else {
        resolve(childProcess);
      }
    })
  );
});

afterAll(async () => {
  // Kill Selenium server.
  await seleniumProcess.kill();
});

beforeEach(async () => {
  // Configure the browser via BROWSER_NAME environment variable.
  // Setting HEADLESS to 1 will run the browser in headless mode (only available on Chrome).
  browser = webdriverio.remote({
    desiredCapabilities: {
      browserName: process.env.BROWSER_NAME || "chrome",
      chromeOptions: {
        args:
          process.env.HEADLESS === "1"
            ? ["--headless", "--disable-gpu", "--window-size=1280,800"]
            : []
      }
    },
    // Wait for at most 10 seconds for elements to appear.
    waitforTimeout: 10000
  });
  await browser.init();
});

afterEach(async () => {
  await browser.end();
});

const GOOGLE_SEARCH_INPUT_SELECTOR = `input[name="q"]`;
const GOOGLE_SEARCH_BUTTON_SELECTOR = `input[value="Google Search"]`;
const GITHUB_ISSUE_TITLE_SELECTOR = "*=Issue #2052";
const GITHUB_COMMENT_SELECTOR =
  "p*=Here is a minimal example of a WebdriverIO test written with the Jest framework:";

describe("Google", () => {
  it("can search on Google", async () => {
    // Load Google Search.
    await browser.url("https://www.google.com");
    // Wait until the search field is visible.
    await browser.waitForVisible(GOOGLE_SEARCH_INPUT_SELECTOR);
    // Start typing. No need to click on the search field, as it should be automatically focused.
    await browser.keys("WebdriverIO Jest");
    // Click search.
    await browser.click(GOOGLE_SEARCH_BUTTON_SELECTOR);
    // Wait until we find the relevant GitHub issue.
    await browser.waitForVisible(GITHUB_ISSUE_TITLE_SELECTOR);
    // Click through to GitHub.
    await browser.click(GITHUB_ISSUE_TITLE_SELECTOR);
    // Find the relevant answer.
    await browser.waitForExist(GITHUB_COMMENT_SELECTOR);
    // Scroll to it.
    await browser.scroll(GITHUB_COMMENT_SELECTOR);
    // Ensure it's now visible.
    await browser.waitForVisible(GITHUB_COMMENT_SELECTOR);
  });
});
