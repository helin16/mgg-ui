import {useState} from 'react';
import {Form, Tab, Tabs} from 'react-bootstrap';
import ModuleEditPanel from '../../module/ModuleEditPanel';
import SectionDiv from '../../common/SectionDiv';
import FormErrorDisplay, {iErrorMap} from '../../form/FormErrorDisplay';
import iModule from '../../../types/modules/iModule';
import iSkillExpirationSettings, {iSkillExpirationEmailTemplateBody} from '../../../types/modules/iSkillExpirationSettings';
import {MGGS_MODULE_ID_STAFF_LIST} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import SynLuSkillSelector from '../../Community/SynLuSkillSelector';
import {iAutoCompleteSingle} from '../../common/AutoComplete';
import EmailTemplateBuilder from '../../Email/EmailTemplateBuilder';
import SkillExpirationLogsPanel from './SkillExpirationLogsPanel';

const MODULE_SETTINGS_KEY = 'skillExpiration';

const TAB_TIMING = 'timing';
const TAB_SKILLS = 'skills';
const TAB_RECIPIENTS = 'recipients';
const TAB_INDIVIDUAL_EMAIL = 'individualEmail';
const TAB_BULK_EMAIL = 'bulkEmail';
const TAB_LOGS = 'logs';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getInvalidEmails = (value: string) => {
  return value
    .split(';')
    .map(email => email.trim())
    .filter(email => email !== '' && !isValidEmail(email));
};

const getEmailTemplateBody = (value: any): iSkillExpirationEmailTemplateBody => {
  if (value && typeof value === 'object') {
    return {design: value.design, html: `${value.html || ''}`};
  }
  return {html: `${value || ''}`};
};

type iEditPanel = {
  module: iModule;
  onUpdate: (data: {[MODULE_SETTINGS_KEY]: iSkillExpirationSettings}) => void;
};

type iSkillExpirationFormState = {
  initialNotificationEnabled: boolean;
  initialNotificationDays: string;
  followUpNotificationEnabled: boolean;
  followUpNotificationDays: string;
  monitoredSkillCodes: string[];
  skillExpirationNotificationEmails: string;
  individualNotificationEmailSubject: string;
  individualNotificationEmailBody: iSkillExpirationEmailTemplateBody;
  bulkNotificationEmailSubject: string;
  bulkNotificationEmailBody: iSkillExpirationEmailTemplateBody;
};

const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const existing: Partial<iSkillExpirationSettings> = module.settings?.[MODULE_SETTINGS_KEY] || {};
  const [selectedTab, setSelectedTab] = useState(TAB_TIMING);
  const [form, setForm] = useState<iSkillExpirationFormState>({
    initialNotificationEnabled: existing.initialNotificationEnabled !== false,
    initialNotificationDays: `${existing.initialNotificationDays ?? ''}`,
    followUpNotificationEnabled: existing.followUpNotificationEnabled !== false,
    followUpNotificationDays: `${existing.followUpNotificationDays ?? ''}`,
    monitoredSkillCodes: existing.monitoredSkillCodes || [],
    skillExpirationNotificationEmails: existing.skillExpirationNotificationEmails || '',
    individualNotificationEmailSubject: existing.individualNotificationEmailSubject || '',
    individualNotificationEmailBody: getEmailTemplateBody(existing.individualNotificationEmailBody),
    bulkNotificationEmailSubject: existing.bulkNotificationEmailSubject || '',
    bulkNotificationEmailBody: getEmailTemplateBody(existing.bulkNotificationEmailBody),
  });
  const [errMap, setErrMap] = useState<iErrorMap>({});

  const handleUpdate = (overrides: Partial<iSkillExpirationFormState> = {}) => {
    const next = {...form, ...overrides};
    setForm(next);

    const errors: iErrorMap = {};
    if (
      next.initialNotificationEnabled &&
      (`${next.initialNotificationDays}`.trim() === '' || Number(next.initialNotificationDays) < 1)
    ) {
      errors.initialNotificationDays = 'Enter at least 1 day.';
    }
    if (
      next.followUpNotificationEnabled &&
      (`${next.followUpNotificationDays}`.trim() === '' || Number(next.followUpNotificationDays) < 0)
    ) {
      errors.followUpNotificationDays = 'Enter 0 or more days.';
    }
    const invalidEmails = getInvalidEmails(next.skillExpirationNotificationEmails);
    if (invalidEmails.length > 0) {
      errors.skillExpirationNotificationEmails = `Invalid email address(es): ${invalidEmails.join(', ')}`;
    }
    setErrMap(errors);

    onUpdate({
      [MODULE_SETTINGS_KEY]: {
        initialNotificationEnabled: next.initialNotificationEnabled,
        initialNotificationDays: Number(next.initialNotificationDays) || 0,
        followUpNotificationEnabled: next.followUpNotificationEnabled,
        followUpNotificationDays: Number(next.followUpNotificationDays) || 0,
        monitoredSkillCodes: next.monitoredSkillCodes,
        skillExpirationNotificationEmails: next.skillExpirationNotificationEmails,
        individualNotificationEmailSubject: next.individualNotificationEmailSubject,
        individualNotificationEmailBody: next.individualNotificationEmailBody,
        bulkNotificationEmailSubject: next.bulkNotificationEmailSubject,
        bulkNotificationEmailBody: next.bulkNotificationEmailBody,
      },
    });
  };

  return (
    <Tabs variant={'pills'} activeKey={selectedTab} className={'mb-3'} onSelect={k => setSelectedTab(k || TAB_TIMING)}>
      <Tab eventKey={TAB_TIMING} title={'Notification Timing'}>
        <SectionDiv>
          <div className={'row g-3'}>
            <div className={'col-lg-6'}>
              <Form.Check
                id={'initial-notification-enabled'}
                type={'switch'}
                label={'Initial notification'}
                checked={form.initialNotificationEnabled}
                onChange={event => handleUpdate({initialNotificationEnabled: event.target.checked})}
              />
              <Form.Label>Days before expiration</Form.Label>
              <Form.Control
                aria-label={'Initial notification (days before expiration)'}
                type={'number'}
                min={1}
                disabled={!form.initialNotificationEnabled}
                isInvalid={'initialNotificationDays' in errMap}
                value={form.initialNotificationDays}
                onChange={event => handleUpdate({initialNotificationDays: event.target.value})}
              />
              <FormErrorDisplay errorsMap={errMap} fieldName={'initialNotificationDays'} />
            </div>
            <div className={'col-lg-6'}>
              <Form.Check
                id={'follow-up-notification-enabled'}
                type={'switch'}
                label={'Follow-up notifications'}
                checked={form.followUpNotificationEnabled}
                onChange={event => handleUpdate({followUpNotificationEnabled: event.target.checked})}
              />
              <Form.Label>Days between reminders</Form.Label>
              <Form.Control
                aria-label={'Follow-up notifications (days between reminders)'}
                type={'number'}
                min={0}
                disabled={!form.followUpNotificationEnabled}
                isInvalid={'followUpNotificationDays' in errMap}
                value={form.followUpNotificationDays}
                onChange={event => handleUpdate({followUpNotificationDays: event.target.value})}
              />
              <small>Set to 0 to send only the initial notification.</small>
              <FormErrorDisplay errorsMap={errMap} fieldName={'followUpNotificationDays'} />
            </div>
          </div>
        </SectionDiv>
      </Tab>

      <Tab eventKey={TAB_SKILLS} title={'Skill Filter'}>
        <SectionDiv>
          <Form.Label>Skill codes to monitor for expiration notifications</Form.Label>
          <SynLuSkillSelector
            isMulti
            allowClear
            values={form.monitoredSkillCodes}
            onSelect={option => {
              const options = (Array.isArray(option) ? option : option ? [option] : []) as iAutoCompleteSingle[];
              handleUpdate({monitoredSkillCodes: options.map(opt => `${opt.value}`)});
            }}
          />
        </SectionDiv>
      </Tab>

      <Tab eventKey={TAB_RECIPIENTS} title={'Recipients'}>
        <SectionDiv>
          <Form.Label>Nominated emails for the bulk summary (separated by ";")</Form.Label>
          <Form.Control
            aria-label={'Nominated emails for the bulk summary'}
            as={'textarea'}
            rows={2}
            isInvalid={'skillExpirationNotificationEmails' in errMap}
            value={form.skillExpirationNotificationEmails}
            onChange={event => handleUpdate({skillExpirationNotificationEmails: event.target.value})}
          />
          <FormErrorDisplay errorsMap={errMap} fieldName={'skillExpirationNotificationEmails'} />
        </SectionDiv>
      </Tab>

      <Tab eventKey={TAB_INDIVIDUAL_EMAIL} title={'Individual Notification Email'}>
        <SectionDiv>
          <Form.Label>Subject</Form.Label>
          <Form.Control
            aria-label={'Individual notification email subject'}
            value={form.individualNotificationEmailSubject}
            onChange={event => handleUpdate({individualNotificationEmailSubject: event.target.value})}
          />
          <Form.Label className={'space-top'}>Body</Form.Label>
          <small>
            Available variables: {'{staffName}'}, {'{skillCode}'}, {'{expirationDate}'}, {'{staffOccupEmail}'}
          </small>
          <EmailTemplateBuilder
            designData={form.individualNotificationEmailBody.design || {}}
            editorRef={() => null}
            onUpdated={editor => {
              editor.exportHtml(data => {
                const {design, html} = data;
                handleUpdate({individualNotificationEmailBody: {design, html}});
              });
            }}
          />
        </SectionDiv>
      </Tab>

      <Tab eventKey={TAB_BULK_EMAIL} title={'Bulk Notification Email'}>
        <SectionDiv>
          <Form.Label>Subject</Form.Label>
          <Form.Control
            aria-label={'Bulk notification email subject'}
            value={form.bulkNotificationEmailSubject}
            onChange={event => handleUpdate({bulkNotificationEmailSubject: event.target.value})}
          />
          <Form.Label className={'space-top'}>Body</Form.Label>
          <small>Available variable: {'{expiringStaffTable}'}</small>
          <EmailTemplateBuilder
            designData={form.bulkNotificationEmailBody.design || {}}
            editorRef={() => null}
            onUpdated={editor => {
              editor.exportHtml(data => {
                const {design, html} = data;
                handleUpdate({bulkNotificationEmailBody: {design, html}});
              });
            }}
          />
        </SectionDiv>
      </Tab>

      <Tab eventKey={TAB_LOGS} title={'Logs'}>
        <SkillExpirationLogsPanel />
      </Tab>
    </Tabs>
  );
};

const SkillExpirationSettingsPanel = () => {
  const [settings, setSettings] = useState({});

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_STAFF_LIST}
      roleId={ROLE_ID_ADMIN}
      getChildren={(module: iModule) => <EditPanel module={module} onUpdate={setSettings} />}
      getSubmitData={() => settings}
    />
  );
};

export default SkillExpirationSettingsPanel;
