import { createContext } from 'react';

const ToastContext = createContext<IToastContext>({} as IToastContext);

export default ToastContext;
