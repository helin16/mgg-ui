import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SynReportsSearchPanel from '../../../../pages/SynergeticUserPermissions/components/SynReportsSearchPanel';
import * as SynReportsPermissionTableModule from '../../../../pages/SynergeticUserPermissions/components/SynReportsPermissionTable';

jest.mock('../../../../pages/SynergeticUserPermissions/components/SynReportsPermissionTable', () => ({
  __esModule: true,
  default: ({reportCode}: any) => <div>Report Table: {reportCode}</div>,
}));

describe('SynReportsSearchPanel', () => {
  test('renders input box with placeholder and search button', () => {
    render(<SynReportsSearchPanel />);

    const input = screen.getByPlaceholderText('Please type in the report code...');
    const button = screen.getByRole('button', {name: 'Search'});

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('does not show table initially', () => {
    render(<SynReportsSearchPanel />);

    expect(screen.queryByText(/Report Table:/)).not.toBeInTheDocument();
  });

  test('shows table with entered report code after clicking search button', async () => {
    const user = userEvent.setup();
    render(<SynReportsSearchPanel />);

    const input = screen.getByPlaceholderText('Please type in the report code...');
    const button = screen.getByRole('button', {name: 'Search'});

    await user.type(input, 'REPORT_A');
    await user.click(button);

    expect(screen.getByText('Report Table: REPORT_A')).toBeInTheDocument();
  });

  test('shows table with uppercase report code after clicking search button', async () => {
    const user = userEvent.setup();
    render(<SynReportsSearchPanel />);

    const input = screen.getByPlaceholderText('Please type in the report code...');
    const button = screen.getByRole('button', {name: 'Search'});

    await user.type(input, 'report_b');
    await user.click(button);

    expect(screen.getByText('Report Table: REPORT_B')).toBeInTheDocument();
  });

  test('shows table when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<SynReportsSearchPanel />);

    const input = screen.getByPlaceholderText('Please type in the report code...');

    await user.type(input, 'REPORT_C{Enter}');

    expect(screen.getByText('Report Table: REPORT_C')).toBeInTheDocument();
  });

  test('passes excludedUserIds to table component', async () => {
    const user = userEvent.setup();
    const excludedIds = [1, 2, 3];
    const spy = jest.spyOn(SynReportsPermissionTableModule, 'default');

    render(<SynReportsSearchPanel excludedUserIds={excludedIds} />);

    const input = screen.getByPlaceholderText('Please type in the report code...');
    const button = screen.getByRole('button', {name: 'Search'});

    await user.type(input, 'REPORT_A');
    await user.click(button);

    expect(spy).toHaveBeenCalledWith({reportCode: 'REPORT_A', excludedUserIds: excludedIds}, {});

    spy.mockRestore();
  });

  test('does not search if input is empty or only whitespace', async () => {
    const user = userEvent.setup();
    render(<SynReportsSearchPanel />);

    const input = screen.getByPlaceholderText('Please type in the report code...');
    const button = screen.getByRole('button', {name: 'Search'});

    await user.type(input, '   ');
    await user.click(button);

    expect(screen.queryByText(/Report Table:/)).not.toBeInTheDocument();
  });

  test('updates table when new report code is searched', async () => {
    const user = userEvent.setup();
    render(<SynReportsSearchPanel />);

    const input = screen.getByPlaceholderText('Please type in the report code...');
    const button = screen.getByRole('button', {name: 'Search'});

    await user.type(input, 'REPORT_A');
    await user.click(button);

    expect(screen.getByText('Report Table: REPORT_A')).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'REPORT_B');
    await user.click(button);

    expect(screen.getByText('Report Table: REPORT_B')).toBeInTheDocument();
  });
});
