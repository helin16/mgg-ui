import {useEffect, useState} from 'react';
import iModule from '../../../../types/modules/iModule';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import MggsModuleService from '../../../../services/Module/MggsModuleService';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../../types/modules/iModuleUser';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';
import ExplanationPanel from '../../../../components/ExplanationPanel';
import styled from 'styled-components';
import ModuleEmailTemplateNameEditor from '../../../../components/module/ModuleEmailTemplateNameEditor';
import {FlexContainer} from '../../../../styles';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';

const Wrapper = styled.div``;
const BTNotificationsAdminPanel = () => {
  const [module, setModule] = useState<iModule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    MggsModuleService.getModule(MGGS_MODULE_ID_BUDGET_TRACKER)
      .then(resp => {
        if (isCanceled) return;
        setModule(resp);
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
  }, []);

  const save = () => {
    setIsSaving(true);
    MggsModuleService.updateModule(module?.ModuleID || '', {
      settings: module?.settings || {},
    })
      .then(resp => {
        Toaster.showToast('Module updated.', TOAST_TYPE_SUCCESS);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSaving(false);
      })
  }

  if (isLoading) {
    return <PageLoadingSpinner />
  }

  if (!module) {
    return null;
  }

  return (
    <Wrapper>
      <ExplanationPanel text={'following are a list of notification emails that will be sent to users when budget items are created or updated.'} />
      <div className={'panel-wrapper space-below'}>
        <FlexContainer className={'full-width with-gaps align-items center justify-content space-between'}>
          <h6>Emails when new Budget Item requested:</h6>
          <small className={'text-muted'}>Notifications will be sent to approvers (BT admins), when BT Item created.</small>
        </FlexContainer>
        <ModuleEmailTemplateNameEditor
          value={module.settings?.emailTemplateName?.itemRequested || ''}
          onChange={(event) => {
            setModule({
              ...module,
              settings: {
                ...(module?.settings || {}),
                emailTemplateName: {
                  ...(module?.settings?.emailTemplateName || {}),
                  itemRequested: event.target.value,
                }
              }
            })}
          }
          handleUpdate={() => null }
          />
        <div>
          <b className={'text-muted'}>LEAVE IT BLANK WILL DISABLE THIS NOTIFICATION</b>
        </div>
      </div>
      <hr />
      <div className={'panel-wrapper space-below'}>
        <FlexContainer className={'full-width with-gaps align-items center justify-content space-between'}>
          <h6>Emails when new Budget Item <span className={'text-success'}>approved</span>:</h6>
          <small className={'text-muted'}>Notifications will be sent to requester, when BT Item approved.</small>
        </FlexContainer>
        <ModuleEmailTemplateNameEditor
          value={module.settings?.emailTemplateName?.itemApproved || ''}
          onChange={(event) => {
            setModule({
              ...module,
              settings: {
                ...(module?.settings || {}),
                emailTemplateName: {
                  ...(module?.settings?.emailTemplateName || {}),
                  itemApproved: event.target.value,
                }
              }
            })}
          }
          handleUpdate={() => null }
        />
        <div>
          <b className={'text-muted'}>LEAVE IT BLANK WILL DISABLE THIS NOTIFICATION</b>
        </div>

        <hr />
        <div className={'panel-wrapper space-below'}>
          <FlexContainer className={'full-width with-gaps align-items center justify-content space-between'}>
            <h6>Emails when new Budget Item <span className={'text-danger'}>declined</span>:</h6>
            <small className={'text-muted'}>Notifications will be sent to requester, when BT Item declined.</small>
          </FlexContainer>
          <ModuleEmailTemplateNameEditor
            value={module.settings?.emailTemplateName?.itemDeclined || ''}
            onChange={(event) => {
              setModule({
                ...module,
                settings: {
                  ...(module?.settings || {}),
                  emailTemplateName: {
                    ...(module?.settings?.emailTemplateName || {}),
                    itemDeclined: event.target.value,
                  }
                }
              })}
            }
            handleUpdate={() => null }
          />
          <div>
            <b className={'text-muted'}>LEAVE IT BLANK WILL DISABLE THIS NOTIFICATION</b>
          </div>
        </div>
        <LoadingBtn variant={'primary'} isLoading={isSaving} onClick={() => save()}>
          <Icons.Save2 /> Save
        </LoadingBtn>
      </div>
    </Wrapper>
  )
}

export default BTNotificationsAdminPanel;
