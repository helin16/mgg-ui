import React from 'react';
import {Outlet} from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
`

const SchoolBoxLayout = () => {
  return <Wrapper className={'school-box-layout'}><Outlet /></Wrapper>
};

export default SchoolBoxLayout;
