import React from 'react';
import styled from 'styled-components';

const LinkBtnWrapper = styled.div`
  cursor: pointer;
  color: #337ab7;
  &.active,
  :hover {
    text-decoration: underline;
  }
`

const LinkBtn = ({onClick, children, ...props}: {children: any; onClick: () => void} & any) => {
  return (
    <LinkBtnWrapper onClick={onClick} {...props}>
      {children}
    </LinkBtnWrapper>
  )
};

export default LinkBtn
