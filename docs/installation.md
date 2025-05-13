---
id: installation
title: Installation
sidebar_label: Installation
---

To install react-native-rooster's package:

```bash npm2yarn
npm install --save react-native-rooster
```

## Import and wrap your application within RNRooster's provider

You must import and wrap your application using our provider. Check out this [example](https://github.com/mCodex/react-native-rooster/blob/master/example/src/routes/index.tsx#L18-L20).


```jsx
import { ToastProvider } from 'react-native-rooster';

<ToastProvider>
    {...}
</ToastProvider>
```

Now you're ready to setup some toasts in your application 😃