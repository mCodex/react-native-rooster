import React, { useCallback, useState } from 'react';

import ToastContainer from 'components/ToastContainer';
import ToastContext from 'contexts/ToastContext';

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<IToastMessage[]>([]);

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

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
