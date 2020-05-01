import getConfig from 'next/config';
export const IS_DEV = process.env.NODE_ENV === 'development';

const { publicRuntimeConfig } = getConfig();

export const IS_SERVER = !process.browser;

export const {
  SERVER_BASE_URL,
  WEBSOCKET_BASE_URL,
  CLIENT_BASE_URL,
  GA_ID,
  SENTRY_DSN
} = publicRuntimeConfig;

export const BLUE_COLOUR = '#2296f2';
export const RED_COLOUR = '#ff1744';
