<img alt="RNRooster" src="./cover.png" />

An elegant Toast solution for react-native apps. Built using Typescript, hooks, contexts and providers. It works on Android and iOS platforms

<p align="center">
  <img alt="Demo" src="./demo.gif" />
</p>

## 🌟 Motivation

I've been working on React-Native projects for a long time and I use toast very often, but I still haven't found a library that is flexible enough for handling toasts. So, I decided to work on this to build a flexible and functional Toast library powerful like [react-toastify](https://github.com/fkhadra/react-toastify)


## 📦 Features

- [x] Automatically keyboard listener. If keyboard is open the toast will not be hidden by it

- [x] Support for different types of toasts (success, info, warning)
- [ ] Support for different positions (top, center, top-left, top-right and so on...)
- [ ] Support for icons
- [ ] Support for multiple toasts being shown at the same time
- [ ] Support for toasts be used inside regular functions not only components' functions

Have more ideas? Put it here!

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
  title: 'Error',
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

* <p style="color:#7890f0;">Info: #7890f0</p> 
* <p style="color:#35d0ba;">Success: #35d0ba</p> 
* <p style="color:#ff9100;">Warning: #ff9100</p> 
* <p style="color:#d92027;">Error: #d92027</p> 

For example:

```javascript
import { setToastConfig } from 'react-native-rooster';

addToast({
  bgColor: {
      success: 'olive',
    },
})
```

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