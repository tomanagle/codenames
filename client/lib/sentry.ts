import * as Sentry from '@sentry/node';
import { SENTRY_DSN, IS_SERVER, IS_DEBUG } from '../config/env.js';
import { get } from 'lodash';

function initSentry() {
  Sentry.init({
    dsn: SENTRY_DSN,
    release: process.env.SENTRY_RELEASE,
    debug: IS_DEBUG,
    environment: IS_DEBUG ? 'development' : 'production'
  });

  Sentry.configureScope(scope => {
    // Set if this is an SSR error or not
    scope.setTag('server', IS_SERVER);
  });
}
export default initSentry;
