import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import SkillExpirationSettingsPanel from '../../../components/staff/components/SkillExpirationSettingsPanel';
import {MGGS_MODULE_ID_STAFF_LIST} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';

const fakeModule = {
  settings: {
    skillExpiration: {
      initialNotificationDays: 14,
      followUpNotificationDays: 7,
      monitoredSkillCodes: ['CPR', 'FirstAid'],
      skillExpirationNotificationEmails: 'admin@school.com;hoy@school.com',
      individualNotificationEmailSubject: 'Existing individual subject',
      individualNotificationEmailBody: 'Existing individual body',
      bulkNotificationEmailSubject: 'Existing bulk subject',
      bulkNotificationEmailBody: 'Existing bulk body',
    },
  },
} as any;

let latestSubmitData: any = {};
let latestProps: any = null;

jest.mock('../../../components/module/ModuleEditPanel', () => ({
  __esModule: true,
  default: ({getChildren, getSubmitData, module, ...props}: any) => {
    latestProps = {...props, getChildren, getSubmitData, module};
    latestSubmitData = getSubmitData();
    return (
      <div data-testid={'ModuleEditPanelTestId'}>
        {getChildren(module || fakeModule)}
        <button
          type={'button'}
          onClick={() => {
            latestSubmitData = getSubmitData();
          }}
        >
          Capture Submit Data
        </button>
      </div>
    );
  },
}));

jest.mock('../../../components/Community/SynLuSkillSelector');

describe('SkillExpirationSettingsPanel', () => {
  beforeEach(() => {
    latestSubmitData = {};
    latestProps = null;
  });

  test('renders the module settings editor through ModuleEditPanel', () => {
    render(<SkillExpirationSettingsPanel />);

    expect(screen.getByTestId('ModuleEditPanelTestId')).toBeInTheDocument();
    expect(latestProps).toEqual(
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_STAFF_LIST,
        roleId: ROLE_ID_ADMIN,
        getChildren: expect.any(Function),
        getSubmitData: expect.any(Function),
      })
    );
  });

  test('pre-fills fields from existing settings', () => {
    render(<SkillExpirationSettingsPanel />);

    expect(screen.getByLabelText('Initial notification (days before expiration)')).toHaveValue(14);
    expect(screen.getByLabelText('Follow-up notifications (days between reminders)')).toHaveValue(7);
    expect(screen.getByLabelText('Nominated emails for the bulk summary')).toHaveValue(
      'admin@school.com;hoy@school.com'
    );
    expect(screen.getByLabelText('Individual notification email subject')).toHaveValue('Existing individual subject');
    expect(screen.getByLabelText('Bulk notification email subject')).toHaveValue('Existing bulk subject');
  });

  test('saves updated timing, emails, and template fields as a single skillExpiration object', async () => {
    render(<SkillExpirationSettingsPanel />);

    fireEvent.change(screen.getByLabelText('Initial notification (days before expiration)'), {
      target: {value: '21'},
    });
    fireEvent.change(screen.getByLabelText('Follow-up notifications (days between reminders)'), {
      target: {value: '3'},
    });
    fireEvent.change(screen.getByLabelText('Individual notification email subject'), {
      target: {value: 'Updated individual subject'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Capture Submit Data'}));

    await waitFor(() =>
      expect(latestSubmitData).toEqual(
        expect.objectContaining({
          skillExpiration: expect.objectContaining({
            initialNotificationDays: 21,
            followUpNotificationDays: 3,
            individualNotificationEmailSubject: 'Updated individual subject',
            monitoredSkillCodes: ['CPR', 'FirstAid'],
          }),
        })
      )
    );
  });

  test('shows a validation error for an invalid nominated email and still reflects it in submit data', async () => {
    render(<SkillExpirationSettingsPanel />);

    fireEvent.change(screen.getByLabelText('Nominated emails for the bulk summary'), {
      target: {value: 'not-an-email;admin@school.com'},
    });

    expect(await screen.findByText(/Invalid email address\(es\): not-an-email/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: 'Capture Submit Data'}));
    await waitFor(() =>
      expect(latestSubmitData.skillExpiration.skillExpirationNotificationEmails).toBe(
        'not-an-email;admin@school.com'
      )
    );
  });

  test('updates monitoredSkillCodes from the skill selector', async () => {
    render(<SkillExpirationSettingsPanel />);

    // The mocked selector simulates a selection event with a single option (value: 'CPR'),
    // matching how a real multi-select onChange reports its full next selection.
    fireEvent.click(screen.getByRole('button', {name: 'Select Skill'}));
    fireEvent.click(screen.getByRole('button', {name: 'Capture Submit Data'}));

    await waitFor(() => expect(latestSubmitData.skillExpiration.monitoredSkillCodes).toEqual(['CPR']));
  });
});
