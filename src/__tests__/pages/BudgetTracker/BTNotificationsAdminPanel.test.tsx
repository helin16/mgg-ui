import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BTNotificationsAdminPanel from '../../../pages/BudgetTracker/components/admin/BTNotificationsAdminPanel';

jest.mock('../../../components/common/PageLoadingSpinner', () => {
  return function MockPageLoadingSpinner() {
    return <div>Loading...</div>;
  };
});

jest.mock('../../../components/ExplanationPanel', () => {
  return function MockExplanationPanel(props: any) {
    return <div>{props.text}</div>;
  };
});

jest.mock('../../../components/module/ModuleEmailTemplateNameEditor', () => {
  return function MockModuleEmailTemplateNameEditor(props: any) {
    return <div>Editor:{props.value}</div>;
  };
});

jest.mock('../../../components/common/LoadingBtn', () => {
  return function MockLoadingBtn(props: any) {
    return <button>{props.children}</button>;
  };
});

describe('BTNotificationsAdminPanel', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders notification editors when module state is available', () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [
        {
          ModuleID: 'budget_tracker',
          settings: {
            emailTemplateName: {
              itemRequested: 'requested-template',
              itemApproved: 'approved-template',
              itemDeclined: 'declined-template',
            },
          },
        },
        jest.fn(),
      ] as any)
      .mockImplementationOnce(() => [false, jest.fn()] as any)
      .mockImplementationOnce(() => [false, jest.fn()] as any);

    const view = renderToStaticMarkup(<BTNotificationsAdminPanel />);

    expect(view).toContain('following are a list of notification emails');
    expect(view).toContain('Emails when new Budget Item requested:');
    expect(view).toContain('Emails when new Budget Item <span class="text-success">approved</span>:');
    expect(view).toContain('Emails when new Budget Item <span class="text-danger">declined</span>:');
    expect(view).toContain('Editor:requested-template');
    expect(view).toContain('Editor:approved-template');
    expect(view).toContain('Editor:declined-template');
    expect(view).toContain('Save');
  });
});
