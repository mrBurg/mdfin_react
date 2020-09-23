import { ENVIRONMENT } from '../constants';

export const isServer: boolean = typeof window === 'undefined';
export const isBrowser: boolean = process.browser;
export const isDev = ENVIRONMENT == 'development';
export const isTest = ENVIRONMENT == 'test';
export const isProd = ENVIRONMENT == 'production';
