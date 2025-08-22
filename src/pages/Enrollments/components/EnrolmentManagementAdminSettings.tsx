import React, {useState} from 'react';
import iModule from '../../../types/modules/iModule';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import {MGGS_MODULE_ID_ENROLLMENTS} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import SectionDiv from '../../../components/common/SectionDiv';
import ExplanationPanel from '../../../components/ExplanationPanel';
import ModuleEmailTemplateNameEditor from '../../../components/module/ModuleEmailTemplateNameEditor';
import {Form, Tab, Tabs} from 'react-bootstrap';
import moment from 'moment-timezone';
import MathHelper from '../../../helper/MathHelper';
import {FlexContainer} from '../../../styles';
import UtilsService from '../../../services/UtilsService';

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
}
const CCEditPanel = ({module, onUpdate}: iEditPanel) => {
  const [expiryCCTemplate, setExpiryCCTemplate] = useState(module.settings?.expiryCC?.templateName || '');
  const [expiryCCRecipients, setExpiryCCRecipients] = useState(module.settings?.expiryCC?.recipients || '');

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      expiryCC: {
        ...(module?.settings?.expiryCC || {}),
        templateName: expiryCCTemplate,
        recipients: expiryCCRecipients,
      },
    })
  }

  return (
    <SectionDiv>
      <h5>Expiring Passport(s) and Visa(s) Notification Settings</h5>
      <ExplanationPanel text={'Email notifications will be sent to the nominated recipients below every Wednesday night'} />
      <ModuleEmailTemplateNameEditor
        value={expiryCCTemplate}
        className={'content-row'}
        onChange={(event) => setExpiryCCTemplate(event.target.value)}
        handleUpdate={() => handleUpdate()}
      />
      <SectionDiv>
        <h6>Email Recipients</h6>
        <Form.Label>
          Recipients who will receive the notification (email addresses separated by <b>,</b>):
        </Form.Label>
        <Form.Control
          placeholder="Email address separated by ,"
          value={ expiryCCRecipients }
          onChange={(event) => {
            setExpiryCCRecipients(event.target.value);
          }}
          onBlur={() => handleUpdate()}
        />
      </SectionDiv>
    </SectionDiv>
  )
}

const EnrolmentNumbersEditPanel = ({module, onUpdate}: iEditPanel) => {
  const [currentFutureStatuses, setCurrentFutureStatuses] = useState(module.settings?.enrolmentNumbers?.currentFutureStatuses || []);
  const [futureStatuses, setFutureStatuses] = useState(module.settings?.enrolmentNumbers?.futureStatuses || []);
  const currentYear = moment().year();
  const nextYear = MathHelper.add(currentYear, 1);

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      enrolmentNumbers: {
        ...(module?.settings?.enrolmentNumbers || {}),
        currentFutureStatuses: currentFutureStatuses,
        futureStatuses: futureStatuses,
      },
    })
  }

  return (
    <>
      <SectionDiv
        title={
          <FlexContainer className={'align-items-center justify-content-start gap-2'}>
            <h5>Settings for Future Student Statuses in the <b>{currentYear}</b></h5>
            <small><i>Provided statuses will be displayed as columns in the Future Section under <b>{currentYear}</b>.</i></small>
          </FlexContainer>
        }>
          <Form.Control
            placeholder="Status Code separated by ,"
            value={currentFutureStatuses.join(',')}
            onChange={(event) => {
              setCurrentFutureStatuses(`${event.target.value || ''}`.trim().split(',').map(v => UtilsService.stripQuotes(v)));
            }}
            onBlur={() => handleUpdate()}
          />
      </SectionDiv>
      <SectionDiv
        title={
          <FlexContainer className={'align-items-center justify-content-start gap-2'}>
          <h5>Settings for Future Student Statuses in the <b>{nextYear}</b></h5>
          <small><i>Provided statuses will be displayed as columns in the Future Section under <b>{nextYear}</b>.</i></small>
          </FlexContainer>
        }>
          <Form.Control
            placeholder="Status Code separated by ,"
            value={futureStatuses.join(',')}
            onChange={(event) => {
              setFutureStatuses(`${event.target.value || ''}`.trim().split(',').map(v => UtilsService.stripQuotes(v)));
            }}
            onBlur={() => handleUpdate()}
          />
      </SectionDiv>
    </>
  )
}

enum TabNames {
  ExpiringCC = 'Expiring Credit Cards',
  EnrolmentNumbers = 'Enrolment Numbers',
}

const EnrolmentManagementAdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [selectedTab, setSelectedTab] = useState(TabNames.ExpiringCC);

  const getContent = (module: iModule) => {
    return (
      <SectionDiv>
        <Tabs
          variant={'pills'}
          activeKey={selectedTab}
          onSelect={(k) => setSelectedTab(k as TabNames)}
          unmountOnExit
        >
          <Tab title={TabNames.ExpiringCC} eventKey={TabNames.ExpiringCC}>
            <CCEditPanel
              module={module}
              onUpdate={(newSettings: any) => setSettings(newSettings)}
            />
          </Tab>

          <Tab title={TabNames.EnrolmentNumbers} eventKey={TabNames.EnrolmentNumbers}>
            <EnrolmentNumbersEditPanel
              module={module}
              onUpdate={(newSettings: any) => setSettings(newSettings)}
            />
          </Tab>

        </Tabs>
      </SectionDiv>
    );
  }

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_ENROLLMENTS}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => (settings)}
    />
  )
}

export default EnrolmentManagementAdminSettings;
