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

  test('blockImpersonatedUser + NOT impersonating + role ok -> module screen, no module fetch', async () => {
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: true} as any);
    setState(false);

    renderWrapper();

    expect(await screen.findByTestId('module-screen')).toBeInTheDocument();
    expect(screen.queryByTestId(Page401TestId)).not.toBeInTheDocument();
    // Not impersonating -> the module record is never fetched (no extra request on the hot path).
    expect(mockedGetModule).not.toHaveBeenCalled();
  });

  test('impersonating -> the module record IS fetched', async () => {
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: false} as any);
    setState(true);

    renderWrapper();

    expect(await screen.findByTestId('module-screen')).toBeInTheDocument();
    expect(mockedGetModule).toHaveBeenCalledWith(MODULE_ID);
  });

  test('no flag + impersonating + role ok -> module screen (impersonation has no effect)', async () => {
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: false} as any);
    setState(true);

    renderWrapper();

    expect(await screen.findByTestId('module-screen')).toBeInTheDocument();
  });

  test('impersonation deny ignores a content-bearing accessDenyPanel -> still Page401', async () => {
    // A caller (e.g. MyClassListPage) passes real module content as its deny panel for the
    // role check. The impersonation gate must not honour it.
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: true} as any);
    setState(true);

    renderWrapper({
      accessDenyPanel: <div data-testid="caller-deny-content">class list</div>,
    });

    expect(await screen.findByTestId(Page401TestId)).toBeInTheDocument();
    expect(screen.queryByTestId('caller-deny-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('module-screen')).not.toBeInTheDocument();
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

  test('re-shows the Spinner (no stale decision) when moduleId changes on a reused instance', async () => {
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: false} as any);
    setState(true);

    const {rerender} = render(
      <ModuleAccessWrapper moduleId={MODULE_ID}>{CHILD}</ModuleAccessWrapper>
    );
    expect(await screen.findByTestId('module-screen')).toBeInTheDocument();

    // Navigate to a different, blocked module at the same tree position.
    mockedGetModule.mockResolvedValue({blockImpersonatedUser: true} as any);
    rerender(<ModuleAccessWrapper moduleId={99}>{CHILD}</ModuleAccessWrapper>);

    // Must not briefly keep rendering the previous (allowed) module's content.
    await waitFor(() => expect(screen.queryByTestId('module-screen')).not.toBeInTheDocument());
    expect(await screen.findByTestId(Page401TestId)).toBeInTheDocument();
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
