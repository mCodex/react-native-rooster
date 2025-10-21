import type { ToastConfig } from '../types';

/** Deep-merges toast configuration objects without mutating either input. */
const mergeToastConfig = (
  base: ToastConfig,
  patch: Partial<ToastConfig>
): ToastConfig => {
  const merged: ToastConfig = {
    ...base,
    ...patch,
    bgColor: {
      ...base.bgColor,
      ...(patch.bgColor ?? {}),
    },
  };

  if (base.font || patch.font) {
    merged.font = {
      ...(base.font ?? {}),
      ...(patch.font ?? {}),
    };
  }

  if (base.animation || patch.animation) {
    merged.animation = {
      ...(base.animation ?? {}),
      ...(patch.animation ?? {}),
    };
  }

  if (base.position || patch.position) {
    merged.position = {
      ...(base.position ?? {}),
      ...(patch.position ?? {}),
    };

    if (!merged.position.vertical) {
      merged.position.vertical = merged.placement ?? base.position?.vertical;
    }

    if (!merged.position.horizontal) {
      merged.position.horizontal =
        merged.horizontalPosition ?? base.position?.horizontal;
    }
  }

  if (base.padding || patch.padding) {
    merged.padding = {
      ...(base.padding ?? {}),
      ...(patch.padding ?? {}),
    };
  }

  if (base.shadow || patch.shadow) {
    merged.shadow = {
      ...(base.shadow ?? {}),
      ...(patch.shadow ?? {}),
    };
  }

  if (base.accessibility || patch.accessibility) {
    merged.accessibility = {
      ...(base.accessibility ?? {}),
      ...(patch.accessibility ?? {}),
    };
  }

  return merged;
};

export default mergeToastConfig;
