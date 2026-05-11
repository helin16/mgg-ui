import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import ComponentTestHelper from '../helper/ComponentTestHelper';
import {
  SchoolBoxComponentKey,
  SchoolBoxComponentTestId,
} from '../../layouts/SchoolBox/__mocks__/SchoolBoxComponent';
import SchoolBoxLayout from '../../layouts/SchoolBoxLayout';
import {THIRD_PARTY_AUTH_PATH} from '../../helper/SchoolBoxHelper';

jest.mock('../../layouts/SchoolBox/SchoolBoxComponent');

describe('SchoolBoxLayout', () => {
  ComponentTestHelper.prepare();

  const renderLayout = (code: string) =>
    render(
      <MemoryRouter initialEntries={[`/modules/remote/${code}`]}>
        <Routes>
          <Route path="/modules/remote/:code" element={<SchoolBoxLayout />} />
        </Routes>
      </MemoryRouter>
    );

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('decodes the remote url and passes parsed params into SchoolBoxComponent', () => {
    const finalPath = '/finance';
    const encodedPath = btoa(finalPath);
    const remoteUrl =
      `https://schoolbox.example${THIRD_PARTY_AUTH_PATH}/${encodedPath}` +
      '?user=sb-user&id=12&time=34&key=secret';

    renderLayout(btoa(remoteUrl));

    expect(screen.getByTestId(SchoolBoxComponentTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(SchoolBoxComponentKey)[0]).toMatchObject({
      path: finalPath,
      remoteUrl,
      user: 'sb-user',
      id: '12',
      time: '34',
      sbKey: 'secret',
    });
  });

  test('prefers the mgg-root data-url over the route code when available', () => {
    const finalPath = '/my_student';
    const remoteUrl =
      `https://schoolbox.example${THIRD_PARTY_AUTH_PATH}/${btoa(finalPath)}` +
      '?user=root-user&id=99&time=11&key=root-key';
    const root = document.createElement('div');
    root.id = 'mgg-root';
    root.setAttribute('data-url', remoteUrl);
    document.body.appendChild(root);

    renderLayout(btoa('https://ignored.example'));

    expect(ComponentTestHelper.get(SchoolBoxComponentKey)[0]).toMatchObject({
      path: finalPath,
      remoteUrl,
      user: 'root-user',
      id: '99',
      time: '11',
      sbKey: 'root-key',
    });
  });

  test('shows a warning when the url cannot be parsed', () => {
    renderLayout(btoa('not a valid url'));

    expect(
      screen.getByText(/Error: can't get the url \(not a valid url\)\./)
    ).toBeInTheDocument();
  });
});
