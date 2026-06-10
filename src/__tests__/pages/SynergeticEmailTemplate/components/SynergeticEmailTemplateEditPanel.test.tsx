import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SynergeticEmailTemplateEditPanel from '../../../../pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateEditPanel';
import SynCommunicationTemplateService from '../../../../services/Synergetic/SynCommunicationTemplateService';
import EmailTemplateService from '../../../../services/Email/EmailTemplateService';

jest.mock('../../../../services/Synergetic/SynCommunicationTemplateService', () => ({
  __esModule: true,
  default: {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('../../../../services/Email/EmailTemplateService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('../../../../services/Toaster', () => ({
  __esModule: true,
  TOAST_TYPE_ERROR: 'error',
  TOAST_TYPE_SUCCESS: 'success',
  default: {
    showToast: jest.fn(),
    showApiError: jest.fn()
  }
}));

jest.mock('../../../../components/common/LoadingBtn', () => ({
  __esModule: true,
  default: ({ children, isLoading, disabled, onClick, ...props }: any) => (
    <button type="button" onClick={onClick} disabled={disabled || isLoading} {...props}>
      {children}
    </button>
  )
}));

jest.mock('../../../../components/common/RichTextEditor/RichTextEditor', () => ({
  __esModule: true,
  default: () => <div>Rich Text Editor</div>
}));

jest.mock('../../../../components/Email/EmailTemplateBuilder', () => ({
  __esModule: true,
  default: () => <div>Email Template Builder</div>
}));

jest.mock('../../../../components/ExplanationPanel', () => ({
  __esModule: true,
  default: ({ text }: any) => <div>{text}</div>
}));

jest.mock('../../../../components/common/PageLoadingSpinner', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>
}));

jest.mock('../../../../pages/SynergeticEmailTemplate/components/SynEmailSendPopupBtn', () => ({
  __esModule: true,
  default: ({ children }: any) => <button type="button">{children}</button>
}));

const existingTemplate = {
  CommunicationTemplatesSeq: 1,
  Name: 'Updated e-News test',
  Description: 'Description',
  MessageSubject: 'Updating',
  MessageBody: '<p>Hello</p>'
};

const renderComponent = (props: Partial<React.ComponentProps<typeof SynergeticEmailTemplateEditPanel>> = {}) => {
  return render(
    <SynergeticEmailTemplateEditPanel
      template={props.template}
      onSaved={props.onSaved || jest.fn()}
      onCancel={props.onCancel || jest.fn()}
      showEditBtnsOnTop={props.showEditBtnsOnTop}
    />
  );
};

describe('SynergeticEmailTemplateEditPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SynCommunicationTemplateService.getById as jest.Mock).mockResolvedValue(existingTemplate);
    (EmailTemplateService.getAll as jest.Mock).mockResolvedValue({ data: [] });
  });

  test('renders Send before Cancel for existing templates on the details page', async () => {
    const { container } = renderComponent({
      template: existingTemplate,
      showEditBtnsOnTop: true
    });

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    const buttonTexts = Array.from(container.querySelectorAll('button')).map(button =>
      button.textContent?.replace(/\s+/g, ' ').trim()
    );

    expect(buttonTexts).toEqual([
      'Send',
      'Cancel',
      'Save',
      'Send',
      'Cancel',
      'Save'
    ]);
  });

  test('does not render Send while creating a new template', () => {
    const { container } = renderComponent({
      template: undefined,
      showEditBtnsOnTop: false
    });

    const buttonTexts = Array.from(container.querySelectorAll('button')).map(button =>
      button.textContent?.replace(/\s+/g, ' ').trim()
    );

    expect(buttonTexts).toEqual(['Cancel', 'Save']);
    expect(screen.queryByRole('button', { name: 'Send' })).not.toBeInTheDocument();
  });
});
