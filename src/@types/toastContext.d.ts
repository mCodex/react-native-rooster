declare interface IToastContext {
  addToast(message: Omit<IToastMessage, 'id'>): void;
  removeToast(id?: string): void;
  toastConfig(config: IConfig): void;
}
