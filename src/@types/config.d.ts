declare interface IConfig {
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
}
