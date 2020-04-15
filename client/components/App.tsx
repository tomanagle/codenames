import React, { useEffect } from 'react';
import { PageHeader, Layout as _Layout, Select, Row, Col } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import Coffee from '../components/Coffee';
const { Header: _Header, Footer: _Footer, Content: _Content } = _Layout;

const Layout = styled(_Layout)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled(_Header)`
  border-bottom: solid 1px #ccc;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  .site-page-header {
    background-color: #fff;
  }

  h1 {
    margin: 0;
  }
`;

const Content = styled(_Content)`
  padding: 10px 24px;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
`;

const Footer = styled(_Footer)`
  padding: 10px 24px !important;
  background-color: rgba(256, 256, 256, 0.8);
  position: relative;
  z-index: 3;
`;

const App = ({
  children,
  title,
  description,
  showFooter = true,
  showNav = false
}: {
  children: any;
  title: string;
  description: string;
  showFooter?: boolean;
  showNav?: boolean;
}) => {
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description} />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      {showNav && (
        <Header>
          <PageHeader
            className="site-page-header"
            title={
              <Link href="/" as="/">
                <a title="Home">
                  <h1>{title}</h1>
                </a>
              </Link>
            }
          />
        </Header>
      )}

      <Content className="app__content">{children}</Content>

      {showFooter && (
        <Footer className="app__footer">
          <Row>
            <Col span={12}>
              <p>© 2020 playcodenames.online</p>
              <Link as="/" href="/">
                <a>Home</a>
              </Link>
              {' • '}
              <Link as="/policy/privacy" href="/policy/privacy">
                <a>Privacy policy</a>
              </Link>
              {' • '}
              <Link as="/policy/tos" href="/policy/tos">
                <a>Terms of service</a>
              </Link>
            </Col>
            <Col span={12}>
              <Coffee />
            </Col>
          </Row>
        </Footer>
      )}
    </Layout>
  );
};

export default App;
