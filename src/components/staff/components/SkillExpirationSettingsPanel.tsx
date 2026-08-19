import {useState} from 'react';
import {Form} from 'react-bootstrap';
import ModuleEditPanel from '../../module/ModuleEditPanel';
import SectionDiv from '../../common/SectionDiv';
import FormErrorDisplay, {iErrorMap} from '../../form/FormErrorDisplay';
import iModule from '../../../types/modules/iModule';
import iSkillExpirationSettings from '../../../types/modules/iSkillExpirationSettings';
import {MGGS_MODULE_ID_STAFF_LIST} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import SynLuSkillSelector from '../../Community/SynLuSkillSelector';
import {iAutoCompleteSingle} from '../../common/AutoComplete';

const MODULE_SETTINGS_KEY = 'skillExpiration';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getInvalidEmails = (value: string) => {
  return value
    .split(';')
    .map(email => email.trim())
    .filter(email => email !== '' && !isValidEmail(email));
};

type iEditPanel = {
  module: iModule;
  onUpdate: (data: {[MODULE_SETTINGS_KEY]: iSkillExpirationSettings}) => void;
};

const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const existing: Partial<iSkillExpirationSettings> = module.settings?.[MODULE_SETTINGS_KEY] || {};
  const [initialNotificationDays, setInitialNotificationDays] = useState(`${existing.initialNotificationDays ?? ''}`);
  const [followUpNotificationDays, setFollowUpNotificationDays] = useState(`${existing.followUpNotificationDays ?? ''}`);
  const [monitoredSkillCodes, setMonitoredSkillCodes] = useState<string[]>(existing.monitoredSkillCodes || []);
  const [skillExpirationNotificationEmails, setSkillExpirationNotificationEmails] = useState(existing.skillExpirationNotificationEmails || '');
  const [individualNotificationEmailSubject, setIndividualNotificationEmailSubject] = useState(existing.individualNotificationEmailSubject || '');
  const [individualNotificationEmailBody, setIndividualNotificationEmailBody] = useState(existing.individualNotificationEmailBody || '');
  const [bulkNotificationEmailSubject, setBulkNotificationEmailSubject] = useState(existing.bulkNotificationEmailSubject || '');
  const [bulkNotificationEmailBody, setBulkNotificationEmailBody] = useState(existing.bulkNotificationEmailBody || '');
  const [errMap, setErrMap] = useState<iErrorMap>({});

  const handleUpdate = (
    nextInitialNotificationDays = initialNotificationDays,
    nextFollowUpNotificationDays = followUpNotificationDays,
    nextMonitoredSkillCodes = monitoredSkillCodes,
    nextSkillExpirationNotificationEmails = skillExpirationNotificationEmails,
    nextIndividualNotificationEmailSubject = individualNotificationEmailSubject,
    nextIndividualNotificationEmailBody = individualNotificationEmailBody,
    nextBulkNotificationEmailSubject = bulkNotificationEmailSubject,
    nextBulkNotificationEmailBody = bulkNotificationEmailBody
  ) => {
    const errors: iErrorMap = {};
    if (`${nextInitialNotificationDays}`.trim() === '' || Number(nextInitialNotificationDays) < 1) {
      errors.initialNotificationDays = 'Enter at least 1 day.';
    }
    if (`${nextFollowUpNotificationDays}`.trim() === '' || Number(nextFollowUpNotificationDays) < 0) {
      errors.followUpNotificationDays = 'Enter 0 or more days.';
    }
    const invalidEmails = getInvalidEmails(nextSkillExpirationNotificationEmails);
    if (invalidEmails.length > 0) {
      errors.skillExpirationNotificationEmails = `Invalid email address(es): ${invalidEmails.join(', ')}`;
    }
    setErrMap(errors);

    onUpdate({
      [MODULE_SETTINGS_KEY]: {
        initialNotificationDays: Number(nextInitialNotificationDays) || 0,
        followUpNotificationDays: Number(nextFollowUpNotificationDays) || 0,
        monitoredSkillCodes: nextMonitoredSkillCodes,
        skillExpirationNotificationEmails: nextSkillExpirationNotificationEmails,
        individualNotificationEmailSubject: nextIndividualNotificationEmailSubject,
        individualNotificationEmailBody: nextIndividualNotificationEmailBody,
        bulkNotificationEmailSubject: nextBulkNotificationEmailSubject,
        bulkNotificationEmailBody: nextBulkNotificationEmailBody,
      },
    });
  };

  return (
    <SectionDiv>
      <SectionDiv className={'margin-bottom'}>
        <h5>Notification Timing</h5>
        <div className={'row g-3'}>
          <div className={'col-lg-4'}>
            <Form.Label>Initial notification (days before expiration)</Form.Label>
            <Form.Control
              aria-label={'Initial notification (days before expiration)'}
              type={'number'}
              min={1}
              isInvalid={'initialNotificationDays' in errMap}
              value={initialNotificationDays}
              onChange={event => {
                const nextValue = event.target.value;
                setInitialNotificationDays(nextValue);
                handleUpdate(nextValue);
              }}
            />
            <FormErrorDisplay errorsMap={errMap} fieldName={'initialNotificationDays'} />
          </div>
          <div className={'col-lg-4'}>
            <Form.Label>Follow-up notifications (days between reminders)</Form.Label>
            <Form.Control
              aria-label={'Follow-up notifications (days between reminders)'}
              type={'number'}
              min={0}
              isInvalid={'followUpNotificationDays' in errMap}
              value={followUpNotificationDays}
              onChange={event => {
                const nextValue = event.target.value;
                setFollowUpNotificationDays(nextValue);
                handleUpdate(initialNotificationDays, nextValue);
              }}
            />
            <small>Set to 0 to send only the initial notification.</small>
            <FormErrorDisplay errorsMap={errMap} fieldName={'followUpNotificationDays'} />
          </div>
        </div>
      </SectionDiv>

      <SectionDiv className={'margin-bottom'}>
        <h5>Skill Filter</h5>
        <Form.Label>Skill codes to monitor for expiration notifications</Form.Label>
        <SynLuSkillSelector
          isMulti
          allowClear
          values={monitoredSkillCodes}
          onSelect={option => {
            const options = (Array.isArray(option) ? option : option ? [option] : []) as iAutoCompleteSingle[];
            const nextValue = options.map(opt => `${opt.value}`);
            setMonitoredSkillCodes(nextValue);
            handleUpdate(initialNotificationDays, followUpNotificationDays, nextValue);
          }}
        />
      </SectionDiv>

      <SectionDiv className={'margin-bottom'}>
        <h5>Recipients</h5>
        <Form.Label>Nominated emails for the bulk summary (separated by ";")</Form.Label>
        <Form.Control
          aria-label={'Nominated emails for the bulk summary'}
          as={'textarea'}
          rows={2}
          isInvalid={'skillExpirationNotificationEmails' in errMap}
          value={skillExpirationNotificationEmails}
          onChange={event => {
            const nextValue = event.target.value;
            setSkillExpirationNotificationEmails(nextValue);
            handleUpdate(initialNotificationDays, followUpNotificationDays, monitoredSkillCodes, nextValue);
          }}
        />
        <FormErrorDisplay errorsMap={errMap} fieldName={'skillExpirationNotificationEmails'} />
      </SectionDiv>

      <SectionDiv className={'margin-bottom'}>
        <h5>Individual Notification Email</h5>
        <div className={'row g-3'}>
          <div className={'col-lg-12'}>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              aria-label={'Individual notification email subject'}
              value={individualNotificationEmailSubject}
              onChange={event => {
                const nextValue = event.target.value;
                setIndividualNotificationEmailSubject(nextValue);
                handleUpdate(
                  initialNotificationDays,
                  followUpNotificationDays,
                  monitoredSkillCodes,
                  skillExpirationNotificationEmails,
                  nextValue
                );
              }}
            />
          </div>
          <div className={'col-lg-12'}>
            <Form.Label>Body</Form.Label>
            <Form.Control
              aria-label={'Individual notification email body'}
              as={'textarea'}
              rows={4}
              value={individualNotificationEmailBody}
              onChange={event => {
                const nextValue = event.target.value;
                setIndividualNotificationEmailBody(nextValue);
                handleUpdate(
                  initialNotificationDays,
                  followUpNotificationDays,
                  monitoredSkillCodes,
                  skillExpirationNotificationEmails,
                  individualNotificationEmailSubject,
                  nextValue
                );
              }}
            />
            <small>Available variables: {'{staffName}'}, {'{skillCode}'}, {'{expirationDate}'}, {'{staffOccupEmail}'}</small>
          </div>
        </div>
      </SectionDiv>

      <SectionDiv>
        <h5>Bulk Notification Email</h5>
        <div className={'row g-3'}>
          <div className={'col-lg-12'}>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              aria-label={'Bulk notification email subject'}
              value={bulkNotificationEmailSubject}
              onChange={event => {
                const nextValue = event.target.value;
                setBulkNotificationEmailSubject(nextValue);
                handleUpdate(
                  initialNotificationDays,
                  followUpNotificationDays,
                  monitoredSkillCodes,
                  skillExpirationNotificationEmails,
                  individualNotificationEmailSubject,
                  individualNotificationEmailBody,
                  nextValue
                );
              }}
            />
          </div>
          <div className={'col-lg-12'}>
            <Form.Label>Body</Form.Label>
            <Form.Control
              aria-label={'Bulk notification email body'}
              as={'textarea'}
              rows={4}
              value={bulkNotificationEmailBody}
              onChange={event => {
                const nextValue = event.target.value;
                setBulkNotificationEmailBody(nextValue);
                handleUpdate(
                  initialNotificationDays,
                  followUpNotificationDays,
                  monitoredSkillCodes,
                  skillExpirationNotificationEmails,
                  individualNotificationEmailSubject,
                  individualNotificationEmailBody,
                  bulkNotificationEmailSubject,
                  nextValue
                );
              }}
            />
            <small>Available variable: {'{expiringStaffTable}'}</small>
          </div>
        </div>
      </SectionDiv>
    </SectionDiv>
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
