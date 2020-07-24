const { NODE_ENV } = process.env;

export const isServer: boolean = typeof window === 'undefined';
export const isBrowser: boolean = process.browser;
export const isDev = NODE_ENV !== 'production';
