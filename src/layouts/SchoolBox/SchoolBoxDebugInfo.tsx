import React from 'react';
import {Alert} from 'react-bootstrap';

const SchoolBoxDebugInfo = ({remoteUrl, path, searchParams}: {remoteUrl: string; path: string; searchParams: any}) => {
  const isDebug = `${process.env.REACT_APP_DEBUG || ''}`.trim().toLowerCase() === 'true';
  if (isDebug === true) {
    return (
      <Alert variant={'info'}>
        <div>remoteUrl: <b>{remoteUrl}</b></div>
        <div>finalPath: <b>{path}</b></div>
        {searchParams ? <div>searchParams: {JSON.stringify(searchParams)}</div> : null}
      </Alert>
    );
  }
  return null;
}

export default SchoolBoxDebugInfo;
