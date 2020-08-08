import React, { useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { useTransition } from 'react-spring/native.cjs';

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
    from: { opacity: 0 },
    enter: () => async (next) => {
      await next({ opacity: 1 });
      // await next({ life: '100%' });
    },
    leave: () => async (next) => {
      await next({ life: '0%' });
      await next({ opacity: 0 });
    },
    config: { duration: toastConfig.timeToDismiss },
  });

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
