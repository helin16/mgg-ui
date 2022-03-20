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


const PageNotFound = () => {
  return <Wrapper>
    <div className={'logo'}>
      <SchoolLogo />
    </div>
    <div className={'description'}>
      <h4>Opps, requested page can't be found.</h4>
      <p>
        This page might have been removed or temporarily unavailable.
      </p>
    </div>
    <div className={'actions'}>
      <Button variant={'primary'} size="sm" onClick={() => reloadPage()}>Reload Page</Button>
      <ContactSupportPopupBtn>
        <Button variant="link">Support</Button>
      </ContactSupportPopupBtn>
    </div>
  </Wrapper>
};

export default PageNotFound;
