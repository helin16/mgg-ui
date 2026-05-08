import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import AdminPage from '../../layouts/AdminPage';

jest.mock('../../components/module/ModuleAccessWrapper', () => {
  return function MockModuleAccessWrapper(props: any) {
    return <div>{props.children}{props.btns}</div>;
  };
});

describe('AdminPage', () => {
  test('renders title, children and back buttons', () => {
    const view = renderToStaticMarkup(
      <AdminPage title="Admin" moduleId={1} onNavBack={() => null}>
        <div>Admin Body</div>
      </AdminPage>
    );

    expect(view).toContain('Admin');
    expect(view).toContain('Admin Body');
    expect(view).toContain('Back');
  });
});
