import React from 'react';
import ReactDOM from 'react-dom';

import LoadComponents from '../LoadComponents';

jest.mock('react-dom', () => ({
  __esModule: true,
  default: {
    render: jest.fn(),
  },
}));

jest.mock('../pages/OnlineDonation/OnlineDonation', () => ({
  __esModule: true,
  default: () => <div data-testid={'online-donation'} />,
}));

jest.mock('../components/Clipboard/ClipboardConcussionAlert', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={'clipboard-concussion-alert'} {...props} />,
}));

jest.mock('../components/Clipboard/ClipboardStudentSessionAlert', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={'clipboard-student-session-alert'} {...props} />,
}));

describe('LoadComponents', () => {
  const mockedReactDOM = ReactDOM as jest.Mocked<typeof ReactDOM>;
  const originalPathname = window.location.pathname;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    window.history.pushState({}, '', '/');
  });

  afterAll(() => {
    window.history.pushState({}, '', originalPathname || '/');
  });

  test('loads the online donation app into every matching root', () => {
    const firstRoot = document.createElement('div');
    const secondRoot = document.createElement('div');
    jest.spyOn(document, 'querySelectorAll').mockReturnValue([firstRoot, secondRoot] as any);

    LoadComponents.loadAll();

    expect(document.querySelectorAll).toHaveBeenCalledWith('[mgg-app-loader="online-donation"]');
    expect(mockedReactDOM.render).toHaveBeenCalledTimes(2);
    expect(mockedReactDOM.render).toHaveBeenNthCalledWith(1, expect.any(Object), firstRoot);
    expect(mockedReactDOM.render).toHaveBeenNthCalledWith(2, expect.any(Object), secondRoot);
  });

  test('wraps the loaded component in StrictMode with toast support', () => {
    const root = document.createElement('div');
    jest.spyOn(document, 'querySelectorAll').mockReturnValue([root] as any);

    LoadComponents.loadAll();

    const renderedElement = mockedReactDOM.render.mock.calls[0][0] as unknown as React.ReactElement;

    expect(renderedElement.type).toBe(React.StrictMode);
    expect(React.Children.toArray(renderedElement.props.children)).toHaveLength(2);
    expect(React.Children.toArray(renderedElement.props.children)[0]).toMatchObject({
      type: expect.any(Function),
    });
  });

  test('loads ClipboardConcussionAlert when URL matches attendance modify route', () => {
    document.body.innerHTML = `
      <div id="container">
        <div id="attendance-time-steps"></div>
        <div class="row" id="first-row"></div>
        <div class="row" id="second-row"></div>
      </div>
    `;
    window.history.pushState({}, '', '/modules/attendance/modify/S/PSY11A-26/2026-05-25/3/S/A');

    LoadComponents.loadStudentConussionAlertForAClassCode();

    const root = document.querySelector('#mgg-clipboard-concussion-alert-root');
    const firstRow = document.querySelector('#first-row');

    expect(root).toBeTruthy();
    expect(root?.previousElementSibling).toBe(firstRow);
    expect(mockedReactDOM.render).toHaveBeenCalledTimes(1);

    const renderedElement = mockedReactDOM.render.mock.calls[0][0] as unknown as React.ReactElement;
    expect(renderedElement.props).toMatchObject({
      classCode: 'PSY11A-26',
      currentDate: '2026-05-25',
      periodNumber: 3,
    });
  });

  test('loadAll triggers ClipboardConcussionAlert loading on matching attendance URL', () => {
    document.body.innerHTML = `
      <div id="container">
        <div id="attendance-time-steps"></div>
        <div class="row" id="first-row"></div>
      </div>
    `;
    window.history.pushState({}, '', '/modules/attendance/modify/S/PSY11A-26/2026-05-25/3/S/A');

    LoadComponents.loadAll();

    const renderedTargets = mockedReactDOM.render.mock.calls.map(call => call[1]);
    expect(renderedTargets).toContain(document.querySelector('#mgg-clipboard-concussion-alert-root'));
  });

  test('finds the first row even when it has multiple class names', () => {
    document.body.innerHTML = `
      <div id="container">
        <div id="attendance-time-steps"></div>
        <div class="row py-2 border-top" id="first-row"></div>
      </div>
    `;
    window.history.pushState({}, '', '/modules/attendance/modify/S/HIS11A-26/2026-05-11/3/S/A');

    LoadComponents.loadStudentConussionAlertForAClassCode();

    expect(document.querySelector('#mgg-clipboard-concussion-alert-root')).toBeTruthy();
    expect(mockedReactDOM.render).toHaveBeenCalledTimes(1);
  });

  test('normalizes periodNumber 0 to 1', () => {
    document.body.innerHTML = `
      <div id="container">
        <div id="attendance-time-steps"></div>
        <div class="row" id="first-row"></div>
      </div>
    `;
    window.history.pushState({}, '', '/modules/attendance/modify/S/HIS11A-26/2026-05-11/0/S/A');

    LoadComponents.loadStudentConussionAlertForAClassCode();

    const renderedElement = mockedReactDOM.render.mock.calls[0][0] as unknown as React.ReactElement;
    expect(renderedElement.props).toMatchObject({
      periodNumber: 1,
    });
  });

  test('keeps classCode unchanged when it does not start with campusCode prefix', () => {
    document.body.innerHTML = `
      <div id="container">
        <div id="attendance-time-steps"></div>
        <div class="row" id="first-row"></div>
      </div>
    `;
    window.history.pushState({}, '', '/modules/attendance/modify/HIS11A-26/2026-05-11/3/S/A');

    LoadComponents.loadStudentConussionAlertForAClassCode();

    const renderedElement = mockedReactDOM.render.mock.calls[0][0] as unknown as React.ReactElement;
    expect(renderedElement.props).toMatchObject({
      classCode: 'HIS11A-26',
    });
  });
});