import React from 'react';
import SchoolLogo from '../SchoolLogo';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 1rem;
  text-align: center;
  .logo {
    margin: auto;
    padding: 1rem;
    img {
      max-width: 200px;
      min-width: 80px;
      width: 40%;
      height: auto;
    }
  }
`;

type iEmptyState = {
  title: string;
  description?: string;
  hideLogo?: boolean;
  mainBtn?: any;
  secondaryBtn?: any;
  logo?: any;
}

const EmptyState = ({title, description, mainBtn, secondaryBtn, logo, hideLogo}: iEmptyState) => {

  const getBtns = () => {
    if (!mainBtn && !secondaryBtn) {
      return null;
    }
    return (
      <div className={'actions'}>
        {mainBtn}
        {secondaryBtn}
      </div>
    )
  }

  const getLogo = () => {
    if (hideLogo === true) {
      return null;
    }
    return (
      <div className={'logo'}>
        {logo || <SchoolLogo />}
      </div>
    )
  }

  return (
    <Wrapper>
      {getLogo()}
      <div className={'description'}>
        <h4>{title}</h4>
        {description ? (<p>{description}</p>) : null}
      </div>
      {getBtns()}
    </Wrapper>
  );
};

export default EmptyState;
