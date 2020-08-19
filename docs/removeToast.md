---
id: removeToast
title: removeToast
sidebar_label: removeToast
---

All toasts are automatically removed after 1.5s. However, you can manually pop the last toast from screen doing:

```jsx
import { useToast } from 'react-native-rooster';

const { removeToast } = useToast();

removeToast();
```

**NOTE:** You can also change the default time to dismiss by setting `timeToDismiss`option in `setToastConfig`, for more information check [here](setToastConfig#timetodismiss).