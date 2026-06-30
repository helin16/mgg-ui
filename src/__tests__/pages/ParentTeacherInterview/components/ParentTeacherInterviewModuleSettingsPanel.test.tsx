import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import ParentTeacherInterviewModuleSettingsPanel from '../../../../pages/ParentTeacherInterview/components/ParentTeacherInterviewModuleSettingsPanel';
import {MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW} from '../../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../../types/modules/iRole';

const fakeModule = {
  settings: {
    parentTeacherInterviewCalendar: {
      isAllDay: false,
      startDateTime: '2026-07-01T09:00',
      endDateTime: '2026-07-01T10:00',
      subject: 'Existing subject',
      bodyText: 'Existing body',
    },
  },
} as any;

let latestSubmitData: any = {};
let latestProps: any = null;

jest.mock('../../../../components/module/ModuleEditPanel', () => ({
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

describe('ParentTeacherInterviewModuleSettingsPanel', () => {
  beforeEach(() => {
    latestSubmitData = {};
    latestProps = null;
  });

  test('renders the module settings editor through ModuleEditPanel', () => {
    render(<ParentTeacherInterviewModuleSettingsPanel />);

    expect(screen.getByTestId('ModuleEditPanelTestId')).toBeInTheDocument();
    expect(latestProps).toEqual(
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW,
        roleId: ROLE_ID_ADMIN,
        getChildren: expect.any(Function),
        getSubmitData: expect.any(Function),
      })
    );
  });

  test('saves default interview datetimes with subject and body settings', async () => {
    render(<ParentTeacherInterviewModuleSettingsPanel />);

    fireEvent.change(screen.getByLabelText('Default Interview Start Time'), {
      target: {
        value: '2026-07-02T11:00',
      },
    });
    fireEvent.change(screen.getByLabelText('Default Interview End Time'), {
      target: {
        value: '2026-07-02T12:00',
      },
    });
    fireEvent.change(screen.getByLabelText('Subject'), {
      target: {
        value: 'Updated subject',
      },
    });
    fireEvent.change(screen.getByLabelText('Body Text'), {
      target: {
        value: 'Updated body',
      },
    });
    fireEvent.click(screen.getByRole('button', {name: 'Capture Submit Data'}));

    await waitFor(() =>
      expect(latestSubmitData).toEqual(
        expect.objectContaining({
          parentTeacherInterviewCalendar: {
            isAllDay: false,
            startDateTime: '2026-07-02T11:00',
            endDateTime: '2026-07-02T12:00',
            subject: 'Updated subject',
            bodyText: 'Updated body',
          },
        })
      )
    );
  });

  test('supports default all-day settings and converts current values to dates', async () => {
    render(<ParentTeacherInterviewModuleSettingsPanel />);

    fireEvent.click(screen.getByLabelText('Default All Day'));

    expect(screen.getByLabelText('Default Interview Start Time')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Default Interview End Time')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Default Interview Start Time')).toHaveValue('2026-07-01');
    expect(screen.getByLabelText('Default Interview End Time')).toHaveValue('2026-07-01');

    fireEvent.change(screen.getByLabelText('Default Interview Start Time'), {
      target: {
        value: '2026-07-03',
      },
    });
    fireEvent.change(screen.getByLabelText('Default Interview End Time'), {
      target: {
        value: '2026-07-04',
      },
    });
    fireEvent.click(screen.getByRole('button', {name: 'Capture Submit Data'}));

    await waitFor(() =>
      expect(latestSubmitData).toEqual(
        expect.objectContaining({
          parentTeacherInterviewCalendar: {
            isAllDay: true,
            startDateTime: '2026-07-03',
            endDateTime: '2026-07-04',
            subject: 'Existing subject',
            bodyText: 'Existing body',
          },
        })
      )
    );
  });
});
