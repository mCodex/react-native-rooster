import React, { useCallback, useState } from 'react';

import ToastContainer from 'components/ToastContainer';
import ToastContext from 'contexts/ToastContext';

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<IToastMessage[]>([]);
  const [config, setConfig] = useState<IConfig>({
    colors: {
      error: '#d92027',
      success: '#35d0ba',
      warning: '#ff9100',
      info: '#95b3d8',
    },
  });

  const addToast = useCallback(
    ({ type, title, message }: Omit<IToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 5);

      const toast = {
        id,
        type,
        title,
        message,
      };

      setMessages((prevState) => [...prevState, toast]);
    },
    [],
  );

  const removeToast = useCallback(
    (id?: string) => {
      if (id) {
        setMessages((state) => state.filter((s) => s.id !== id));
      } else if (messages.length > 0) {
        const messagesClone = [...messages];
        messagesClone.pop();
        setMessages(messagesClone);
      }
    },
    [messages],
  );

  const toastConfig = useCallback((updatedConfig: IConfig) => {
    setConfig((state) => ({ ...state, ...updatedConfig }));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toastConfig }}>
      {children}
      <ToastContainer messages={messages} toastConfig={config} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
