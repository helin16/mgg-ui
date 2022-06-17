import styled from 'styled-components';
import { ReactElement} from 'react';
import {mainRed} from '../AppWrapper';
import SchoolCrest from '../components/SchoolCrest';

const Wrapper = styled.div`
  .school-crest {
    position: fixed;
    left: -140px;
    bottom: 0px;
    width: 400px;
    height: auto;
    z-index: 99;
  }
  .display {
    z-index: 1000;
  }
`

type iRedPage = {
  title?: string,
  children: ReactElement,
}
const RedPage = ({children, title}: iRedPage) => {
  const pageTitle = `${title || ''}`.trim();
  if (pageTitle !== '') {
    document.title = pageTitle
  }
  document.body.style.backgroundColor = mainRed;
  document.body.style.color = 'white';
  return <Wrapper className={'red-page'}>
    <SchoolCrest className={'school-crest'}/>
    <div className={'display'} >
      {children}
    </div>
  </Wrapper>
}

export default RedPage;
