import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import SkillExpirationSettingsPanel from '../../../components/staff/components/SkillExpirationSettingsPanel';
import MggsModuleService from '../../../services/Module/MggsModuleService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../services/Toaster';
import {MGGS_MODULE_ID_STAFF_LIST} from '../../../types/modules/iModuleUser';

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

jest.mock('../../../components/module/ModuleAccessWrapper');
jest.mock('../../../services/Module/MggsModuleService');
jest.mock('../../../services/Toaster');
jest.mock('../../../components/Community/SynLuSkillSelector');
jest.mock('../../../components/Email/EmailTemplateBuilder');
jest.mock('../../../components/staff/components/SkillExpirationLogsPanel', () => ({
  __esModule: true,
  default: () => <div data-testid={'SkillExpirationLogsPanelTestId'} />,
}));

const mockedModuleService = MggsModuleService as jest.Mocked<typeof MggsModuleService>;
const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

describe('SkillExpirationSettingsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedModuleService.getModule.mockResolvedValue(fakeModule);
    mockedModuleService.updateModule.mockResolvedValue(fakeModule);
  });

  test('loads the module settings on mount', async () => {
    render(<SkillExpirationSettingsPanel />);

    await waitFor(() => expect(mockedModuleService.getModule).toHaveBeenCalledWith(MGGS_MODULE_ID_STAFF_LIST));
    expect(await screen.findByLabelText('Initial notification (days before expiration)')).toHaveValue(14);
  });

  test('pre-fills fields from existing settings', async () => {
    render(<SkillExpirationSettingsPanel />);

    expect(await screen.findByLabelText('Initial notification (days before expiration)')).toHaveValue(14);
    expect(screen.getByLabelText('Follow-up notifications (days between reminders)')).toHaveValue(7);
    expect(screen.getByLabelText('Nominated emails for the bulk summary')).toHaveValue(
      'admin@school.com;hoy@school.com'
    );
    expect(screen.getByLabelText('Individual notification email subject')).toHaveValue('Existing individual subject');
    expect(screen.getByLabelText('Bulk notification email subject')).toHaveValue('Existing bulk subject');
  });

  test('saves the day-count fields on blur, merged with the rest of the current form', async () => {
    render(<SkillExpirationSettingsPanel />);
    const input = await screen.findByLabelText('Initial notification (days before expiration)');

    fireEvent.change(input, {target: {value: '21'}});
    fireEvent.blur(input);

    await waitFor(() =>
      expect(mockedModuleService.updateModule).toHaveBeenCalledWith(
        MGGS_MODULE_ID_STAFF_LIST,
        expect.objectContaining({
          settings: expect.objectContaining({
            skillExpiration: expect.objectContaining({
              initialNotificationDays: 21,
              followUpNotificationDays: 7,
              monitoredSkillCodes: ['CPR', 'FirstAid'],
            }),
          }),
        })
      )
    );
    expect(mockedToaster.showToast).toHaveBeenCalledWith('Settings saved.', TOAST_TYPE_SUCCESS);
  });

  test('does not save while the value is invalid, and saves once corrected on blur', async () => {
    render(<SkillExpirationSettingsPanel />);
    const emailsInput = await screen.findByLabelText('Nominated emails for the bulk summary');

    fireEvent.change(emailsInput, {target: {value: 'not-an-email'}});
    fireEvent.blur(emailsInput);

    expect(await screen.findByText(/Invalid email address\(es\): not-an-email/)).toBeInTheDocument();
    expect(mockedModuleService.updateModule).not.toHaveBeenCalled();

    fireEvent.change(emailsInput, {target: {value: 'valid@school.com'}});
    fireEvent.blur(emailsInput);

    await waitFor(() =>
      expect(mockedModuleService.updateModule).toHaveBeenCalledWith(
        MGGS_MODULE_ID_STAFF_LIST,
        expect.objectContaining({
          settings: expect.objectContaining({
            skillExpiration: expect.objectContaining({skillExpirationNotificationEmails: 'valid@school.com'}),
          }),
        })
      )
    );
  });

  test('updates monitoredSkillCodes from the skill selector immediately (no blur needed)', async () => {
    render(<SkillExpirationSettingsPanel />);
    await screen.findByLabelText('Initial notification (days before expiration)');

    // The mocked selector simulates a selection event with a single option (value: 'CPR'),
    // matching how a real multi-select onChange reports its full next selection.
    fireEvent.click(screen.getByRole('button', {name: 'Select Skill'}));

    await waitFor(() =>
      expect(mockedModuleService.updateModule).toHaveBeenCalledWith(
        MGGS_MODULE_ID_STAFF_LIST,
        expect.objectContaining({
          settings: expect.objectContaining({
            skillExpiration: expect.objectContaining({monitoredSkillCodes: ['CPR']}),
          }),
        })
      )
    );
  });

  test('renders the notification toggles as plain checkboxes, defaulting to on', async () => {
    render(<SkillExpirationSettingsPanel />);

    const initialCheckbox = await screen.findByLabelText('Initial notification');
    const followUpCheckbox = screen.getByLabelText('Follow-up notifications');
    expect(initialCheckbox).toHaveAttribute('type', 'checkbox');
    expect(followUpCheckbox).toHaveAttribute('type', 'checkbox');
    expect(initialCheckbox).toBeChecked();
    expect(followUpCheckbox).toBeChecked();
  });

  test('turning the initial notification checkbox off disables its day input, clears its error, and saves immediately', async () => {
    render(<SkillExpirationSettingsPanel />);
    const input = await screen.findByLabelText('Initial notification (days before expiration)');

    fireEvent.change(input, {target: {value: '0'}});
    fireEvent.blur(input);
    expect(await screen.findByText('Enter at least 1 day.')).toBeInTheDocument();
    mockedModuleService.updateModule.mockClear();

    fireEvent.click(screen.getByLabelText('Initial notification'));

    expect(screen.getByLabelText('Initial notification (days before expiration)')).toBeDisabled();
    expect(screen.queryByText('Enter at least 1 day.')).not.toBeInTheDocument();
    await waitFor(() =>
      expect(mockedModuleService.updateModule).toHaveBeenCalledWith(
        MGGS_MODULE_ID_STAFF_LIST,
        expect.objectContaining({
          settings: expect.objectContaining({
            skillExpiration: expect.objectContaining({initialNotificationEnabled: false}),
          }),
        })
      )
    );
  });

  test('turning the follow-up notification checkbox off saves immediately', async () => {
    render(<SkillExpirationSettingsPanel />);
    await screen.findByLabelText('Initial notification (days before expiration)');

    fireEvent.click(screen.getByLabelText('Follow-up notifications'));

    expect(screen.getByLabelText('Follow-up notifications (days between reminders)')).toBeDisabled();
    await waitFor(() =>
      expect(mockedModuleService.updateModule).toHaveBeenCalledWith(
        MGGS_MODULE_ID_STAFF_LIST,
        expect.objectContaining({
          settings: expect.objectContaining({
            skillExpiration: expect.objectContaining({followUpNotificationEnabled: false}),
          }),
        })
      )
    );
  });

  test('updates the individual and bulk email bodies via EmailTemplateBuilder immediately', async () => {
    render(<SkillExpirationSettingsPanel />);
    await screen.findByLabelText('Initial notification (days before expiration)');

    const [individualBuilder, bulkBuilder] = screen.getAllByRole('button', {name: 'Trigger Design Update'});
    fireEvent.click(individualBuilder);

    await waitFor(() =>
      expect(mockedModuleService.updateModule).toHaveBeenLastCalledWith(
        MGGS_MODULE_ID_STAFF_LIST,
        expect.objectContaining({
          settings: expect.objectContaining({
            skillExpiration: expect.objectContaining({
              individualNotificationEmailBody: {design: {fake: 'design'}, html: '<p>fake html</p>'},
            }),
          }),
        })
      )
    );

    fireEvent.click(bulkBuilder);

    await waitFor(() =>
      expect(mockedModuleService.updateModule).toHaveBeenLastCalledWith(
        MGGS_MODULE_ID_STAFF_LIST,
        expect.objectContaining({
          settings: expect.objectContaining({
            skillExpiration: expect.objectContaining({
              bulkNotificationEmailBody: {design: {fake: 'design'}, html: '<p>fake html</p>'},
            }),
          }),
        })
      )
    );
  });

  test('renders a Logs tab', async () => {
    render(<SkillExpirationSettingsPanel />);

    expect(await screen.findByRole('tab', {name: 'Logs'})).toBeInTheDocument();
    expect(screen.getByTestId('SkillExpirationLogsPanelTestId')).toBeInTheDocument();
  });

  test('does not render an Update/Save button - changes save as they are made', async () => {
    render(<SkillExpirationSettingsPanel />);
    await screen.findByLabelText('Initial notification (days before expiration)');

    expect(screen.queryByRole('button', {name: 'Update'})).not.toBeInTheDocument();
  });

  test('shows an API error toast if saving fails', async () => {
    mockedModuleService.updateModule.mockRejectedValueOnce(new Error('save failed'));
    render(<SkillExpirationSettingsPanel />);
    const input = await screen.findByLabelText('Initial notification (days before expiration)');

    fireEvent.change(input, {target: {value: '21'}});
    fireEvent.blur(input);

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalled());
  });
});
