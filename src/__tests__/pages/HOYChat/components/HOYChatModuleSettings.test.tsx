import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HOYChatModuleSettings from '../../../../pages/HOYChat/components/HOYChatModuleSettings';

let mockFakeModule: any;
let mockLatestSubmitData: any;

jest.mock('../../../../components/module/ModuleEditPanel', () => ({
  __esModule: true,
  default: ({getChildren, getSubmitData}: any) => (
    <div>
      {getChildren(mockFakeModule)}
      <button type="button" onClick={() => { mockLatestSubmitData = getSubmitData(); }}>
        Capture Submit Data
      </button>
    </div>
  ),
}));

jest.mock('../../../../components/Email/EmailTemplateBuilder', () => ({
  __esModule: true,
  default: ({onUpdated}: any) => (
    <button type="button" onClick={() => onUpdated({
      exportHtml: (callback: any) => callback({design: {updated: true}, html: '<p>Updated</p>'}),
    })}>Update email template</button>
  ),
}));

const capture = async () => {
  fireEvent.click(screen.getByRole('button', {name: 'Capture Submit Data'}));
  await waitFor(() => expect(mockLatestSubmitData).toBeDefined());
};

describe('HOYChatModuleSettings', () => {
  beforeEach(() => {
    mockLatestSubmitData = undefined;
    mockFakeModule = {
      settings: {
        unknownRoot: 'keep-root',
        contactReasons: ['Pastoral care'],
        notification: {
          replyTo: 'legacy@example.com', cc: 'extra@example.com',
          subject: 'Existing subject', bodyDesign: {existing: true},
          html: '<p>Existing</p>', unknownNested: 'keep-nested',
        },
      },
    };
  });

  test('shows accurate addressing guidance and no Reply To control', () => {
    render(<HOYChatModuleSettings />);
    expect(screen.getByText(/student is automatically copied/i)).toBeInTheDocument();
    expect(screen.getByText(/student.*reply-to/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox', {name: /reply to/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', {name: /copy to/i})).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /contact reason/i})).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /subject/i})).toBeInTheDocument();
  });

  test('keeps remaining controls keyboard-accessible at narrow width', async () => {
    Object.defineProperty(window, 'innerWidth', {configurable: true, value: 375});
    window.dispatchEvent(new Event('resize'));
    render(<HOYChatModuleSettings />);
    const user = userEvent.setup();

    await user.tab();
    expect(screen.getByRole('textbox', {name: /contact reason/i})).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('textbox', {name: /subject/i})).toHaveFocus();
  });

  test('sanitizes legacy settings before a no-edit save while preserving siblings', async () => {
    render(<HOYChatModuleSettings />);
    await capture();
    expect(mockLatestSubmitData).toEqual({
      unknownRoot: 'keep-root', contactReasons: ['Pastoral care'],
      notification: {
        subject: 'Existing subject',
        bodyDesign: {existing: true}, html: '<p>Existing</p>',
        unknownNested: 'keep-nested',
      },
    });
    expect(mockFakeModule.settings.notification.replyTo).toBe('legacy@example.com');
  });

  test('supports empty settings', async () => {
    mockFakeModule = {settings: {}};
    render(<HOYChatModuleSettings />);
    await capture();
    expect(mockLatestSubmitData).toEqual({
      contactReasons: [], notification: {subject: '', bodyDesign: {}, html: ''},
    });
  });

  test('persists contact reasons, subject, and generated email content', async () => {
    render(<HOYChatModuleSettings />);
    fireEvent.change(screen.getByRole('textbox', {name: /contact reason/i}), {
      target: {value: ' First reason \n\nSecond reason '},
    });
    fireEvent.change(screen.getByRole('textbox', {name: /subject/i}), {target: {value: 'Updated subject'}});
    fireEvent.click(screen.getByRole('button', {name: 'Update email template'}));
    await capture();
    expect(mockLatestSubmitData).toEqual(expect.objectContaining({
      unknownRoot: 'keep-root', contactReasons: ['First reason', 'Second reason'],
      notification: expect.objectContaining({
        unknownNested: 'keep-nested', subject: 'Updated subject',
        bodyDesign: {updated: true}, html: '<p>Updated</p>',
      }),
    }));
    expect(mockLatestSubmitData.notification).not.toHaveProperty('replyTo');
  });

  test('retains edits across a failed-save rerender and refreshes after a successful reload', async () => {
    const view = render(<HOYChatModuleSettings />);
    const subject = screen.getByRole('textbox', {name: /subject/i});
    fireEvent.change(subject, {target: {value: 'Retry subject'}});

    view.rerender(<HOYChatModuleSettings />);
    expect(screen.getByRole('textbox', {name: /subject/i})).toHaveValue('Retry subject');

    mockFakeModule = {
      settings: {
        ...mockFakeModule.settings,
        notification: {...mockFakeModule.settings.notification, subject: 'Saved subject'},
      },
    };
    view.rerender(<HOYChatModuleSettings />);
    await waitFor(() => expect(screen.getByRole('textbox', {name: /subject/i})).toHaveValue('Saved subject'));
  });
});
