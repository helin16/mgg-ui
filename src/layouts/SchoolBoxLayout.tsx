import React from 'react';
import {useParams} from 'react-router-dom';
import {Alert} from 'react-bootstrap';
import SchoolBoxComponent from './SchoolBox/SchoolBoxComponent';

import styled from 'styled-components';

const SchoolBoxWrapper = styled.div`
  padding: 10px; 
  .input-group {
    .btn {
      height: 100% !important;
    }
  }
`;

const SchoolBoxLayout = () => {

  const getWrapper = (children: any) => {
    return (
      <SchoolBoxWrapper>
        {children}
      </SchoolBoxWrapper>
    )
  }


  const {code} = useParams();
  const remoteUrl = document.getElementById("mgg-root")?.getAttribute('data-url') || atob(code || '');
  try {
    // @ts-ignore
    const url = new URL(remoteUrl);
    const urlParams = url.searchParams;

    const newPath = url.pathname.replace('/3rdPartyAuth/', '');
    const finalPath = atob(newPath || '');
    return getWrapper(
      <SchoolBoxComponent
        path={finalPath}
        remoteUrl={remoteUrl}
        user={urlParams.get('user')}
        id={urlParams.get('id')}
        time={urlParams.get('time')}
        sbKey={urlParams.get('key')}
      />
    );
  } catch (e) {
    return getWrapper(<Alert variant={'warning'}>Error: can't get the url ({{remoteUrl}}).</Alert>);
  }
};

export default SchoolBoxLayout;
