import React, { useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';

import useToast from 'hooks/useToast';
import useKeyboard from 'hooks/useKeyboard';

import Toast from 'components/Toast';

interface IToastComponent {
  messages: IToastMessage[];
  toastConfig: IConfig;
}

const ToastContainer: React.FC<IToastComponent> = (props) => {
  const [keyboardHeight] = useKeyboard();
  const { removeToast } = useToast();

  const { messages, toastConfig } = props;

  useEffect(() => {
    messages.map(({ id }) => {
      const { timeToDismiss } = toastConfig;
      const timer = setTimeout(() => removeToast(id), timeToDismiss);

      return () => {
        clearTimeout(timer);
      };
    });
  }, [messages, removeToast, toastConfig]);

  return (
    // @ts-ignore
    <KeyboardAvoidingView>
      {messages.map((message) => (
        <Toast
          key={message.id}
          message={message}
          toastConfig={toastConfig}
          keyboardHeight={keyboardHeight}
        />
      ))}
    </KeyboardAvoidingView>
  );
};

export default ToastContainer;
