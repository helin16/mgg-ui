import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import mockComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';
import StudentAbsenceModuleEditPanel from '../../../../pages/studentAbsences/components/StudentAbsenceModuleEditPanel';
import AppService from '../../../../services/AppService';
import {SectionDivTestId} from '../../../../components/common/__mocks__/SectionDiv';

const fakeModule = {
  settings: {
    dailySummary: {
      from: 'Existing Sender<noreply@example.com>',
      yearLevels: {
        '10': {
          sendToHoy: true,
          luForms: {},
        },
      },
    },
  },
} as any;

let latestSubmitData: any = {};

jest.mock('../../../../components/module/ModuleEditPanel', () => ({
  __esModule: true,
  default: ({getChildren, getSubmitData}: any) => {
    latestSubmitData = getSubmitData();
    return (
      <div>
        {getChildren(fakeModule)}
        <button
          type="button"
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
jest.mock('../../../../services/Toaster', () => ({
  __esModule: true,
  default: {
    showApiError: jest.fn(),
  },
}));
jest.mock('../../../../pages/studentAbsences/components/DailySummaryYearLevelEditPopupBtn', () => ({
  __esModule: true,
  default: ({children}: any) => <button type="button">{children || 'Add year level'}</button>,
}));
jest.mock('../../../../components/common/SectionDiv');
jest.mock('../../../../components/common/Table', () => ({
  __esModule: true,
  default: () => <div data-testid="DailyNotificationTable" />,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (selector: any) => selector({
    auth: {
      user: {
        SynCurrentFileSemester: {
          FileYear: 2026,
          FileSemester: 1,
        },
      },
    },
  }),
}));
jest.mock('../../../../services/AppService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAppService = AppService as jest.Mocked<typeof AppService>;

describe('StudentAbsenceModuleEditPanel', () => {
  mockComponentTestHelper.prepare();

  beforeEach(() => {
    latestSubmitData = {};
    mockedAppService.get.mockResolvedValue({data: []} as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('saves dailySummary.from from the Daily Notification settings tab', async () => {
    render(<StudentAbsenceModuleEditPanel />);

    fireEvent.click(screen.getByRole('tab', {name: 'Daily Notification'}));

    const senderInput = await screen.findByDisplayValue('Existing Sender<noreply@example.com>');
    fireEvent.change(senderInput, {
      target: {
        value: 'Absence Notification<absence@mentonegirls.vic.edu.au>',
      },
    });
    fireEvent.blur(senderInput);
    fireEvent.click(screen.getByRole('button', {name: 'Capture Submit Data'}));

    await waitFor(() =>
      expect(latestSubmitData).toEqual(
        expect.objectContaining({
          dailySummary: expect.objectContaining({
            from: 'Absence Notification<absence@mentonegirls.vic.edu.au>',
            yearLevels: {
              '10': {
                sendToHoy: true,
                luForms: {},
              },
            },
          }),
        })
      )
    );
  });

  test('wraps the Daily Notification title and table in their own SectionDiv', async () => {
    render(<StudentAbsenceModuleEditPanel />);

    fireEvent.click(screen.getByRole('tab', {name: 'Daily Notification'}));

    const title = await screen.findByRole('heading', {name: 'Daily Notification'});
    const wrapper = title.closest(`[data-testid="${SectionDivTestId}"]`);

    expect(wrapper).toBeTruthy();
    expect(within(wrapper as HTMLElement).getByTestId('DailyNotificationTable')).toBeInTheDocument();
    expect(within(wrapper as HTMLElement).queryByText('Sender shown on manual and nightly daily notification emails.')).toBeNull();
  });
});
