declare interface IToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
