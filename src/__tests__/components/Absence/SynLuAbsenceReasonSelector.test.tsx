import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {SelectBoxKey, SelectBoxTestId} from '../../../components/common/__mocks__/SelectBox';
import SynLuAbsenceReasonSelector, {
  translateSynLuAbsenceReasonToOption,
} from '../../../components/Absence/SynLuAbsenceReasonSelector';
import SynLuAbsenceReasonService from '../../../services/Synergetic/Lookup/SynLuAbsenceReasonService';
import Toaster from '../../../services/Toaster';

jest.mock('../../../components/common/SelectBox');
jest.mock('../../../services/Synergetic/Lookup/SynLuAbsenceReasonService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('SynLuAbsenceReasonSelector', () => {
  ComponentTestHelper.prepare();

  const mockedService = SynLuAbsenceReasonService as jest.Mocked<typeof SynLuAbsenceReasonService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  test('translates a lookup record into a select option', () => {
    const option = translateSynLuAbsenceReasonToOption({
      Code: 'MED',
      Description: 'Medical',
      AbsenceTypeCode: 'ILL',
    } as any);

    expect(option.value).toBe('MED');
    expect(option.data.Code).toBe('MED');
  });

  test('loads options and maps string values back to select options', async () => {
    mockedService.getAll.mockResolvedValue([
      {Code: 'MED', Description: 'Medical', AbsenceTypeCode: 'ILL', ActiveFlag: true},
    ] as any);
    const onSelect = jest.fn();

    render(
      <SynLuAbsenceReasonSelector
        values={['MED']}
        absenceTypeCodes={['ILL']}
        allowClear
        onSelect={onSelect}
      />
    );

    expect(await screen.findByTestId(SelectBoxTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(SelectBoxKey)[0]).toMatchObject({
      isClearable: true,
      value: [expect.objectContaining({value: 'MED'})],
    });

    await userEvent.click(screen.getByRole('button', {name: 'Select First Option'}));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({value: 'MED'}));
  });

  test('shows api errors when the lookup request fails', async () => {
    const error = new Error('Lookup failed');
    mockedService.getAll.mockRejectedValue(error);

    render(<SynLuAbsenceReasonSelector />);

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));
  });
});
