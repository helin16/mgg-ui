import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import AuthService from '../../services/AuthService';
import MggsModuleService from '../../services/Module/MggsModuleService';
import {Spinner} from 'react-bootstrap';
import Page401 from '../Page401';
import Toaster from '../../services/Toaster';

type iModuleAccessWrapper = {
  moduleId: number;
  roleId?: number;
  silentMode?: boolean;
  accessDenyPanel?: React.ReactElement | null;
  children: React.ReactElement | null;
  btns?: any;
}
const ModuleAccessWrapper = ({moduleId, roleId, silentMode = false, accessDenyPanel, children, btns}: iModuleAccessWrapper) => {
  const {user} = useSelector((state: RootState) => state.auth);
  // Feature 023: resolved once at boot (App.tsx). Read from Redux, never re-inspect window.
  const isImpersonating = useSelector((state: RootState) => state.app.isImpersonating) === true;
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [blockImpersonated, setBlockImpersonated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCanceled = false;
    Promise.all([
      AuthService.canAccessModule(moduleId),
      MggsModuleService.getModule(moduleId).catch(err => {
        // Fail open on the impersonation gate if the module record can't be read.
        Toaster.showApiError(err);
        return null;
      }),
    ])
      .then(([resp, module]) => {
        if (isCanceled) return;
        setBlockImpersonated(module?.blockImpersonatedUser === true);
        // @ts-ignore
        const canAccessRoles = Object.keys(resp).filter((roleId: number) => resp[roleId].canAccess === true).reduce((map, roleId) => {
          return {
            ...map,
            // @ts-ignore
            [roleId]: resp[roleId],
          }
        }, {});
        if (roleId) {
          setCanAccess(Object.keys(canAccessRoles).filter(rId => `${rId}` === `${roleId}`).length > 0);
        } else {
          setCanAccess(Object.keys(canAccessRoles).length > 0);
        }
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }
  }, [user, moduleId, roleId]);

  if (isLoading || canAccess === null || blockImpersonated === null) {
    return <Spinner animation={'border'} />
  }

  if (blockImpersonated && isImpersonating) {
    if (silentMode) {
      return null;
    }

    if (accessDenyPanel) {
      return accessDenyPanel;
    }

    return <Page401 description={<h4>This module is unavailable while you are logged in as another user. Return to your own account to continue.</h4>} btns={btns} />
  }

  if (!canAccess) {
    if (silentMode) {
      return null;
    }

    if (accessDenyPanel) {
      return accessDenyPanel;
    }

    return <Page401 description={<h4>Please contact IT or Module Admins for assistant</h4>} btns={btns} />
  }

  return <>{children}</>
}

export default ModuleAccessWrapper;
