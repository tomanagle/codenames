import * as Sentry from '@sentry/node';

import { SENTRY_DSN, IS_SERVER, IS_DEV } from '../constants';

function initSentry() {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.warn('Sentry is disabled when running in developer mode');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    release: process.env.SENTRY_RELEASE,
    debug: IS_DEV,
    environment: IS_DEV ? 'development' : 'production'
  });

  Sentry.configureScope(scope => {
    // Set if this is an SSR error or not
    scope.setTag('server', String(IS_SERVER));
  });

  Sentry.configureScope(scope => {
    // Set if this is an SSR error or not
    scope.setTag('server', String(IS_SERVER));
  });
}
export default initSentry;
