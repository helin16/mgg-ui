import * as Icons from 'react-bootstrap-icons';
import {Alert} from 'react-bootstrap';
import React from 'react';

type iExplanationPanel = {
  text: any;
  icon?: any;
  variant?: string;
}
const ExplanationPanel = ({text, icon, variant}: iExplanationPanel) => {
  return (
    <Alert variant={variant || 'secondary'}>
      {icon || <Icons.ExclamationOctagonFill />} {text}
    </Alert>
  )
}


export default ExplanationPanel;
