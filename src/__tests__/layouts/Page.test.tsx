import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Page from '../../layouts/Page';

jest.mock('../../components/module/ModuleAdminBtn', () => {
  return function MockModuleAdminBtn() {
    return <button>Admin</button>;
  };
});

describe('Page', () => {
  test('renders title and children', () => {
    const view = renderToStaticMarkup(
      <Page title="Finance">
        <div>Child Content</div>
      </Page>
    );

    expect(view).toContain('Finance');
    expect(view).toContain('Child Content');
  });

  test('renders admin button when module and admin page exist', () => {
    const view = renderToStaticMarkup(
      <Page title="Finance" moduleId={1} AdminPage={() => <div>Admin View</div>} adminPageProps={{}}>
        <div>Child Content</div>
      </Page>
    );

    expect(view).toContain('Admin');
  });
});
