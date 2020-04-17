import styled from 'styled-components';

const Wrapper = styled.div`
  a.bmc-button {
    font-size: 1rem;
    float: right;
    background-color: #fff;
    padding: 5px 10px;
    color: #fff;
    background-color: #24b5b5;
    border-radius: 4px;
    line-height: 1;

    -webkit-box-shadow: 0 1px 2px 2px #bebebe;
    -webkit-box-shadow: 0 1px 2px 2px rgba(190, 190, 190, 0.5);
    box-shadow: 0 1px 2px #bebebe;
    box-shadow: 3px 4px 4px rgba(190, 190, 190, 0.5);
    -o-transition: background-color 0.3s, color 0.3s linear;
    -webkit-transition: background-color 0.3s, color 0.3s linear;
    -moz-transition: background-color 0.3s, color 0.3s linear;
    -ms-transition: background-color 0.3s, color 0.3s linear;
    transition: background-color 0.3s, color 0.3s linear;

    img {
      padding-right: 5px;
    }
  }
`;

const Coffee = () => {
  return (
    <Wrapper>
      <a
        className="bmc-button"
        target="_blank"
        href="https://www.buymeacoffee.com/tomn"
        rel="noreferrer noopener"
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
          alt="Buy me a coffee"
        />
        <span>Buy me a coffee</span>
      </a>
    </Wrapper>
  );
};

export default Coffee;
