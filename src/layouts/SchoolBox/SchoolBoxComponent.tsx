import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import SchoolBoxDebugInfo from './SchoolBoxDebugInfo';
import SchoolBoxRouter from './SchoolBoxRouter';
import {Spinner} from 'react-bootstrap';
import AuthService from '../../services/AuthService';
import LocalStorageService from '../../services/LocalStorageService';
import {userAuthenticated} from '../../redux/reduxers/auth.slice';
import {useDispatch} from 'react-redux';

const SchoolBoxComponent = ({path, remoteUrl}: {path: string; remoteUrl: string} ) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const synId = searchParams.get('id');
  const schoolBoxUser = searchParams.get('user');
  const time = searchParams.get('time');
  const key = searchParams.get('key');

  useEffect(() => {
    let isCancelled = false;
    if (loading !== true) { return }
    if (synId === null || `${synId}`.trim() === '') { return }
    if (schoolBoxUser === null || `${schoolBoxUser}`.trim() === '') { return }
    if (time === null || `${time}`.trim() === '') { return }
    if (key === null || `${key}`.trim() === '') { return }

    AuthService.authSchoolBox(synId, schoolBoxUser, Number(time), key)
      .then(resp => {
        if (isCancelled) {return}
        LocalStorageService.setToken(resp.token);
        dispatch(userAuthenticated({user: resp.user}));
        setLoading(false);
      });
    return () => {
      isCancelled = true;
    }
  }, [synId, schoolBoxUser, time, key, loading]);

  if (loading === true) {
    return <Spinner animation={'border'}/>
  }

  return (
    <div className={'school-box-layout'}>
      <SchoolBoxDebugInfo remoteUrl={remoteUrl} path={path}/>
      <SchoolBoxRouter path={path} />
    </div>
  )
};


export default SchoolBoxComponent;
