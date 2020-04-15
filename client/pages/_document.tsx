import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';
import Manifest from 'next-manifest/manifest';
// @ts-ignore
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const styledComponentSheet = new ServerStyleSheet();

    try {
      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [
          <React.Fragment key="styles">
            {initialProps.styles}

            {styledComponentSheet.getStyleElement()}
          </React.Fragment>
        ]
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
