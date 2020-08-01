---
id: installation
title: Installation
sidebar_label: Installation
---


## v1.1.0

To install react-native-rooster's package:

### Using yarn

```bash
yarn add react-native-rooster styled-components
```

### Using npm

```bash
npm i react-native-rooster styled-components
```


## v1.2.0 (beta)

This version includes all features from v1.1.0 plus:

- [x] Animation on toast show and hide
- [ ] Support for different toast's position on screen [#2](https://github.com/mCodex/react-native-rooster/issues/2)
- [ ] Customize toast's timing on screen [#4](https://github.com/mCodex/react-native-rooster/issues/4)

### Using yarn

```bash
yarn add react-native-rooster@next styled-components
```

### Using npm

```bash
npm i react-native-rooster@next styled-components
```

Check out the status of this version [here](https://github.com/mCodex/react-native-rooster/projects/1)

**NOTE:** RNRooster relies on styled-components because it makes easier to handle different kinds of style props and also helps making the code cleaner. You should install manually styled-components in your project (using one of the commands above).

## Import and wrap your application within RNRooster's provider

You must import and wrap your application using our provider. Check out this [example](https://github.com/mCodex/react-native-rooster/blob/master/example/src/routes/index.tsx#L18-L20).


```javascript
import { ToastProvider } from 'react-native-rooster';

<ToastProvider>
    {...}
</ToastProvider>
```

Now you're ready to setup some toasts in your application 😃