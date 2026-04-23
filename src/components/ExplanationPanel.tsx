import * as Icons from 'react-bootstrap-icons';
import {Alert} from 'react-bootstrap';
import React from 'react';

type iExplanationPanel = {
  text: any;
  icon?: any;
  variant?: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const ExplanationPanel = ({text, icon, variant, dismissible, className, onDismiss}: iExplanationPanel) => {
  return (
    <Alert variant={variant || 'secondary'} dismissible={dismissible} className={className} onClose={onDismiss}>
      {icon || <Icons.ExclamationOctagonFill />} {text}
    </Alert>
  )
}


export default ExplanationPanel;
