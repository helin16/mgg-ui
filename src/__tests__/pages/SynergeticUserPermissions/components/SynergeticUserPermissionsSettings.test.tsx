import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {SettingsEditor}
  from '../../../../pages/SynergeticUserPermissions/components/SynergeticUserPermissionsSettings';

jest.mock('../../../../components/common/SectionDiv', () => ({children}: any) => <section>{children}</section>);
jest.mock('../../../../components/Synergetic/SynLuDocumentClassificationSelector', () => () => <div />);
jest.mock('../../../../components/Synergetic/SynConfigUserSelector', () => () => <div />);

const module = {
  ModuleID: 25,
  Name: 'Synergetic User Permissions',
  Description: '',
  Active: true,
  CreatedAt: new Date(),
  CreatedById: 1,
  UpdatedAt: new Date(),
  UpdatedById: 1,
  settings: {
    documentClassificationCodes: ['MEDICAL'],
    reportCodes: ['REPORT_A'],
    excludedUserIds: [3],
  },
};

describe('SynergeticUserPermissionsSettings report codes', () => {
  test('allows report codes to be added, edited and removed', async () => {
    const onUpdate = jest.fn();
    render(<SettingsEditor module={module} onUpdate={onUpdate} />);

    const firstInput = await screen.findByDisplayValue('REPORT_A');
    fireEvent.change(firstInput, {target: {value: 'REPORT_B'}});
    expect(onUpdate).toHaveBeenLastCalledWith(expect.objectContaining({
      reportCodes: ['REPORT_B'],
      documentClassificationCodes: ['MEDICAL'],
      excludedUserIds: [3],
    }));

    fireEvent.click(screen.getByRole('button', {name: 'Add Report'}));
    expect(screen.getAllByPlaceholderText('Enter report code')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', {name: 'Remove report REPORT_B'}));
    expect(screen.getAllByPlaceholderText('Enter report code')).toHaveLength(1);
  });
});
