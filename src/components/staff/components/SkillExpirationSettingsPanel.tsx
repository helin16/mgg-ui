import {useEffect, useState} from 'react';
import {Form, Spinner, Tab, Tabs} from 'react-bootstrap';
import ModuleAccessWrapper from '../../module/ModuleAccessWrapper';
import MggsModuleService from '../../../services/Module/MggsModuleService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../services/Toaster';
import SectionDiv from '../../common/SectionDiv';
import {FlexContainer} from '../../../styles';
import FormErrorDisplay, {iErrorMap} from '../../form/FormErrorDisplay';
import iModule from '../../../types/modules/iModule';
import iSkillExpirationSettings, {iSkillExpirationEmailTemplateBody} from '../../../types/modules/iSkillExpirationSettings';
import {MGGS_MODULE_ID_STAFF_LIST} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import SynLuSkillSelector from '../../Community/SynLuSkillSelector';
import {iAutoCompleteSingle} from '../../common/AutoComplete';
import EmailTemplateBuilder from '../../Email/EmailTemplateBuilder';

const MODULE_SETTINGS_KEY = 'skillExpiration';

const TAB_TIMING = 'timing';
const TAB_SKILLS = 'skills';
const TAB_RECIPIENTS = 'recipients';
const TAB_INDIVIDUAL_EMAIL = 'individualEmail';
const TAB_BULK_EMAIL = 'bulkEmail';

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
  isSaving: boolean;
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

const validate = (form: iSkillExpirationFormState): iErrorMap => {
  const errors: iErrorMap = {};
  if (
    form.initialNotificationEnabled &&
    (`${form.initialNotificationDays}`.trim() === '' || Number(form.initialNotificationDays) < 1)
  ) {
    errors.initialNotificationDays = 'Enter at least 1 day.';
  }
  if (
    form.followUpNotificationEnabled &&
    (`${form.followUpNotificationDays}`.trim() === '' || Number(form.followUpNotificationDays) < 0)
  ) {
    errors.followUpNotificationDays = 'Enter 0 or more days.';
  }
  const invalidEmails = getInvalidEmails(form.skillExpirationNotificationEmails);
  if (invalidEmails.length > 0) {
    errors.skillExpirationNotificationEmails = `Invalid email address(es): ${invalidEmails.join(', ')}`;
  }
  return errors;
};

const toSettingsPayload = (form: iSkillExpirationFormState): iSkillExpirationSettings => ({
  initialNotificationEnabled: form.initialNotificationEnabled,
  initialNotificationDays: Number(form.initialNotificationDays) || 0,
  followUpNotificationEnabled: form.followUpNotificationEnabled,
  followUpNotificationDays: Number(form.followUpNotificationDays) || 0,
  monitoredSkillCodes: form.monitoredSkillCodes,
  skillExpirationNotificationEmails: form.skillExpirationNotificationEmails,
  individualNotificationEmailSubject: form.individualNotificationEmailSubject,
  individualNotificationEmailBody: form.individualNotificationEmailBody,
  bulkNotificationEmailSubject: form.bulkNotificationEmailSubject,
  bulkNotificationEmailBody: form.bulkNotificationEmailBody,
});

const EditPanel = ({module, isSaving, onUpdate}: iEditPanel) => {
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

  // Updates local form state + live validation feedback only - does not save. Used for onChange of
  // free-text/number fields, so every keystroke doesn't trigger an API call.
  const updateLocal = (overrides: Partial<iSkillExpirationFormState>) => {
    const next = {...form, ...overrides};
    setForm(next);
    setErrMap(validate(next));
    return next;
  };

  // Persists the current (optionally further-overridden) form state directly to the module's settings.
  // Used onBlur for free-text/number fields, and immediately onChange for discrete controls (switches,
  // skill selector, email builder) - there's no separate "Update" button, changes save as they're made.
  const commit = (overrides: Partial<iSkillExpirationFormState> = {}) => {
    const next = updateLocal(overrides);
    if (Object.keys(validate(next)).length > 0) {
      return;
    }
    onUpdate({[MODULE_SETTINGS_KEY]: toSettingsPayload(next)});
  };

  return (
    <SectionDiv>
      {isSaving ? (
        <FlexContainer className={'justify-content-end'}>
          <Spinner animation={'border'} size={'sm'} />{' '}Saving...
        </FlexContainer>
      ) : null}
      <Tabs
        variant={'pills'}
        activeKey={selectedTab}
        className={'mt-3 mb-3'}
        onSelect={k => setSelectedTab(k || TAB_TIMING)}
      >
        <Tab eventKey={TAB_TIMING} title={'Notification Timing'}>
          <SectionDiv>
            <div className={'row g-3'}>
              <div className={'col-lg-6'}>
                <Form.Check
                  id={'initial-notification-enabled'}
                  type={'checkbox'}
                  label={'Initial notification'}
                  checked={form.initialNotificationEnabled}
                  onChange={event => commit({initialNotificationEnabled: event.target.checked})}
                />
                <Form.Label>Days before expiration</Form.Label>
                <Form.Control
                  aria-label={'Initial notification (days before expiration)'}
                  type={'number'}
                  min={1}
                  disabled={!form.initialNotificationEnabled}
                  isInvalid={'initialNotificationDays' in errMap}
                  value={form.initialNotificationDays}
                  onChange={event => updateLocal({initialNotificationDays: event.target.value})}
                  onBlur={() => commit()}
                />
                <FormErrorDisplay errorsMap={errMap} fieldName={'initialNotificationDays'} />
              </div>
              <div className={'col-lg-6'}>
                <Form.Check
                  id={'follow-up-notification-enabled'}
                  type={'checkbox'}
                  label={'Follow-up notifications'}
                  checked={form.followUpNotificationEnabled}
                  onChange={event => commit({followUpNotificationEnabled: event.target.checked})}
                />
                <Form.Label>Days between reminders</Form.Label>
                <Form.Control
                  aria-label={'Follow-up notifications (days between reminders)'}
                  type={'number'}
                  min={0}
                  disabled={!form.followUpNotificationEnabled}
                  isInvalid={'followUpNotificationDays' in errMap}
                  value={form.followUpNotificationDays}
                  onChange={event => updateLocal({followUpNotificationDays: event.target.value})}
                  onBlur={() => commit()}
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
                commit({monitoredSkillCodes: options.map(opt => `${opt.value}`)});
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
              onChange={event => updateLocal({skillExpirationNotificationEmails: event.target.value})}
              onBlur={() => commit()}
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
              onChange={event => updateLocal({individualNotificationEmailSubject: event.target.value})}
              onBlur={() => commit()}
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
                  commit({individualNotificationEmailBody: {design, html}});
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
              onChange={event => updateLocal({bulkNotificationEmailSubject: event.target.value})}
              onBlur={() => commit()}
            />
            <Form.Label className={'space-top'}>Body</Form.Label>
            <small>Available variable: {'{expiringStaffTable}'}</small>
            <EmailTemplateBuilder
              designData={form.bulkNotificationEmailBody.design || {}}
              editorRef={() => null}
              onUpdated={editor => {
                editor.exportHtml(data => {
                  const {design, html} = data;
                  commit({bulkNotificationEmailBody: {design, html}});
                });
              }}
            />
          </SectionDiv>
        </Tab>
      </Tabs>
    </SectionDiv>
  );
};

const SkillExpirationSettingsPanel = () => {
  const [module, setModule] = useState<iModule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    MggsModuleService.getModule(MGGS_MODULE_ID_STAFF_LIST)
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setModule(resp);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCanceled = true;
    };
  }, []);

  const handleUpdate = (data: {[MODULE_SETTINGS_KEY]: iSkillExpirationSettings}) => {
    setIsSaving(true);
    MggsModuleService.updateModule(MGGS_MODULE_ID_STAFF_LIST, {
      settings: {
        ...(module?.settings || {}),
        ...data,
      },
    })
      .then(resp => {
        setModule(resp);
        Toaster.showToast('Settings saved.', TOAST_TYPE_SUCCESS);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const getContent = () => {
    if (isLoading) {
      return <Spinner animation={'border'} />;
    }
    if (!module) {
      return null;
    }
    return <EditPanel module={module} isSaving={isSaving} onUpdate={handleUpdate} />;
  };

  return (
    <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_STAFF_LIST} roleId={ROLE_ID_ADMIN} silentMode>
      {getContent()}
    </ModuleAccessWrapper>
  );
};

export default SkillExpirationSettingsPanel;
