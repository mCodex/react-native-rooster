---
id: removeToast
title: removeToast
sidebar_label: removeToast
---

All toasts are automatically removed after 1.5s. However, you can manually pop the last toast from screen doing:

```jsx
import { removeToast } from 'react-native-rooster';

removeToast();
```

**NOTE:** You can also change the default time to dismiss by setting `timeToDismiss`option in `setToastConfig`, for more information check [here](setToastConfig#timetodismiss).