import styled from 'styled-components';
import React from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import {ROLE_ID_ADMIN} from '../../types/modules/iRole';
import ModuleAccessWrapper from '../../components/module/ModuleAccessWrapper';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../types/modules/iModuleUser';
import BTAdminOptionsPanel, {
  BT_ADMIN_OPTION_CATEGORIES,
  BT_ADMIN_OPTION_CONSOLIDATED_REPORTS,
  BT_ADMIN_OPTION_DOWNLOAD_BT_ITEMS,
  BT_ADMIN_OPTION_EXCLUDED_GL_CODES,
  BT_ADMIN_OPTION_LOCKDOWNS, BT_ADMIN_OPTION_NOTIFICATIONS,
  BT_ADMIN_OPTION_USERS,
  iBTAdminOptions
} from './components/admin/BTAdminOptionsPanel';
import * as Icons from 'react-bootstrap-icons';
import Page401 from '../../components/Page401';
import BTUserAdminPanel from './components/admin/BTUserAdminPanel';
import BTItemsDownloadPanel from './components/admin/BTItemsDownloadPanel';
import BTItemCategoryAdminPanel from './components/admin/BTItemCategoryAdminPanel';
import BTExcludeGLAdminPanel from './components/admin/BTExcludeGLAdminPanel';
import BTLockDownAdminPanel from './components/admin/BTLockDownAdminPanel';
import BTConsolidatedReportsPanel from './components/admin/BTConsolidatedReportsPanel';
import BTNotificationsAdminPanel from './components/admin/BTNotificationsAdminPanel';

type iBTAdminPage = {
  onNavBack: () => void;
  adminPageModule: iBTAdminOptions | null;
  setShowingAdminPageModule: (showingAdminPageModule: iBTAdminOptions | null) => void;
}
const Wrapper = styled.div`
`
const BTAdminPage = ({onNavBack, setShowingAdminPageModule, adminPageModule}: iBTAdminPage) => {

  const getBackToGLListBtn = () => {
    return (
      <Button variant={'danger'} size={'sm'} onClick={() => onNavBack()}>
        <Icons.ArrowLeft /> GL List
      </Button>
    )
  }

  const getSubTitle = () => {
    switch (adminPageModule) {
      case BT_ADMIN_OPTION_DOWNLOAD_BT_ITEMS: {
        return ' - download BT Items'
      }
      case BT_ADMIN_OPTION_CONSOLIDATED_REPORTS: {
        return ' - Consolidated Reports'
      }
      case BT_ADMIN_OPTION_USERS: {
        return ' - users'
      }
      case BT_ADMIN_OPTION_CATEGORIES: {
        return ' - Categories'
      }
      case BT_ADMIN_OPTION_EXCLUDED_GL_CODES: {
        return ' - Excluding GL Codes'
      }
      case BT_ADMIN_OPTION_LOCKDOWNS: {
        return ' - Lockdowns'
      }
      case BT_ADMIN_OPTION_NOTIFICATIONS: {
        return ' - Notifications'
      }
      default: {
        return '';
      }
    }
  }

  const getContent = () => {
    switch (adminPageModule) {
      case BT_ADMIN_OPTION_DOWNLOAD_BT_ITEMS: {
        return <BTItemsDownloadPanel />;
      }
      case BT_ADMIN_OPTION_CONSOLIDATED_REPORTS: {
        return  <BTConsolidatedReportsPanel />;
      }
      case BT_ADMIN_OPTION_USERS: {
        return <BTUserAdminPanel />;
      }
      case BT_ADMIN_OPTION_CATEGORIES: {
        return <BTItemCategoryAdminPanel />
      }
      case BT_ADMIN_OPTION_EXCLUDED_GL_CODES: {
        return <BTExcludeGLAdminPanel />
      }
      case BT_ADMIN_OPTION_LOCKDOWNS: {
        return <BTLockDownAdminPanel onSelectAdminModule={setShowingAdminPageModule} />
      }
      case BT_ADMIN_OPTION_NOTIFICATIONS: {
        return <BTNotificationsAdminPanel />
      }
      default: {
        return (
          <Page401
            title={'Not Found'}
            description={`Admin module(=${adminPageModule}) NOT found`}
            btns={getBackToGLListBtn()}
          />
        );
      }
    }
  }
  return (
    <Wrapper>
        <Row>
          <Col sm={9}>
            <h3>BT Admin {getSubTitle()}</h3>
            <ModuleAccessWrapper
              moduleId={MGGS_MODULE_ID_BUDGET_TRACKER}
              roleId={ROLE_ID_ADMIN}
              btns={getBackToGLListBtn()}
            >
              {getContent()}
            </ModuleAccessWrapper>
          </Col>
          <Col sm={3}>
            <BTAdminOptionsPanel
              onSelectAdminModule={setShowingAdminPageModule}
              preExtraBtns={getBackToGLListBtn()}
            />
          </Col>
        </Row>
    </Wrapper>
  )
}

export default BTAdminPage;
