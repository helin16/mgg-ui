import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import AuthService from '../../services/AuthService';
import {Spinner} from 'react-bootstrap';
import Page401 from '../Page401';
import {ROLE_ID_ADMIN} from '../../types/modules/iRole';

type iModuleAccessWrapper = {
  moduleId: number;
  roleId?: number;
  children: React.ReactElement;
}
const ModuleAccessWrapper = ({moduleId, roleId, children}: iModuleAccessWrapper) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [canAccess, setCanAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCanceled = false;
    AuthService.canAccessModule(moduleId)
      .then(resp => {
        if (isCanceled) return;
        // @ts-ignore
        const canAccessRoles = Object.keys(resp).filter((roleId: number) => resp[roleId].canAccess === true).reduce((map, roleId) => {
          return {
            ...map,
            // @ts-ignore
            [roleId]: resp[roleId],
          }
        }, {});
        if (roleId) {
          setCanAccess(Object.keys(canAccessRoles).filter(roleId => `${roleId}` === `${roleId}`).length > 0);
        } else {
          setCanAccess(Object.keys(canAccessRoles).length > 0);
        }
      })
      .catch(err => {
        if (isCanceled) return;
        console.error(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }
  }, [user]);

  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  if (!canAccess) {
    return <Page401 />
  }

  return <>{children}</>
}

export default ModuleAccessWrapper;
