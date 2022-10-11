import ModuleAccessWrapper from './ModuleAccessWrapper';
import React, {useEffect, useState} from 'react';
import iModule from '../../types/modules/iModule';
import MggsModuleService from '../../services/Module/MggsModuleService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../services/Toaster';
import {Spinner} from 'react-bootstrap';
import LoadingBtn from '../common/LoadingBtn';
import styled from 'styled-components';

type iModuleEditPanel = {
  moduleId: number;
  roleId?: number;
  getSubmitData?: () => any;
  getChildren: (module: iModule) => React.ReactElement;
}
const Wrapper = styled.div`
  .actions-div {
    margin-top: 0.3rem;
  }
`;
const ModuleEditPanel = ({moduleId, roleId, getChildren, getSubmitData}: iModuleEditPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [module, setModule] = useState<iModule | null>(null);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    MggsModuleService.getModule(moduleId)
      .then(resp => {
        if (isCanceled) return;
        setModule(resp);
      }).catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      }).finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })
    return () => {
      isCanceled = true;
    }
  }, [moduleId, roleId]);

  const updateModule = () => {
    const data = getSubmitData ? getSubmitData() : {};
    if (Object.keys(data).length <= 0) {
      return;
    }
    setIsSaving(true);
    MggsModuleService.updateModule(moduleId, {
        settings: {
          ...(module?.settings || {}),
          ...data,
        }
      })
      .then(resp => {
        setModule(resp);
        Toaster.showToast('Module Updated.', TOAST_TYPE_SUCCESS);
      }).catch(err => {
        Toaster.showApiError(err);
      }).finally(() => {
        setIsSaving(false);
      })
  }

  const getContent = () => {
    if (isLoading) {
      return <Spinner animation={'border'} />
    }
    if (!module) {
      return null;
    }
    return getChildren(module);
  }

  return (
    <ModuleAccessWrapper moduleId={moduleId} roleId={roleId} silentMode={true}>
      <Wrapper>
        {getContent()}
        <div className={'actions-div'}>
          <LoadingBtn isLoading={isSaving} variant={'primary'} size={'sm'} onClick={() => updateModule()}>Update</LoadingBtn>
        </div>
      </Wrapper>
    </ModuleAccessWrapper>
  );
}

export default ModuleEditPanel;
