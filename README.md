<header>

<div style="text-align: center">
<h1>Bitcoin blocks tracker</h1>

<p>Extension for track Bitcoin blocks and fees via Mempool space</p>

[README на Русском](./README.RU)

<a rel="noreferrer noopener" target="_blank" href="https://chromewebstore.google.com/detail/bitcoin-blocks-tracker/jhdbfjhembciojemihcimllmbibiakim">
    <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/jhdbfjhembciojemihcimllmbibiakim?color=red&label=%D0%B0%D0%BA%D1%82%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F&logo=google-chrome&logoColor=red&style=for-the-badge">
</a>
<a rel="noreferrer noopener" target="_blank" href="https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases">
    <img alt="Newest release" src="https://img.shields.io/github/v/release/IvanSavoskin/bitcoin-blocks-tracker-extension?label=%D1%81%D0%B2%D0%B5%D0%B6%D0%B8%D0%B9%20%D1%80%D0%B5%D0%BB%D0%B8%D0%B7&logo=github&style=for-the-badge">
</a>
<a href="https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension">
	<img src="https://img.shields.io/github/languages/top/IvanSavoskin/bitcoin-blocks-tracker-extension?style=flat-square&logo=github" alt="GitHub top language" />
</a>
<a href="https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/workflows/build/badge.svg">
	<img src="https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/workflows/build/badge.svg" alt="Build" />
</a>
</div>

</header>

## Introduction

This extension was created to easily and conveniently track the emergence of new blocks in the Bitcoin network.
After the new block is mined, the extension notifies the user with a sound signal.
The extension also allows you to quickly monitor current commissions on the network.

Obtaining blocks and fees data is done using [mempool.space](https://mempool.space/)

## Features

- Receiving sound notification when a new block appears in the mainnet or testnet of the 
Bitcoin network
- Receiving a sound notification when the fee in the network crosses a specified value
- Obtaining information about current fees in the Bitcoin network
- Obtaining information about the time the last block appeared

## Installation

**Click [here][1], then click "Add to Chrome"**

> * Developed and tested for **Google Chrome**
> * Can be installed on any Chromium browser - Opera (GX), Vivaldi, etc.
> * In Microsoft Edge, click "Allow extensions from other stores" fisrt (is asked)

### Firefox version when?

There are currently no plans to support Firefox.

1. Firefox does not support some crucial functions *(Background service workers)*.
2. Partial support will require an extensive tooling changes.
3. There is no demand for the Firefox version.

## Local installation

### Prerequisites
1. Download [latest release][2] or the whole repository
2. Install Node.js (required version in [package.json](./package.json))
3. Compatible `npm` must be installed
4. In the terminal, run the `npm install` command from the project folder

### Linters
To monitor the quality of the code, the project provides for the connection of linters.

#### ESLint
Rules for ESLint are specified in the `/.eslintrc` file.

Code checking using ESLint starts with the command `npm run eslint`.

#### Stylelint
Rules for Stylelint are specified in the `/.stylelintrc.json` file.

Styles checking using Stylelint starts with the command `npm run stylelint`.

### Development build
Start the dev build with the command `npm run dev`.

After build, a folder `/dist` will be created with the built extension,
which can be used to add to the browser.

Each code change initiates a rebuild of the extension automatically.

During build, a source map is also added to enable the use of Chrome Dev Tools

### Production build
Start the prod build with the command `npm run prod`.

Before building, code checking is automatically run using ESLint and StyleLint.

Built project is stored in the `/dist` folder.

### Load extension to Chrome

Load `dist` directory on Chrome extension page ([instruction](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked))

[1]: https://chromewebstore.google.com/detail/bitcoin-blocks-tracker/jhdbfjhembciojemihcimllmbibiakim
[2]: https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases
