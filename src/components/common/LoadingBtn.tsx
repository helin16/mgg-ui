import React from 'react';
import {Button, ButtonProps, Spinner} from 'react-bootstrap';

type iLoadingBtn = {
  isLoading?: boolean;
} & ButtonProps
const LoadingBtn = ({isLoading = false, children, ...props}: iLoadingBtn) => {
  return (
    <Button
      disabled={isLoading === true}
      {...props}
    >
      {isLoading === true ? <Spinner animation="border" size={'sm'}/> : children}
    </Button>
  );
};

export default LoadingBtn;
