import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {useSelector} from 'react-redux';
import ModuleAccessWrapper from '../../../components/module/ModuleAccessWrapper';
import AuthService from '../../../services/AuthService';
import MggsModuleService from '../../../services/Module/MggsModuleService';
import Toaster from '../../../services/Toaster';
import {Page401TestId} from '../../../components/__mocks__/Page401';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('../../../services/AuthService', () => ({
  __esModule: true,
  default: {canAccessModule: jest.fn()},
}));
jest.mock('../../../services/Module/MggsModuleService', () => ({
  __esModule: true,
  default: {getModule: jest.fn()},
}));
jest.mock('../../../services/Toaster');
jest.mock('../../../components/Page401');

const mockedUseSelector = useSelector as jest.Mock;
const mockedCanAccess = AuthService.canAccessModule as jest.Mock;
const mockedGetModule = MggsModuleService.getModule as jest.Mock;
const mockedShowApiError = Toaster.showApiError as jest.Mock;

const MODULE_ID = 6;
const CHILD = <div data-testid="module-screen">module screen</div>;

const setState = (isImpersonating: boolean) => {
  mockedUseSelector.mockImplementation((selector: any) =>
    selector({auth: {user: {id: 1}}, app: {isImpersonating}})
  );
};

const renderWrapper = (extra: Partial<React.ComponentProps<typeof ModuleAccessWrapper>> = {}) =>
  render(
    <ModuleAccessWrapper moduleId={MODULE_ID} {...extra}>
      {CHILD}
    </ModuleAccessWrapper>
  );

describe('ModuleAccessWrapper - impersonation block', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCanAccess.mockResolvedValue({'3': {canAccess: true}});
    mockedGetModule.mockResolvedValue({ModuleID: MODULE_ID, blockImpersonatedUser: false} as any);
    setState(false);
  });

  test('blockImpersonatedUser + impersonating -> Page401, module screen not rendered', async () => {
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: true} as any);
    setState(true);

    renderWrapper();

    expect(await screen.findByTestId(Page401TestId)).toBeInTheDocument();
    expect(screen.queryByTestId('module-screen')).not.toBeInTheDocument();
  });

  test('blockImpersonatedUser + NOT impersonating + role ok -> module screen', async () => {
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: true} as any);
    setState(false);

    renderWrapper();

    expect(await screen.findByTestId('module-screen')).toBeInTheDocument();
    expect(screen.queryByTestId(Page401TestId)).not.toBeInTheDocument();
  });

  test('no flag + impersonating + role ok -> module screen (impersonation has no effect)', async () => {
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: false} as any);
    setState(true);

    renderWrapper();

    expect(await screen.findByTestId('module-screen')).toBeInTheDocument();
  });

  test('impersonation deny honours silentMode -> renders nothing', async () => {
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: true} as any);
    setState(true);

    const {container} = renderWrapper({silentMode: true});

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  test('shows spinner until BOTH canAccess and getModule resolve', async () => {
    let resolveGet: (v: any) => void = () => undefined;
    mockedGetModule.mockReturnValue(new Promise(res => {
      resolveGet = res;
    }));
    setState(true);

    renderWrapper();

    expect(document.querySelector('.spinner-border')).toBeInTheDocument();
    expect(screen.queryByTestId('module-screen')).not.toBeInTheDocument();

    resolveGet({blockImpersonatedUser: false});
    expect(await screen.findByTestId('module-screen')).toBeInTheDocument();
  });

  test('getModule rejects -> fail open (module screen) + Toaster.showApiError', async () => {
    mockedGetModule.mockRejectedValue(new Error('boom'));
    setState(true); // even while impersonating, a read failure must not lock the user out

    renderWrapper();

    expect(await screen.findByTestId('module-screen')).toBeInTheDocument();
    expect(mockedShowApiError).toHaveBeenCalled();
  });

  test('impersonation state is taken from the Redux app slice, not window', async () => {
    // No window.schoolboxUser anywhere - the deny must come purely from the slice.
    delete (window as any).schoolboxUser;
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: true} as any);
    setState(true);

    renderWrapper();

    expect(await screen.findByTestId(Page401TestId)).toBeInTheDocument();
  });
});
