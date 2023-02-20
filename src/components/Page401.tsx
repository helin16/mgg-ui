import React from 'react';
import SchoolLogo from './SchoolLogo';
import styled from 'styled-components';
import {Button} from 'react-bootstrap';
import ContactSupportPopupBtn from './support/ContactSupportPopupBtn';
import {mainGreen, mainRed} from '../AppWrapper';

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
    &.danger {
      color: ${mainRed};
    }
    &.success {
      color: ${mainGreen};
    }
  }
`;

const reloadPage = () => {
  window.location.reload();
};


type iPage401 = {
  title?: string;
  description?: any;
  btns?: any;
  variant?: string;
  showLogo?: boolean;
}
const Page401 = ({title, description, btns, variant = 'danger', showLogo = true}: iPage401) => {
  return (
    <Wrapper>
      {showLogo ? (
        <div className={'logo'}>
          <SchoolLogo />
        </div>
      ) : null}
      <div className={'description'}>
        <h4 className={`title ${variant?.trim().toLowerCase()}`}>{title || 'Access Denied'}</h4>
        {description ? description: (<p>
          You don't have Access to this page or your session has timed out.
        </p>)}
      </div>
      <div className={'actions'}>
        {btns || (
          <>
            <Button variant={variant} size="sm" onClick={() => reloadPage()}>Reload Page</Button>
            <ContactSupportPopupBtn>
              <Button variant="link">Support</Button>
            </ContactSupportPopupBtn>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default Page401;
