import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 1.2rem;
  &.lg {
    margin-top: 2rem;
  }
  &.sm-top {
    margin-top: 0.6rem;
  }
  &.no-top {
    margin-top: 0px;
  }
  &.margin-bottom {
    margin-bottom: 1.2rem;
  }
`
const SectionDiv = ({children, ...props}: any) => {
  return (
    <Wrapper {...props}>
      {children}
    </Wrapper>
  )
};

export default SectionDiv;
