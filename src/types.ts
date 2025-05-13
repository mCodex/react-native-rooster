export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

export interface ToastConfig {
  font?: {
    fontFamilyRegular?: string | null;
    fontFamilyBold?: string | null;
  };
  bgColor: {
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  timeToDismiss: number;
}

export interface ToastContextProps {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id?: string): void;
  setToastConfig(config: ToastConfig): void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<ToastConfig>;
}
