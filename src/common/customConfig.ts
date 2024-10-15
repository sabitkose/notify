require('dotenv').config();

export class CustomConfig {
  private static instance: CustomConfig;

  private constructor() {
  }

  public static getInstance(): CustomConfig {
    if (!CustomConfig.instance) {
      CustomConfig.instance = new CustomConfig();
    }
    return CustomConfig.instance;
  }

  static get AWS_SES_ACCESS_KEY_ID(){
    return process.env.AWS_SES_ACCESS_KEY_ID;
  }

  static get AWS_SES_SECRET_ACCESS_KEY(){
    return process.env.AWS_SES_SECRET_ACCESS_KEY;
  }

  static get AWS_REGION(){
    return process.env.AWS_REGION;
  }

  static get AWS_MAIL_FROM(){
    return process.env.AWS_MAIL_FROM;
  }

  static get APP_PORT(){
    return process.env.APP_PORT;
  }

  static get APP_SUPPORTED_LOCALES(){
    const strSupportedLocales = process.env.APP_SUPPORTED_LOCALES;
    const supportedLocales: string[] = strSupportedLocales.split(',').map(locale => locale.trim());
    return supportedLocales;
  }

  static get DB_URL(){
    return process.env.DB_URL
  }
}
