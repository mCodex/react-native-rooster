---
id: contributing
title: Contributing
sidebar_label: Contributing
---

You can fork RNRooster's repository. Then, you run:

```bash
yarn
```

To install the dependencies. Then, you must run:

```bash
yarn localPublish
```

This command will use `yalc` to create a local package of RNRooster. After that, you can run the example project inside [example](https://github.com/mCodex/react-native-rooster/tree/master/example) folder. Every change you do in the Toast component you must run again:

```bash
yarn localPublish
```

It will release a new Toast's local version and install it automatically in the example project