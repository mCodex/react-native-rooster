<img alt="RNRooster" src="./cover.png" />

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![npm version](https://badge.fury.io/js/react-native-rooster.svg)](https://badge.fury.io/js/react-native-rooster)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-rooster)
![snyk](https://img.shields.io/snyk/vulnerabilities/npm/react-native-rooster)
![website](https://img.shields.io/website?url=https%3A%2F%2Fmcodex.dev%2Freact-native-rooster)

# react-native-rooster

An elegant Toast solution for react-native apps. Built using Typescript, hooks and context with multiplatform support: Android, iOS, Expo, MacOS and Windows.

<p align="center">
  <img alt="Demo" src="./demo.gif" />
</p>

## 📚 Docs

Check out the docs [here](https://mcodex.dev/react-native-rooster) for installation and usage instructions

<hr/>
Pull requests are always welcome ❤️
  
## 🛠️ Development
Follow these steps to set up the project locally and contribute:

1. Clone the repository
```bash
git clone https://github.com/mcodex/react-native-rooster.git
cd react-native-rooster
```
2. Install dependencies
```bash
yarn install         # install library dependencies
cd example && yarn install   # install example app dependencies
```
3. Run the example app
```bash
cd example
yarn start           # start Metro bundler
yarn ios             # run on iOS simulator (or yarn android)
```
4. Build the library
```bash
cd react-native-rooster
yarn build           # compile TypeScript and bundle with Rollup
```
4.1 Use yalc for local integration testing
Install yalc globally if you haven't already:
```bash
npm install -g yalc        # or yarn global add yalc
```
Publish the freshly built package:
```bash
yalc publish              # pushes lib to local yalc store
```
Link into the example app:
```bash
cd example
yalc add react-native-rooster   # installs the local package
yarn install                     # ensure dependencies are up to date
```
Now run the example to verify changes:
```bash
yarn start                        # start Metro bundler
yarn ios || yarn android          # launch on simulator/device
```
5. Run tests and lint
```bash
yarn test            # run Jest unit tests
yarn lint            # run ESLint
```
6. Release process
 - Bump version in `package.json`
 - Commit changes and create a Git tag
 - Push to GitHub; CI will publish to npm on merge

Make sure to follow existing code style and add tests for new features.