import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import StudentAbsenceDailySummaryEmailModal from '../../../../pages/studentAbsences/components/StudentAbsenceDailySummaryEmailModal';
import { LoadingBtnTestId } from '../../../../components/common/__mocks__/LoadingBtn';
import { PopupModalTestId } from '../../../../components/common/__mocks__/PopupModal';

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/common/LoadingBtn');

const renderModal = (props: Partial<React.ComponentProps<typeof StudentAbsenceDailySummaryEmailModal>> = {}) => {
  const onSend = jest.fn().mockResolvedValue(undefined);
  const onClose = jest.fn();
  render(
    <StudentAbsenceDailySummaryEmailModal
      show={true}
      isSending={false}
      onClose={onClose}
      onSend={onSend}
      {...props}
    />
  );
  return { onSend, onClose };
};

describe('StudentAbsenceDailySummaryEmailModal', () => {
  test('renders the modal when show=true', () => {
    renderModal();
    expect(screen.getByTestId(PopupModalTestId)).toBeInTheDocument();
  });

  test('does not render the modal when show=false', () => {
    renderModal({ show: false });
    expect(screen.queryByTestId(PopupModalTestId)).not.toBeInTheDocument();
  });

  test('shows Email Addresses label with a required asterisk', () => {
    renderModal();
    expect(screen.getByText('Email Addresses')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('shows helper text "Separated with ;"', () => {
    renderModal();
    expect(screen.getByText('Separated with ;')).toBeInTheDocument();
  });

  test('shows optional Email Body textarea', () => {
    renderModal();
    expect(screen.getByText('Email Body')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Optional message to include in the email body')).toBeInTheDocument();
  });

  test('Send button is disabled when email addresses field is empty', () => {
    renderModal();
    const sendBtn = screen.getByTestId(LoadingBtnTestId);
    expect(sendBtn).toBeDisabled();
  });

  test('Send button is disabled when input contains only invalid email addresses', () => {
    renderModal();
    const emailInput = screen.getByPlaceholderText('email1@example.com; email2@example.com');
    fireEvent.change(emailInput, { target: { value: 'not-an-email; also-bad' } });
    expect(screen.getByTestId(LoadingBtnTestId)).toBeDisabled();
  });

  test('Send button becomes enabled when at least one valid email is entered', () => {
    renderModal();
    const emailInput = screen.getByPlaceholderText('email1@example.com; email2@example.com');
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(screen.getByTestId(LoadingBtnTestId)).not.toBeDisabled();
  });

  test('Send button is enabled when one valid email is among invalid ones', () => {
    renderModal();
    const emailInput = screen.getByPlaceholderText('email1@example.com; email2@example.com');
    fireEvent.change(emailInput, { target: { value: 'bad-email; valid@example.com' } });
    expect(screen.getByTestId(LoadingBtnTestId)).not.toBeDisabled();
  });

  test('calls onSend with recipientEmails and empty emailBody when body is not filled', async () => {
    const { onSend } = renderModal();
    const emailInput = screen.getByPlaceholderText('email1@example.com; email2@example.com');
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.click(screen.getByTestId(LoadingBtnTestId));
    expect(onSend).toHaveBeenCalledWith('user@example.com', '');
  });

  test('calls onSend with both recipientEmails and emailBody', async () => {
    const { onSend } = renderModal();
    const emailInput = screen.getByPlaceholderText('email1@example.com; email2@example.com');
    const bodyInput = screen.getByPlaceholderText('Optional message to include in the email body');
    fireEvent.change(emailInput, { target: { value: 'a@b.com; c@d.com' } });
    fireEvent.change(bodyInput, { target: { value: 'Please review the attached.' } });
    fireEvent.click(screen.getByTestId(LoadingBtnTestId));
    expect(onSend).toHaveBeenCalledWith('a@b.com; c@d.com', 'Please review the attached.');
  });

  test('calls onClose when Cancel is clicked', () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Send button is disabled when isSending=true regardless of valid emails', () => {
    renderModal({ isSending: true });
    // LoadingBtn mock disables on isLoading, not on disabled prop — the component
    // passes isLoading={isSending}, so the button should be disabled by the mock.
    const emailInput = screen.getByPlaceholderText('email1@example.com; email2@example.com');
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(screen.getByTestId(LoadingBtnTestId)).toBeDisabled();
  });
});
