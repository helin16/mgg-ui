import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentClassificationSearchPanel
  from '../../../../pages/SynergeticUserPermissions/components/DocumentClassificationSearchPanel';
import * as DocumentClassificationPermissionsTableModule
  from '../../../../pages/SynergeticUserPermissions/components/DocumentClassificationPermissionsTable';
import iSynLuDocumentClassification
  from '../../../../types/Synergetic/Lookup/iSynLuDocumentClassification';

jest.mock(
  '../../../../pages/SynergeticUserPermissions/components/DocumentClassificationPermissionsTable',
  () => ({
    __esModule: true,
    default: ({classificationCode}: any) => <div>Classification Table: {classificationCode}</div>,
  })
);

const classification = (Code: string, Description: string): iSynLuDocumentClassification => ({
  Code,
  Description,
  SynergyMeaning: '',
  SecurityMeaning: '',
  ActiveFlag: true,
  DescriptionStyle: '',
  CommPortalVisibleForStudentParentFlag: false,
  CommPortalVisibleForStudentLivesWithFlag: false,
  CommPortalVisibleForStudentReportsFlag: false,
  CommPortalVisibleForSelfFlag: false,
  CommPortalVisibleForSpouseFlag: false,
  ModifiedDate: '',
  ModifiedUser: '',
  SetCentrallyFlag: null,
});

describe('DocumentClassificationSearchPanel', () => {
  const classifications = [
    classification('REPORTS', 'Student Reports'),
    classification('MEDICAL', 'Medical Documents'),
    classification('FINANCE', 'Finance Documents'),
  ];

  test('renders dropdown with all classifications', () => {
    render(
      <DocumentClassificationSearchPanel
        classifications={classifications}
      />
    );

    const dropdown = screen.getByDisplayValue('-- Please select a classification --');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText('REPORTS - Student Reports')).toBeInTheDocument();
    expect(screen.getByText('MEDICAL - Medical Documents')).toBeInTheDocument();
    expect(screen.getByText('FINANCE - Finance Documents')).toBeInTheDocument();
  });

  test('does not show table initially', () => {
    render(
      <DocumentClassificationSearchPanel
        classifications={classifications}
      />
    );

    expect(screen.queryByText(/Classification Table:/)).not.toBeInTheDocument();
  });

  test('shows table when classification is selected', async () => {
    const user = userEvent.setup();
    render(
      <DocumentClassificationSearchPanel
        classifications={classifications}
      />
    );

    const dropdown = screen.getByDisplayValue('-- Please select a classification --');
    await user.selectOption(dropdown, 'REPORTS');

    expect(screen.getByText('Classification Table: REPORTS')).toBeInTheDocument();
  });

  test('changes table when different classification is selected', async () => {
    const user = userEvent.setup();
    render(
      <DocumentClassificationSearchPanel
        classifications={classifications}
      />
    );

    const dropdown = screen.getByRole('combobox');
    await user.selectOption(dropdown, 'REPORTS');
    expect(screen.getByText('Classification Table: REPORTS')).toBeInTheDocument();

    await user.selectOption(dropdown, 'MEDICAL');
    expect(screen.getByText('Classification Table: MEDICAL')).toBeInTheDocument();
  });

  test('passes excludedUserIds to table component', async () => {
    const user = userEvent.setup();
    const excludedIds = [1, 2, 3];
    const spy = jest.spyOn(DocumentClassificationPermissionsTableModule, 'default');

    render(
      <DocumentClassificationSearchPanel
        classifications={classifications}
        excludedUserIds={excludedIds}
      />
    );

    const dropdown = screen.getByRole('combobox');
    await user.selectOption(dropdown, 'REPORTS');

    expect(spy).toHaveBeenCalledWith(
      {classificationCode: 'REPORTS', excludedUserIds: excludedIds},
      {}
    );

    spy.mockRestore();
  });

  test('hides table when dropdown is cleared', async () => {
    const user = userEvent.setup();
    render(
      <DocumentClassificationSearchPanel
        classifications={classifications}
      />
    );

    const dropdown = screen.getByRole('combobox');
    await user.selectOption(dropdown, 'REPORTS');
    expect(screen.getByText('Classification Table: REPORTS')).toBeInTheDocument();

    await user.selectOption(dropdown, '');
    expect(screen.queryByText(/Classification Table:/)).not.toBeInTheDocument();
  });
});
