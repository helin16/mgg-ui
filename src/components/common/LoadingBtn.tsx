import React from 'react';
import {Button, Spinner} from 'react-bootstrap';

const LoadingBtn = ({isLoading, children, ...props}: any) => {
  return (
    <Button
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner animation="border" size={'sm'}/> : children}
    </Button>
  );
};

export default LoadingBtn;
