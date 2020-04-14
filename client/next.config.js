const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');
const lessToJS = require('less-vars-to-js');
const withOffline = require('next-offline');
const withManifest = require('next-manifest');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const compose = require('next-compose');

const { version } = require('./package.json');

const manifestConfig = {
  manifest: {
    output: './public/', // The folder where the manifest will be generated.
    version: version,
    name: '',
    short_name: '',
    start_url: '',
    Theme_color: '#24b5b5',
    background_color: '#24b5b5',
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
};

const nextOfflineConfig = {
  target: 'serverless',
  transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
  // Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
  // turn on the SW in dev mode so that we can actually test it
  generateInDevMode: true,
  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
};

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './public/theme.less'), 'utf8')
);

const configFile = require('path').resolve(
  process.cwd(),
  process.env.CONFIG_PATH || '.env'
);

require('dotenv').config({ path: configFile });

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

const config = compose([
  [withManifest, manifestConfig],
  // [withOffline, nextOfflineConfig],
  // [withSourceMaps],
  [
    withCSS,
    {
      cssModules: true,
      cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: '[local]___[hash:base64:5]'
      }
    }
  ],
  [
    withLess,
    {
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables // make your antd custom effective
      }
    }
  ],
  {
    webpack: (config, { isServer, buildId }) => {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.SENTRY_RELEASE': JSON.stringify(buildId)
        })
      );

      if (!isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser';
      }

      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals)
        ];

        config.plugins.push(new webpack.IgnorePlugin(/pages.*\/test.*/));

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader'
        });
      }
      return config;
    }
  }
]);

config.excludeFile = str => /\*.{spec,test}.js/.test(str);

config.publicRuntimeConfig = {
  SERVER_BASE_URL: process.env.SERVER_BASE_URL || 'api.playcodenames.online',
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
  WEBSOCKET_BASE_URL: process.env.WEBSOCKET_BASE_URL
};

module.exports = config;
