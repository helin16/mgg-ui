import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {SelectBoxKey, SelectBoxTestId} from '../../../components/common/__mocks__/SelectBox';
import SynLuAbsenceTypeSelector, {
  translateSynLuAbsenceTypeToOption,
} from '../../../components/Absence/SynLuAbsenceTypeSelector';
import SynLuAbsenceTypeService from '../../../services/Synergetic/Lookup/SynLuAbsenceTypeService';
import Toaster from '../../../services/Toaster';

jest.mock('../../../components/common/SelectBox');
jest.mock('../../../services/Synergetic/Lookup/SynLuAbsenceTypeService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('SynLuAbsenceTypeSelector', () => {
  ComponentTestHelper.prepare();

  const mockedService = SynLuAbsenceTypeService as jest.Mocked<typeof SynLuAbsenceTypeService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  test('translates a lookup record into a select option', () => {
    const option = translateSynLuAbsenceTypeToOption({
      Code: 'ILL',
      Description: 'Illness',
    } as any);

    expect(option.value).toBe('ILL');
    expect(option.data.Description).toBe('Illness');
  });

  test('loads options and maps selected string values', async () => {
    mockedService.getAll.mockResolvedValue([
      {Code: 'ILL', Description: 'Illness', ActiveFlag: true},
    ] as any);
    const onSelect = jest.fn();

    render(
      <SynLuAbsenceTypeSelector
        values={['ILL']}
        absenceTypeCodes={['ILL']}
        allowClear
        onSelect={onSelect}
      />
    );

    expect(await screen.findByTestId(SelectBoxTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(SelectBoxKey)[0]).toMatchObject({
      isClearable: true,
      value: [expect.objectContaining({value: 'ILL'})],
    });

    await userEvent.click(screen.getByRole('button', {name: 'Select First Option'}));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({value: 'ILL'}));
  });

  test('shows api errors when the lookup request fails', async () => {
    const error = new Error('Type lookup failed');
    mockedService.getAll.mockRejectedValue(error);

    render(<SynLuAbsenceTypeSelector />);

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));
  });
});
