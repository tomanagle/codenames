import React from 'react';
import App from 'next/app';
import withGA from 'next-ga';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/react-hooks';
import Router from 'next/router';
import * as Sentry from '@sentry/node';
import withApolloClient from '../lib/with-apollo-client';
import { GA_ID } from '../constants';
import initSentry from '../lib/sentry';

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    initSentry();

    let pageProps = {
      query: null,
      userContext: null
    };
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // this exposes the query to the user
    pageProps.query = ctx.query;

    return { pageProps };
  }

  componentWillMount() {}

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }
  componentDidMount() {
    initSentry();
    console.log(
      '%cGet the full codebase here: https://github.com/tomanagle/codenames',
      'color: #e91e63; font-size: 16px'
    );

    console.log(
      '%cIf you like the game, please support the developer by buying me a coffee: https://www.buymeacoffee.com/tomn',
      'color: #fff;background-color: #24b5b5; font-size: 16px'
    );
  }
  render() {
    // @ts-ignore
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
}

export default withGA(GA_ID, Router)(withApolloClient(MyApp));
