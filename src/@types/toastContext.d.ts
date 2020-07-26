declare interface IToastContext {
  addToast(message: Omit<IToastMessage, 'id'>): void;
  removeToast(id?: string): void;
  setToastConfig(config: IConfig): void;
}
