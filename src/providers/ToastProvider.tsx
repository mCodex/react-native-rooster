import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ToastContainer from '../components/ToastContainer';
import { DEFAULT_TOAST_CONFIG } from '../constants/defaultConfig';
import ToastContext from '../contexts/ToastContext';
import type { ToastConfig, ToastMessage, ToastProviderProps } from '../types';
import createToastId from '../utils/createToastId';
import mergeToastConfig from '../utils/mergeToastConfig';

/**
 * Top-level provider responsible for storing toast messages and configuration.
 */
const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  initialConfig,
}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const [config, setConfig] = useState<ToastConfig>(() =>
    mergeToastConfig(DEFAULT_TOAST_CONFIG, initialConfig ?? {})
  );

  useEffect(() => {
    if (initialConfig) {
      setConfig((current: ToastConfig) =>
        mergeToastConfig(current, initialConfig)
      );
    }
  }, [initialConfig]);

  const addToast = useCallback((messageData: Omit<ToastMessage, 'id'>) => {
    const toast: ToastMessage = {
      id: createToastId(),
      ...messageData,
    };

    setMessages((current: ToastMessage[]) => current.concat(toast));
  }, []);

  const removeToast = useCallback((id?: string) => {
    setMessages((current: ToastMessage[]) => {
      if (id) {
        return current.filter((toast: ToastMessage) => toast.id !== id);
      }

      if (current.length <= 1) {
        return [];
      }

      return current.slice(0, -1);
    });
  }, []);

  const setToastConfig = useCallback((partialConfig: Partial<ToastConfig>) => {
    setConfig((current: ToastConfig) =>
      mergeToastConfig(current, partialConfig)
    );
  }, []);

  const contextValue = useMemo(
    () => ({ addToast, removeToast, setToastConfig }),
    [addToast, removeToast, setToastConfig]
  );

  return (
    <SafeAreaProvider>
      <ToastContext.Provider value={contextValue}>
        {children}
        <ToastContainer
          messages={messages}
          toastConfig={config}
          onRemove={(id: string) => removeToast(id)}
        />
      </ToastContext.Provider>
    </SafeAreaProvider>
  );
};

export default ToastProvider;
