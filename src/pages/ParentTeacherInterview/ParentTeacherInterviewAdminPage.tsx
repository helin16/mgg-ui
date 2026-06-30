import React from 'react';
import AdminPage from '../../layouts/AdminPage';
import AdminPageTabs from '../../layouts/AdminPageTabs';
import MessageListPanel from '../../components/common/Message/MessageListPanel';
import {MESSAGE_TYPE_PARENT_TEACHER_INTERVIEW} from '../../types/Message/iMessage';
import {MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW} from '../../types/modules/iModuleUser';
import ParentTeacherInterviewModuleSettingsPanel from './components/ParentTeacherInterviewModuleSettingsPanel';

type iParentTeacherInterviewAdminPage = {
  onNavBack: () => void;
};

const ParentTeacherInterviewAdminPage = ({onNavBack}: iParentTeacherInterviewAdminPage) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      title={<h3>Parent Teacher Interview - Admin</h3>}
      moduleId={MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW}
        extraTabs={[
          {
            key: 'settings',
            title: 'Settings',
            component: <ParentTeacherInterviewModuleSettingsPanel />,
          },
          {
            key: 'logs',
            title: 'Logs',
            component: <MessageListPanel type={MESSAGE_TYPE_PARENT_TEACHER_INTERVIEW} />,
          },
        ]}
      />
    </AdminPage>
  );
};

export default ParentTeacherInterviewAdminPage;
