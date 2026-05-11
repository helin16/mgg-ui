import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {
  SchoolBoxDebugInfoKey,
  SchoolBoxDebugInfoTestId,
} from '../../../layouts/SchoolBox/__mocks__/SchoolBoxDebugInfo';
import {
  SchoolBoxRouterKey,
  SchoolBoxRouterTestId,
} from '../../../layouts/SchoolBox/__mocks__/SchoolBoxRouter';
import {SchoolBoxUrlCheckPopupTestId} from '../../../layouts/SchoolBox/__mocks__/SchoolBoxUrlCheckPopup';
import AuthService from '../../../services/AuthService';
import LocalStorageService from '../../../services/LocalStorageService';
import Toaster from '../../../services/Toaster';
import SchoolBoxComponent from '../../../layouts/SchoolBox/SchoolBoxComponent';
import {removedAuthentication, userAuthenticated} from '../../../redux/reduxers/auth.slice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('../../../layouts/SchoolBox/SchoolBoxDebugInfo');
jest.mock('../../../layouts/SchoolBox/SchoolBoxRouter');
jest.mock('../../../layouts/SchoolBox/SchoolBoxUrlCheckPopup');
jest.mock('../../../services/AuthService', () => ({
  __esModule: true,
  default: {
    authSchoolBox: jest.fn(),
  },
}));
jest.mock('../../../services/LocalStorageService', () => ({
  __esModule: true,
  default: {
    setToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('SchoolBoxComponent', () => {
  ComponentTestHelper.prepare();

  const dispatch = jest.fn();
  const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
  const mockedLocalStorageService = LocalStorageService as jest.Mocked<typeof LocalStorageService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(dispatch);
  });

  const renderComponent = (ui: React.ReactNode, entry = '/') =>
    render(<MemoryRouter initialEntries={[entry]}>{ui}</MemoryRouter>);

  test('shows an invalid params alert when required params are missing', async () => {
    renderComponent(<SchoolBoxComponent path="/finance" remoteUrl="https://sb" />, '/?id=1');

    expect(await screen.findByText('Invalid SchoolBox Params')).toBeInTheDocument();
    expect(mockedAuthService.authSchoolBox).not.toHaveBeenCalled();
  });

  test('authenticates and renders the child schoolbox content on success', async () => {
    mockedAuthService.authSchoolBox.mockResolvedValue({
      token: 'token-1',
      user: {synergyId: 12, Given1: 'Ada'},
    } as any);

    renderComponent(
      <SchoolBoxComponent
        path="/finance"
        remoteUrl="https://sb"
        id="12"
        user="schoolbox-user"
        time="45"
        sbKey="secret"
      />
    );

    await waitFor(() =>
      expect(screen.getByTestId(SchoolBoxDebugInfoTestId)).toBeInTheDocument()
    );

    expect(screen.getByTestId(SchoolBoxRouterTestId)).toBeInTheDocument();
    expect(screen.getByTestId(SchoolBoxUrlCheckPopupTestId)).toBeInTheDocument();
    expect(mockedAuthService.authSchoolBox).toHaveBeenCalledWith(
      '12',
      'schoolbox-user',
      45,
      'secret'
    );
    expect(mockedLocalStorageService.setToken).toHaveBeenCalledWith('token-1');
    expect(dispatch).toHaveBeenCalledWith(
      userAuthenticated({user: {synergyId: 12, Given1: 'Ada'}})
    );
    expect(ComponentTestHelper.get(SchoolBoxDebugInfoKey)[0]).toMatchObject({
      path: '/finance',
      remoteUrl: 'https://sb',
    });
    expect(ComponentTestHelper.get(SchoolBoxRouterKey)[0]).toMatchObject({
      path: '/finance',
      remoteUrl: 'https://sb',
    });
  });

  test('clears auth and shows an api error when authentication fails', async () => {
    const error = new Error('boom');
    mockedAuthService.authSchoolBox.mockRejectedValue(error);

    renderComponent(
      <SchoolBoxComponent
        path="/finance"
        remoteUrl="https://sb"
        id="12"
        user="schoolbox-user"
        time="45"
        sbKey="secret"
      />
    );

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));

    expect(mockedLocalStorageService.removeToken).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(removedAuthentication());
    expect(screen.getByTestId(SchoolBoxRouterTestId)).toBeInTheDocument();
    expect(mockedLocalStorageService.setToken).not.toHaveBeenCalled();
  });
});
