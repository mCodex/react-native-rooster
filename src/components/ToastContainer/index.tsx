import React, { useEffect, useRef } from 'react';
import { Animated, KeyboardAvoidingView } from 'react-native';

import useToast from 'hooks/useToast';

import Toast from 'components/Toast';

interface IToastComponent {
  messages: IToastMessage[];
  toastConfig: IConfig;
}

const ToastContainer: React.FC<IToastComponent> = (props) => {
  const { removeToast } = useToast();

  const { current: fadeAnim } = useRef(new Animated.Value(0));

  const { messages, toastConfig } = props;

  useEffect(() => {
    messages.map(({ id }) => {
      const timer = setTimeout(() => removeToast(id), 3000);

      return () => {
        clearTimeout(timer);
      };
    });
  }, [messages, removeToast]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      // easing: Easing.bounce,
      useNativeDriver: false,
    }).start();

    return () =>
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        // easing: Easing.bounce,
        useNativeDriver: false,
      }).start();
  }, [fadeAnim]);

  return (
    <KeyboardAvoidingView>
      {messages.map((message) => (
        <Toast key={message.id} message={message} toastConfig={toastConfig} />
      ))}
    </KeyboardAvoidingView>
  );
};

export default ToastContainer;
