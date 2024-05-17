<header>

<div style="text-align: center">
<h1>Bitcoin blocks tracker</h1>

<p>Extension for track Bitcoin blocks and fees via Mempool space</p>

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
- Obtaining information about current fees in the Bitcoin network
- Obtaining information about the time the last block appeared

## Local installation

### Prerequisites
1. You need to preinstall `node@^20.x`
2. Compatible `npm` must be installed
3. In the terminal, run the `npm install` command from the project folder

### Linters
To monitor the quality of the code, the project provides for the connection of linters.

#### ESLint
Rules for ESLint are specified in the `/.eslintrc` file.

Code checking using ESLint starts with the command `npm run eslint`.

#### Stylelint
Rules for Stylelint are specified in the `kalita/.stylelintrc.json` file.

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
