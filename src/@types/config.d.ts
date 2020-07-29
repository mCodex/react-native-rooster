declare interface IConfig {
  font: {
    fontFamily?: string | null;
  };
  bgColor: {
    error: string;
    success: string;
    warning: string;
    info: string;
  };
}
