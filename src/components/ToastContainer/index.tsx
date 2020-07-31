import React, { useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { useTransition } from 'react-spring/native';

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

  const messagesTransitions = useTransition(messages, (message) => message.id, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
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
      {messagesTransitions.map(({ item, key, props: transitionProps }) => (
        <Toast
          key={key}
          message={item}
          toastConfig={toastConfig}
          keyboardHeight={keyboardHeight}
          style={transitionProps}
        />
      ))}
    </KeyboardAvoidingView>
  );
};

export default ToastContainer;
