import { Spin } from 'antd';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #fff;

  .ant-spin.ant-spin-lg.ant-spin-spinning {
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }
`;

const Loading = () => {
  return (
    <Wrapper>
      <Spin size="large" />
    </Wrapper>
  );
};

export default Loading;
