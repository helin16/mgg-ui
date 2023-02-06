import React from 'react';
import {Button, ButtonProps, Spinner} from 'react-bootstrap';

type iLoadingBtn = {
  isLoading?: boolean;
  icon?: any;
} & ButtonProps
const LoadingBtn = ({isLoading = false, icon, children, ...props}: iLoadingBtn) => {
  return (
    <Button
      disabled={isLoading === true}
      {...props}
    >
      {isLoading === true ? <Spinner animation="border" size={'sm'}/> : <>{icon} {children}</>}
    </Button>
  );
};

export default LoadingBtn;
