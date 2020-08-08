---
id: addToast
title: addToast
sidebar_label: addToast
---

Use this method to render a toast on screen.

The available options are:

```jsx
{
  type?: 'success' | 'error' | 'info' | 'warning'; // default: info
  title?: string;
  message: string;
}
```

For example, displaying a success toast would be:

```jsx
import { addToast } from 'react-native-rooster';

addToast({
  type: 'success',
  message: 'Success message'
});
```