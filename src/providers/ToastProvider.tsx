import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ToastContainer from 'components/ToastContainer';
import ToastContext from 'contexts/ToastContext';

interface IToastProvider {
  children: React.ReactNode;
}

const ToastProvider: React.FC<IToastProvider> = ({ children }) => {
  const [messages, setMessages] = useState<IToastMessage[]>([]);
  const [config, setConfig] = useState<IConfig>({
    bgColor: {
      error: '#d92027',
      success: '#35d0ba',
      warning: '#ff9100',
      info: '#7890f0',
    },
    timeToDismiss: 3000,
  });

  const addToast = useCallback(
    ({ type, title, message }: Omit<IToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substring(7);

      const toast = {
        id,
        type,
        title,
        message,
      };

      setMessages((prevState) => prevState.concat([toast]));
    },
    [],
  );

  const removeToast = useCallback(
    (id?: string) => {
      // Use requestAnimationFrame to ensure removal happens during the next frame
      // This prevents any visual glitches or blinking during state updates
      requestAnimationFrame(() => {
        if (id) {
          setMessages((state) => state.filter((s) => s.id !== id));
        } else if (messages.length > 0) {
          // Use slice instead of spread operator
          const messagesClone = messages.slice(0, messages.length - 1);
          setMessages(messagesClone);
        }
      });
    },
    [messages],
  );

  const setToastConfig = useCallback((updatedConfig: IConfig) => {
    setConfig((state) => {
      // merge top-level and deep bgColor using Object.assign instead of spread
      const merged: IConfig = Object.assign({}, state, updatedConfig);
      if (updatedConfig.bgColor) {
        merged.bgColor = Object.assign({}, state.bgColor, updatedConfig.bgColor);
      }
      return merged;
    });
  }, []);

  const contextValues = useMemo(
    () => ({ addToast, removeToast, setToastConfig }),
    [addToast, removeToast, setToastConfig],
  );

  return (
    <SafeAreaProvider>
    <ToastContext.Provider value={contextValues}>
      {children}
      <ToastContainer messages={messages} toastConfig={config} />
    </ToastContext.Provider>
    </SafeAreaProvider>
  );
};

export default ToastProvider;
