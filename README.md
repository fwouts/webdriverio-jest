# WebdriverIO with Jest

This is the simplest possible example of a WebdriverIO test written with the Jest framework.

Because WebdriverIO doesn't support Jest as a first-class citizen, this test suite leverages the
WebdriverIO remote API. This means that we need to do a few things ourselves, such as starting up
Selenium server as well as the browser. It also means that we must to use `async`/`await`
statements.

## How to use it

```sh
npm install
npm test
```

## Picking a different browser

The browser is chosen based on the `BROWSER_NAME` environment variable, defaulting to `chrome`.

Examples:
```
BROWSER_NAME=chrome yarn test
BROWSER_NAME=safari yarn test
BROWSER_NAME=firefox yarn test
BROWSER_NAME="internet explorer" yarn test
BROWSER_NAME=MicrosoftEdge yarn test
```

# Running with Chrome headless

Simply set the `HEADLESS` environment variable:
```
HEADLESS=1 yarn test
```
