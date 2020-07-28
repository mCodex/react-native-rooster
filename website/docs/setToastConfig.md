---
id: setToastConfig
title: setToastConfig
sidebar_label: setToastConfig
---

You can change some configs globally. Right now, we only support `bgColor` for each type of toast. 

The default colors are:

- ![#7890f0](https://via.placeholder.com/15/7890f0/000000?text=+) Info: #7890f0

- ![#35d0ba](https://via.placeholder.com/15/35d0ba/000000?text=+) Success: #35d0ba

- ![#ff9100](https://via.placeholder.com/15/ff9100/000000?text=+) Warning: #ff9100

- ![#d92027](https://via.placeholder.com/15/d92027/000000?text=+) Error: #d92027


For example:

```javascript
import { setToastConfig } from 'react-native-rooster';

setToastConfig({
  bgColor: {
      success: 'olive',
    },
})
```