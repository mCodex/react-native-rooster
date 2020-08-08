---
id: installation
title: Installation
sidebar_label: Installation
---

To install react-native-rooster's package:

### Using yarn

```bash
yarn add react-native-rooster styled-components
```

### Using npm

```bash
npm i react-native-rooster styled-components
```

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