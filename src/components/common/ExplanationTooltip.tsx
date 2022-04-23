import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import styled from 'styled-components';
import React from 'react';
import * as Icons from 'react-bootstrap-icons';

const Wrapper = styled.div`
  display: inline-block;
  :hover {
    cursor: pointer;
  }
`

type iExplanationTooltip = {
  description: any;
  placement?: 'auto' | 'top' | 'left' | 'right';
};
const ExplanationTooltip = ({description, placement = 'auto'}: iExplanationTooltip) => {
  return (
    <Wrapper>
      <OverlayTrigger placement={placement} overlay={<Tooltip>{description}</Tooltip>}>
        <Icons.QuestionCircleFill />
      </OverlayTrigger>
    </Wrapper>
  )
};

export default ExplanationTooltip;
