import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';

const _Col = styled(Col)`
  padding: 2.5rem;
  background-color: #fff;
`;

const PageContainer = ({ children }) => {
  return (
    <Row>
      <_Col span={12} offset={6}>
        {children}
      </_Col>
    </Row>
  );
};

export default PageContainer;
