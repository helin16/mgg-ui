import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BulkUpdateModal from '../../../components/staff/components/BulkUpdateModal';
import SynCommunitySkillService from '../../../services/Synergetic/Community/SynCommunitySkillService';
import Toaster, {TOAST_TYPE_SUCCESS, TOAST_TYPE_WARNING} from '../../../services/Toaster';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {SynLuSkillSelectorOption} from '../../../components/Community/__mocks__/SynLuSkillSelector';

jest.mock('../../../components/common/PopupModal');
jest.mock('../../../components/common/LoadingBtn');
jest.mock('../../../components/Community/SynLuSkillSelector');
jest.mock('../../../services/Toaster');
jest.mock('../../../services/Synergetic/Community/SynCommunitySkillService', () => ({
  __esModule: true,
  default: {
    bulkUpdateSkillExpiryDate: jest.fn(),
  },
}));

describe('BulkUpdateModal', () => {
  ComponentTestHelper.prepare();

  const mockedService = SynCommunitySkillService as jest.Mocked<typeof SynCommunitySkillService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  const handleClose = jest.fn();
  const onSuccess = jest.fn();

  const renderModal = (selectedStaffIds = [45, 67]) => {
    render(
      <BulkUpdateModal
        selectedStaffIds={selectedStaffIds}
        isShowing
        handleClose={handleClose}
        onSuccess={onSuccess}
      />
    );
  };

  const selectSkillAndDate = async (dateValue = '2027-08-19') => {
    await userEvent.click(screen.getByRole('button', {name: 'Select Skill'}));
    const dateInput = screen.getByLabelText(/New Expiration Date/) as HTMLInputElement;
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, dateValue);
  };

  const submit = async () => {
    await userEvent.click(screen.getByRole('button', {name: /Submit/i}));
  };

  it('shows validation errors and does not call the service when skill/date are missing', async () => {
    renderModal();

    await submit();

    expect(await screen.findByText('Skill is required.')).toBeInTheDocument();
    expect(screen.getByText('Expiration date is required.')).toBeInTheDocument();
    expect(mockedService.bulkUpdateSkillExpiryDate).not.toHaveBeenCalled();
  });

  it('bulk-updates all selected staff and shows a success toast on full success', async () => {
    mockedService.bulkUpdateSkillExpiryDate.mockResolvedValueOnce([
      {status: 'fulfilled', value: {} as any},
      {status: 'fulfilled', value: {} as any},
    ]);
    renderModal([45, 67]);

    await selectSkillAndDate('2027-08-19');
    await submit();

    await waitFor(() => {
      expect(mockedService.bulkUpdateSkillExpiryDate).toHaveBeenCalledWith(
        [45, 67],
        SynLuSkillSelectorOption.value,
        '2027-08-19'
      );
    });
    expect(mockedToaster.showToast).toHaveBeenCalledWith('Updated 2 staff.', TOAST_TYPE_SUCCESS);
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows a warning toast on partial failure but still refreshes the list', async () => {
    mockedService.bulkUpdateSkillExpiryDate.mockResolvedValueOnce([
      {status: 'fulfilled', value: {} as any},
      {status: 'rejected', reason: new Error('boom')},
    ]);
    renderModal([45, 67]);

    await selectSkillAndDate('2027-08-19');
    await submit();

    await waitFor(() => {
      expect(mockedToaster.showToast).toHaveBeenCalledWith(
        'Updated 1 of 2 staff. 1 failed - please retry.',
        TOAST_TYPE_WARNING
      );
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows an API error toast and does not close on a hard failure, without calling onSuccess', async () => {
    mockedService.bulkUpdateSkillExpiryDate.mockRejectedValueOnce(new Error('network error'));
    renderModal([45, 67]);

    await selectSkillAndDate('2027-08-19');
    await submit();

    await waitFor(() => {
      expect(mockedToaster.showApiError).toHaveBeenCalled();
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('calls handleClose when Cancel is clicked', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', {name: /Cancel/i}));

    expect(handleClose).toHaveBeenCalled();
  });
});
