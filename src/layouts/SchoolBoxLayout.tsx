import React from 'react';
import {useParams} from 'react-router-dom';
import {Alert} from 'react-bootstrap';
import SchoolBoxComponent from './SchoolBox/SchoolBoxComponent';

const SchoolBoxLayout = () => {
  const {code} = useParams();
  const remoteUrl = document.getElementById("mgg-root")?.getAttribute('data-url') || atob(code || '');
  try {
    // @ts-ignore
    const url = new URL(remoteUrl);
    const newPath = url.pathname.replace('/3rdPartyAuth/', '');
    const finalPath = atob(newPath || '');
    return <SchoolBoxComponent path={finalPath} remoteUrl={remoteUrl}/>;
  } catch (e) {
    return <Alert variant={'warning'}>Error: can't get the url ({{remoteUrl}}).</Alert>
  }
};

export default SchoolBoxLayout;
