import React from 'react';
import {Alert} from 'react-bootstrap';

const SchoolBoxDebugInfo = ({remoteUrl, path}: {remoteUrl: string; path: string}) => {
  return (
    <Alert variant={'info'}>
      <div>remoteUrl: <b>{remoteUrl}</b></div>
      <div>finalPath: <b>{path}</b></div>
    </Alert>
  );
}

export default SchoolBoxDebugInfo;
