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

type iDecision = {
  moduleId: number;
  roleId?: number;
  canAccess: boolean;
  blockImpersonated: boolean;
}

const ModuleAccessWrapper = ({moduleId, roleId, silentMode = false, accessDenyPanel, children, btns}: iModuleAccessWrapper) => {
  const {user} = useSelector((state: RootState) => state.auth);
  // Feature 023: resolved once at boot (App.tsx). Read from Redux, never re-inspect window.
  const isImpersonating = useSelector((state: RootState) => state.app?.isImpersonating) === true;
  const [decision, setDecision] = useState<iDecision | null>(null);

  useEffect(() => {
    let isCanceled = false;

    // Only the impersonation gate needs the module record. For a normal (non-impersonated)
    // session - essentially always - skip the extra request so first paint is unchanged and
    // module screens never depend on the module-metadata endpoint's availability.
    const blockImpersonatedPromise: Promise<boolean> = isImpersonating
      ? MggsModuleService.getModule(moduleId)
          .then(module => module?.blockImpersonatedUser === true)
          .catch(err => {
            // Fail open on the impersonation gate if the module record can't be read.
            Toaster.showApiError(err);
            return false;
          })
      : Promise.resolve(false);

    Promise.all([AuthService.canAccessModule(moduleId), blockImpersonatedPromise])
      .then(([resp, blockImpersonated]) => {
        if (isCanceled) return;
        // @ts-ignore
        const canAccessRoleIds = Object.keys(resp).filter((rId: number) => resp[rId].canAccess === true);
        const canAccess = roleId
          ? canAccessRoleIds.some(rId => `${rId}` === `${roleId}`)
          : canAccessRoleIds.length > 0;
        setDecision({moduleId, roleId, canAccess, blockImpersonated});
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      });

    return () => {
      isCanceled = true;
    }
  }, [user, moduleId, roleId, isImpersonating]);

  // A decision computed for a different module/role (a reused instance mid-refetch) counts
  // as "still loading" so a stale allow/deny is never shown for the new module.
  const ready = decision !== null && decision.moduleId === moduleId && decision.roleId === roleId;
  if (!ready) {
    return <Spinner animation={'border'} />
  }

  if (decision.blockImpersonated && isImpersonating) {
    if (silentMode) {
      return null;
    }

    if (accessDenyPanel) {
      return accessDenyPanel;
    }

    return <Page401 description={<h4>This module is unavailable while you are logged in as another user. Return to your own account to continue.</h4>} btns={btns} />
  }

  if (!decision.canAccess) {
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
