import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import SchoolBoxDebugInfo from './SchoolBoxDebugInfo';
import SchoolBoxRouter from './SchoolBoxRouter';
import {Spinner} from 'react-bootstrap';
import AuthService from '../../services/AuthService';
import LocalStorageService from '../../services/LocalStorageService';
import {removedAuthentication, userAuthenticated} from '../../redux/reduxers/auth.slice';
import {useDispatch} from 'react-redux';
import Toaster from '../../services/Toaster';

type iSchoolBoxComponent = {
  path: string;
  remoteUrl: string;
  id: string | null,
  user: string | null;
  time: string | null;
  sbKey: string | null
};

const SchoolBoxComponent = ({path, remoteUrl, id = null, user = null, time = null, sbKey = null}: iSchoolBoxComponent) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const synId = id === null ? searchParams.get('id') : id;
  const schoolBoxUser = user === null ? searchParams.get('user') : user;
  const authTime = time === null ? searchParams.get('time') : time;
  const authKey = sbKey === null ? searchParams.get('key') : sbKey;

  useEffect(() => {
    let isCancelled = false;
    if (loading !== true) { return }
    if (synId === null || `${synId}`.trim() === '') { return }
    if (schoolBoxUser === null || `${schoolBoxUser}`.trim() === '') { return }
    if (authTime === null || `${authTime}`.trim() === '') { return }
    if (authKey === null || `${authKey}`.trim() === '') { return }

    AuthService.authSchoolBox(synId, schoolBoxUser, Number(authTime), authKey)
      .then(resp => {
        if (isCancelled) {return}
        LocalStorageService.setToken(resp.token);
        dispatch(userAuthenticated({user: resp.user}));
      })
      .catch(err => {
        if (isCancelled) {return}
        Toaster.showApiError(err);
        LocalStorageService.removeToken();
        dispatch(removedAuthentication());
      })
      .finally(() => {
        if (isCancelled) {return}
        setLoading(false);
      });
    return () => {
      isCancelled = true;
    }
  }, [synId, schoolBoxUser, authKey, authTime, loading, dispatch]);

  if (loading === true) {
    return <div><Spinner animation={'border'}/>Authenticating ...</div>
  }

  return (
    <div className={'school-box-layout'}>
      <SchoolBoxDebugInfo remoteUrl={remoteUrl} path={path} searchParams={{synId, schoolBoxUser, authTime, authKey}}/>
      <SchoolBoxRouter path={path} />
    </div>
  )
};


export default SchoolBoxComponent;
