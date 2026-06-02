import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import YearLevelSelector from '../../../components/student/YearLevelSelector';
import SynLuYearLevelService from '../../../services/Synergetic/Lookup/SynLuYearLevelService';

const mockSelectBox = jest.fn();

jest.mock('../../../components/common/SelectBox', () => ({
  __esModule: true,
  default: (props: any) => {
    mockSelectBox(props);
    return <div data-testid="SelectBox" />;
  },
}));

jest.mock('../../../services/Toaster', () => ({
  __esModule: true,
  default: {
    showApiError: jest.fn(),
  },
}));

jest.mock('../../../services/Synergetic/Lookup/SynLuYearLevelService', () => ({
  __esModule: true,
  default: {
    getAllYearLevels: jest.fn(),
  },
}));

describe('YearLevelSelector', () => {
  beforeEach(() => {
    mockSelectBox.mockClear();
    jest.clearAllMocks();
  });

  test('stops loading when the year level query returns no rows', async () => {
    (SynLuYearLevelService.getAllYearLevels as jest.Mock).mockResolvedValue([]);

    render(<YearLevelSelector campusCodes={['S']} />);

    await waitFor(() => expect(screen.getByTestId('SelectBox')).toBeInTheDocument());
    expect(SynLuYearLevelService.getAllYearLevels).toHaveBeenCalledTimes(1);
  });

  test('filters out excluded year levels from the options', async () => {
    (SynLuYearLevelService.getAllYearLevels as jest.Mock).mockResolvedValue([
      {Code: '10', Description: '10', YearLevelSort: 10},
      {Code: '11', Description: '11', YearLevelSort: 11},
    ]);

    render(<YearLevelSelector campusCodes={['S']} excludeCodes={['10']} />);

    await waitFor(() => expect(mockSelectBox).toHaveBeenCalled());

    const lastCallProps = mockSelectBox.mock.calls.at(-1)?.[0];
    expect(lastCallProps.options).toEqual([
      expect.objectContaining({value: '11', label: 'Year 11'}),
    ]);
  });
});
