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
  .title {
    color: #d8242f;
  }
`;

const reloadPage = () => {
  window.location.reload();
};


const Page401 = () => {
  return (
    <Wrapper>
      <div className={'logo'}>
        <SchoolLogo />
      </div>
      <div className={'description'}>
        <h4 className={'title'}>Access Denied</h4>
        <p>
          You don't have Access to this page or your session has timed out.
        </p>
      </div>
      <div className={'actions'}>
        <Button variant={'danger'} size="sm" onClick={() => reloadPage()}>Reload Page</Button>
        <ContactSupportPopupBtn>
          <Button variant="link">Support</Button>
        </ContactSupportPopupBtn>
      </div>
    </Wrapper>
  );
};

export default Page401;
