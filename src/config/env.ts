import dotenv from 'dotenv';
dotenv.config();

export const getEnv = (key: string, required: boolean = false): string => {
  const value = process.env[key];
  if (value == undefined && required)
    throw new Error(`Missing required environment variable: ${key}`);
  return value ?? '';
};

export const env = {
  NODE_ENV: getEnv('NODE_ENV', true),
  APP_NAME: getEnv('APP_NAME', true),
  PORT: parseInt(getEnv('PORT', true)),

  get isDevelopment() {
    return this.NODE_ENV === 'development';
  },
};
