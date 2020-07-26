declare interface IToastContext {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}
