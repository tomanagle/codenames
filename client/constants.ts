import getConfig from 'next/config';
export const IS_DEV = process.env.NODE_ENV === 'development';

const { publicRuntimeConfig } = getConfig();

export const IS_SERVER = !process.browser;

export const {
  SERVER_BASE_URL,
  WEBSOCKET_BASE_URL,
  CLIENT_BASE_URL
} = publicRuntimeConfig;

export const SENTRY_DSN = process.env.SENTRY_DSN || '';
