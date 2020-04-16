import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';
import Manifest from 'next-manifest/manifest';
import * as Sentry from '@sentry/browser';

process.on('unhandledRejection', err => {
  Sentry.captureException(err);
});

process.on('uncaughtException', err => {
  Sentry.captureException(err);
});

// @ts-ignore
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Step 1: Create an instance of ServerStyleSheet
    const styledComponentSheet = new ServerStyleSheet();

    // Step 2: Retrieve styles from components in the page
    const page = ctx.renderPage(App => props =>
      styledComponentSheet.collectStyles(<App {...props} />)
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = styledComponentSheet.getStyleElement();

    try {
      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [<React.Fragment key="styles">{styleTags}</React.Fragment>]
      };
    } finally {
      styledComponentSheet.seal();
    }
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <style>
            {`
            #__next { height: 100% }
          `}
          </style>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
          <link rel="stylesheet" type="text/css" href="/nprogress.css" />
          <Manifest
            // path for manifest will be deploying
            href="/manifest.json"
            // color for `theme-color`
            themeColor="#24b5b5"
            // scale for `viewport` meta tag
            initialScale="1"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
