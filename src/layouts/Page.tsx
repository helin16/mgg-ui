import React from 'react';
import styled from 'styled-components';

type iPage = {
  children: React.ReactNode;
  className?: string;
}
const Wrapper = styled.div``;
const Page = ({children, className}: iPage) => {
  return (
    <Wrapper className={className}>
      {children}
    </Wrapper>
  )
}

export default Page
