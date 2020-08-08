---
id: setToastConfig
title: setToastConfig
sidebar_label: setToastConfig
---

You can change some configs globally.

# bgColor

You can change the default bgColors for each type of toast.

The default colors are:

- ![#7890f0](https://via.placeholder.com/15/7890f0/000000?text=+) Info: #7890f0

- ![#35d0ba](https://via.placeholder.com/15/35d0ba/000000?text=+) Success: #35d0ba

- ![#ff9100](https://via.placeholder.com/15/ff9100/000000?text=+) Warning: #ff9100

- ![#d92027](https://via.placeholder.com/15/d92027/000000?text=+) Error: #d92027


An example changing the default success' bgColor to olive:

```javascript
import { setToastConfig } from 'react-native-rooster';

setToastConfig({
  bgColor: {
      success: 'olive',
    },
})
```

# font

You can change the custom fontFamily for the texts.

| option            | required | default                   | Description                                 |
|-------------------|----------|---------------------------|---------------------------------------------|
| fontFamilyRegular | No       | React-Native default font | Changes the regular font used within toasts |
| fontFamilyBold    | No       | React-Native default font | Changes the bold font used within toasts    |

**Note:** You must have previously configured the desired custom font in your project.

An example changing `fontFamilyBold` to `Montserrat` family:

```javascript
import { setToastConfig } from 'react-native-rooster';

setToastConfig({
  font: {
      fontFamilyBold: 'Montserrat-Bold',
    },
})
```

# timeToDismiss

You can change the default toast's time to dismiss.

| option            | required | default (ms) 
|-------------------|----------|---------
| timeToDismiss     | No       | 1500

To change this to 4000ms you can just do:

```javascript
import { setToastConfig } from 'react-native-rooster';

setToastConfig({
  timeToDismiss: 4000
})
```