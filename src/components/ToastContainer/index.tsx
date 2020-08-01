import React, { useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { useTransition, config } from 'react-spring/native';

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

  const messagesTransition = useTransition(messages, {
    key: (message) => message.id,
    from: { opacity: 0, life: '100%' },
    enter: () => async (next) => next({ opacity: 1 }),
    leave: () => async (next) => {
      await next({ life: '0%' });
      await next({ opacity: 0 });
    },
    config: config.slow,
  });

  useEffect(() => {
    messages.map(({ id }) => {
      const timer = setTimeout(() => removeToast(id), 3000);

      return () => {
        clearTimeout(timer);
      };
    });
  }, [messages, removeToast]);

  return (
    <KeyboardAvoidingView>
      {messagesTransition((style, item) => (
        <Toast
          key={item.id}
          message={item}
          toastConfig={toastConfig}
          keyboardHeight={keyboardHeight}
          style={style}
        />
      ))}
    </KeyboardAvoidingView>
  );
};

export default ToastContainer;
