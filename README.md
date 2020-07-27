<img alt="RNRooster" src="./cover.png" />

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![npm version](https://badge.fury.io/js/react-native-rooster.svg)](https://badge.fury.io/js/react-native-rooster)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-rooster)

# react-native-rooster

An elegant Toast solution for react-native apps. Built using Typescript, hooks and context. It works on Android and iOS platforms

<p align="center">
  <img alt="Demo" src="./demo.gif" />
</p>

## 🌟 Motivation

I've been working on React-Native projects for a long time and I use toast very often, but I still haven't found a library that is flexible enough for handling toasts. So, I decided to work on this to build a flexible and functional Toast library powerful like [react-toastify](https://github.com/fkhadra/react-toastify)

## ⬇️ Installation

```bash
yarn add react-native-rooster styled-components
```

or

```bash
npm i react-native-rooster styled-components
```

## 🛠 How it works

First, you need to import and wrap your application within ToastProvider:

```javascript
import { ToastProvider } from 'react-native-rooster';

<ToastProvider>
    {...}
</ToastProvider>
```

Now you can use our hooks to show your toasts:

```javascript
import { useToast } from 'react-native-rooster';

addToast({
  type: 'success', //optional - default: info
  title: 'Error', //optional - default: none
  message: 'An error ocurred'
})
```

## 🔗 API

### ToastProvider

It is the provider which controls displaying new toasts

### addToast([params](./src/@types/toast.d.ts))

Will show a new toast based on given parameters. Also, it will automatically disappear after 3 seconds on the screen.

### removeToast()

Removes the last toast from screen.

### setToastConfig([params](./src/@types/config.d.ts))

You can change some configs globally. Right now, we only support `bgColor` for each type of toast. The default colors for each type of toast are:

- ![#7890f0](https://via.placeholder.com/15/7890f0/000000?text=+) `Info: #7890f0`

- ![#35d0ba](https://via.placeholder.com/15/35d0ba/000000?text=+) `Success: #35d0ba`

- ![#ff9100](https://via.placeholder.com/15/ff9100/000000?text=+) `Warning: #ff9100`

- ![#d92027](https://via.placeholder.com/15/d92027/000000?text=+) `Error: #d92027`


For example:

```javascript
import { setToastConfig } from 'react-native-rooster';

addToast({
  bgColor: {
      success: 'olive',
    },
})
```

## 📦 Features

- [x] Automatically keyboard listener. If keyboard is open the toast will not be hidden by it

- [x] Support for different types of toasts (success, info, warning)
- [ ] Support for different positions (top, center, top-left, top-right and so on...)
- [ ] Support for icons
- [ ] Support for multiple toasts being shown at the same time
- [ ] Support for toasts be used inside regular functions not only components' functions

Have more ideas? Put it here!

## 🤝 Contributing

You can clone this repository and just run:

```bash
yarn localPublish
```

After that, you can run the example project inside [example](./example)

### Changing Toast's code

Every change you do in the Toast component you must run again:

```bash
yarn localPublish
```

It will release a new Toast's local version and install it automatically in the example project

<hr/>
Pull requests are always welcome ❤️