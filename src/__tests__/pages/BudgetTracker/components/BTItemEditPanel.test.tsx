import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useSelector} from 'react-redux';
import {
  BTItemCategorySelectorOption,
  BTItemCategorySelectorTestId,
} from '../../../../pages/BudgetTracker/components/__mocks__/BTItemCategorySelector';
import BTItemEditPanel from '../../../../pages/BudgetTracker/components/BTItemEditPanel';
import BTItemService from '../../../../services/BudgetTracker/BTItemService';
import AuthService from '../../../../services/AuthService';
import SynCommunityService from '../../../../services/Synergetic/Community/SynCommunityService';
import Toaster from '../../../../services/Toaster';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('../../../../pages/BudgetTracker/components/BTItemCategorySelector');
jest.mock('../../../../services/BudgetTracker/BTItemService', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    update: jest.fn(),
    getBTItemStatusNameFromItem: jest.fn(() => 'new'),
  },
}));
jest.mock('../../../../services/AuthService', () => ({
  __esModule: true,
  default: {
    isModuleRole: jest.fn(),
  },
}));
jest.mock('../../../../services/Synergetic/Community/SynCommunityService', () => ({
  __esModule: true,
  default: {
    getCommunityProfiles: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('BTItemEditPanel', () => {
  const mockedUseSelector = useSelector as jest.Mock;
  const mockedBTItemService = BTItemService as jest.Mocked<typeof BTItemService>;
  const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
  const mockedSynCommunityService = SynCommunityService as jest.Mocked<typeof SynCommunityService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  const renderPanel = () =>
    render(
      <BTItemEditPanel
        gl={{GLCode: '1000'} as any}
        forYear={2026}
        onItemSaved={jest.fn()}
        onCancel={jest.fn()}
      />
    );

  beforeEach(() => {
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({auth: {user: {synergyId: 11}}})
    );
    mockedBTItemService.create.mockResolvedValue({id: 1} as any);
    mockedAuthService.isModuleRole.mockResolvedValue(false as any);
    mockedSynCommunityService.getCommunityProfiles.mockResolvedValue({data: []} as any);
  });

  test('shows validation errors and does not submit when required fields are missing', async () => {
    renderPanel();

    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    expect(await screen.findByText('Category is required.')).toBeInTheDocument();
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Reason is required.')).toBeInTheDocument();
    expect(mockedBTItemService.create).not.toHaveBeenCalled();
  });

  test('creates a new item with the selected category and year', async () => {
    const onItemSaved = jest.fn();
    render(
      <BTItemEditPanel
        gl={{GLCode: '1000'} as any}
        forYear={2026}
        onItemSaved={onItemSaved}
        onCancel={jest.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button', {name: 'Select Category'}));
    expect(screen.getByTestId(BTItemCategorySelectorTestId)).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('The name of the budget item...'), 'New laptop');
    await userEvent.type(screen.getByPlaceholderText('The reason for this budget item'), 'Classroom rollout');
    const textboxes = screen.getAllByRole('textbox');
    await userEvent.clear(textboxes[2]);
    await userEvent.type(textboxes[2], '2');
    await userEvent.clear(textboxes[3]);
    await userEvent.type(textboxes[3], '1200');
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    await waitFor(() =>
      expect(mockedBTItemService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          budget_item_category_guid: BTItemCategorySelectorOption.data.guid,
          gl_code: BTItemCategorySelectorOption.data.destination_gl_code,
          name: 'New laptop',
          description: 'Classroom rollout',
          item_quantity: '02',
          item_cost: '01200',
          year: 2026,
        })
      )
    );
    expect(mockedToaster.showToast).toHaveBeenCalled();
    expect(onItemSaved).toHaveBeenCalledWith({id: 1});
  });
});
