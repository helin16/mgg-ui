import React from 'react';
import SchoolLogo from './SchoolLogo';
import styled from 'styled-components';
import {Button} from 'react-bootstrap';
import ContactSupportPopupBtn from './support/ContactSupportPopupBtn';

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

const reloadPage = () => {
  window.location.reload();
};

type iPageNotFound = {
  title?: string | React.ReactElement;
  description?: string | React.ReactElement;
  secondaryBtn?: React.ReactElement;
  primaryBtn?: React.ReactElement
}
const PageNotFound = ({title, description, primaryBtn, secondaryBtn}: iPageNotFound) => {
  return <Wrapper>
    <div className={'logo'}>
      <SchoolLogo />
    </div>
    <div className={'description'}>
      <h4 className={'title'}>{title || `Requested page can't be found.`}</h4>
      <div style={{marginTop: '1rem', marginBottom: '1rem'}}>
        {description || `This page might have been removed or temporarily unavailable.`}
      </div>
    </div>
    <div className={'actions'}>
      { primaryBtn || <Button variant={'primary'} size="sm" onClick={() => reloadPage()}>Reload Page</Button>}
      {
        secondaryBtn ||
        <ContactSupportPopupBtn>
          <Button variant="link">Support</Button>
        </ContactSupportPopupBtn>
      }
    </div>
  </Wrapper>
};

export default PageNotFound;
