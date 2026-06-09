import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useSelector } from 'react-redux';
import SynergeticEmailTemplateList from '../../../../pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList';
import SynCommunicationTemplateService from '../../../../services/Synergetic/SynCommunicationTemplateService';
import EmailTemplateService from '../../../../services/Email/EmailTemplateService';
import Toaster from '../../../../services/Toaster';

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('../../../../services/Synergetic/SynCommunicationTemplateService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('../../../../services/Email/EmailTemplateService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn()
  }
}));

jest.mock('../../../../services/Toaster', () => ({
  __esModule: true,
  TOAST_TYPE_SUCCESS: 'success',
  default: {
    showToast: jest.fn(),
    showApiError: jest.fn()
  }
}));

jest.mock('../../../../components/common/PageLoadingSpinner', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>
}));

jest.mock('../../../../components/common/LoadingBtn', () => ({
  __esModule: true,
  default: ({ children, isLoading, disabled, onClick, ...props }: any) => (
    <button type="button" onClick={onClick} disabled={disabled || isLoading} {...props}>
      {children}
    </button>
  )
}));

jest.mock('../../../../components/common/PopupModal', () => ({
  __esModule: true,
  default: ({ show, title, header, children, footer }: any) => {
    if (!show) {
      return null;
    }
    return (
      <div>
        <div>{title || header}</div>
        <div>{children}</div>
        <div>{footer}</div>
      </div>
    );
  }
}));

jest.mock('../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn', () => ({
  __esModule: true,
  default: ({ children }: any) => <button type="button">{children}</button>
}));

jest.mock('../../../../pages/SynergeticEmailTemplate/components/SynEmailSendPopupBtn', () => ({
  __esModule: true,
  default: ({ children }: any) => <button type="button">{children}</button>
}));

jest.mock('../../../../pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateEditPanel', () => ({
  __esModule: true,
  default: () => <div>Editing Template</div>
}));

jest.mock('../../../../components/common/Table', () => ({
  __esModule: true,
  default: ({ columns, rows }: any) => (
    <table>
      <thead>
        <tr>
          {columns.map((column: any) => (
            typeof column.header === 'function'
              ? column.header(column)
              : <th key={column.key}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row: any, rowIndex: number) => (
          <tr key={row.CommunicationTemplatesSeq || rowIndex}>
            {columns.map((column: any) => column.cell(column, row))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}));

const baseTemplate = {
  CommunicationTemplatesSeq: 1,
  Name: 'Source Template',
  Description: 'Source Description',
  MessageType: 'HTML',
  MessageSubject: 'Source Subject',
  MessageBody: '<p>Hello source</p>',
  CreatedBy: 'User A',
  CreatedDate: '2026-06-01',
  ModifiedBy: 'User B',
  ModifiedDate: '2026-06-02',
  Owner: 'MGG\\tester',
  PrivateFlag: false,
  DocumentClassification: 'GENINFO',
  SenderEmail: 'noreply@example.com',
  ProgramName: 'Program',
};

const mockReduxState = {
  auth: {
    user: {
      SynCommunity: {
        NetworkLogin: 'tester'
      }
    }
  }
};

const renderComponent = () => {
  return render(<SynergeticEmailTemplateList />);
};

const mockListResponses = ({ emailTemplates = [] }: { emailTemplates?: any[] } = {}) => {
  (SynCommunicationTemplateService.getAll as jest.Mock).mockResolvedValue({
    data: [baseTemplate],
    total: 1,
    pages: 1,
    currentPage: 1
  });
  (EmailTemplateService.getAll as jest.Mock).mockResolvedValue({
    data: emailTemplates
  });
};

const openCloneModal = async () => {
  renderComponent();
  await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
  expect(await screen.findByRole('button', { name: 'Source Template' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /clone/i }));
  expect(screen.getByText('Clone Template')).toBeInTheDocument();
};

const createDeferred = () => {
  let resolve: (value?: any) => void = () => undefined;
  let reject: (reason?: any) => void = () => undefined;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('SynergeticEmailTemplateList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockImplementation((selector) => selector(mockReduxState));
    mockListResponses();
  });

  test('renders Send, Clone, and Archive in order and clones a standard template', async () => {
    (SynCommunicationTemplateService.create as jest.Mock).mockResolvedValue({
      CommunicationTemplatesSeq: 99
    });

    const { container } = renderComponent();

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(await screen.findByRole('button', { name: 'Source Template' })).toBeInTheDocument();
    const operationsCell = container.querySelector('tbody tr td:last-child');
    expect(operationsCell?.textContent?.replace(/\s+/g, ' ').trim()).toContain('Send Clone Archive');

    fireEvent.click(screen.getByRole('button', { name: /clone/i }));
    fireEvent.change(screen.getByLabelText(/new template name/i), {
      target: { value: 'Cloned Template' }
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm clone/i }));

    await waitFor(() => expect(SynCommunicationTemplateService.create).toHaveBeenCalledWith({
      Name: 'Cloned Template',
      Description: 'Source Description',
      MessageType: 'HTML',
      MessageSubject: 'Source Subject',
      MessageBody: '<p>Hello source</p>',
      Owner: 'MGG\\tester',
      PrivateFlag: false,
      DocumentClassification: 'GENINFO',
      SenderEmail: 'noreply@example.com',
      ProgramName: 'Program'
    }));
    expect(EmailTemplateService.create).not.toHaveBeenCalled();
    expect(Toaster.showToast).toHaveBeenCalledWith('Template Cloned Successfully', 'success');
    await waitFor(() => expect(SynCommunicationTemplateService.getAll).toHaveBeenCalledTimes(2));
  });

  test('creates a new-style clone and copies templateObj when the source already has builder data', async () => {
    mockListResponses({
      emailTemplates: [
        {
          id: 'email-template-1',
          CommunicationTemplatesSeq: 1,
          templateObj: { rows: [{ id: 'source-design' }] }
        }
      ]
    });
    (SynCommunicationTemplateService.create as jest.Mock).mockResolvedValue({
      CommunicationTemplatesSeq: 77
    });
    (EmailTemplateService.create as jest.Mock).mockResolvedValue({
      id: 'email-template-77'
    });

    await openCloneModal();
    fireEvent.change(screen.getByLabelText(/new template name/i), {
      target: { value: 'Styled Clone' }
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm clone/i }));

    await waitFor(() => expect(EmailTemplateService.create).toHaveBeenCalledWith({
      CommunicationTemplatesSeq: 77,
      templateObj: { rows: [{ id: 'source-design' }] }
    }));
  });

  test('blocks whitespace-only clone names and shows a validation message', async () => {
    await openCloneModal();
    fireEvent.change(screen.getByLabelText(/new template name/i), {
      target: { value: '   ' }
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm clone/i }));

    expect(await screen.findByText('Template Name can NOT be empty.')).toBeInTheDocument();
    expect(SynCommunicationTemplateService.create).not.toHaveBeenCalled();
  });

  test('prevents duplicate submits while clone creation is in progress', async () => {
    const deferred = createDeferred();
    (SynCommunicationTemplateService.create as jest.Mock).mockReturnValue(deferred.promise);

    await openCloneModal();
    fireEvent.change(screen.getByLabelText(/new template name/i), {
      target: { value: 'Pending Clone' }
    });

    const confirmBtn = screen.getByRole('button', { name: /confirm clone/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => expect(SynCommunicationTemplateService.create).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button', { name: /confirm clone/i })).toBeDisabled();

    deferred.resolve({ CommunicationTemplatesSeq: 50 });
    await waitFor(() => expect(Toaster.showToast).toHaveBeenCalled());
  });

  test('keeps the modal open and reports errors when clone creation fails', async () => {
    (SynCommunicationTemplateService.create as jest.Mock).mockRejectedValue(new Error('Clone failed'));

    await openCloneModal();
    fireEvent.change(screen.getByLabelText(/new template name/i), {
      target: { value: 'Broken Clone' }
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm clone/i }));

    await waitFor(() => expect(Toaster.showApiError).toHaveBeenCalled());
    expect(screen.getByText('Clone Template')).toBeInTheDocument();
  });
});
