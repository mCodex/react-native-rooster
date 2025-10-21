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

  return merged;
};

export default mergeToastConfig;
