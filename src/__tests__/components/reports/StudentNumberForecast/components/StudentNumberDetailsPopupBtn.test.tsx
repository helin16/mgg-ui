import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as XLSX from 'sheetjs-style';
import StudentNumberDetailsPopupBtn from '../../../../../components/reports/StudentNumberForecast/components/StudentNumberDetailsPopupBtn';
import SynLuYearLevelService from '../../../../../services/Synergetic/Lookup/SynLuYearLevelService';
import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';
import {TableKey} from '../../../../../components/common/__mocks__/Table';

jest.mock('../../../../../components/common/PopupModal');
jest.mock('../../../../../components/common/Table');
jest.mock('../../../../../services/Toaster');
jest.mock('../../../../../services/Synergetic/Lookup/SynLuYearLevelService', () => ({
  __esModule: true,
  default: {
    getAllYearLevels: jest.fn(() => Promise.resolve([])),
  },
}));

jest.mock('sheetjs-style', () => ({
  utils: {
    table_to_sheet: jest.fn(() => ({sheet: true})),
    sheet_to_json: jest.fn(() => []),
    aoa_to_sheet: jest.fn((rows) => ({rows})),
    book_new: jest.fn(() => ({workbook: true})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

describe('StudentNumberDetailsPopupBtn', () => {
  ComponentTestHelper.prepare();

  const mockedXlsx = XLSX as jest.Mocked<typeof XLSX>;
  const mockedYearLevelService = SynLuYearLevelService as jest.Mocked<typeof SynLuYearLevelService>;

  const baseRecord: any = {
    StudentID: '1001',
    StudentGiven1: 'Ada',
    StudentSurname: 'Lovelace',
    StudentStatusDescription: 'Normal',
    StudentYearLevelDescription: 'Year 10',
    StudentForm: '10A',
    StudentEntryDate: '2026-01-01',
    StudentEntryYearLevel: '10',
    StudentPreviousSchool: '',
    StudentPreviousSchoolDescription: '',
    currentTotalFeeAmount: 100,
    tuitionFees: 80,
    consolidateFees: 20,
    currentConcessionFees: 10,
    currentSiblingDiscountFees: 0,
    currentConcessions: [
      {FeeCode: 'CONC_A', OverridePercentage: 10},
      {FeeCode: 'CONC_B', OverridePercentage: 5},
    ],
    currentSiblingDiscounts: [],
  };

  const openPopup = async (props: any = {}) => {
    mockedYearLevelService.getAllYearLevels.mockResolvedValue([]);

    render(
      <StudentNumberDetailsPopupBtn records={[baseRecord]} {...props}>
        Open
      </StudentNumberDetailsPopupBtn>
    );

    await userEvent.click(screen.getByRole('button', {name: /open/i}));

    await waitFor(() => {
      expect(ComponentTestHelper.get(TableKey).length).toBeGreaterThan(0);
    });

    expect(mockedYearLevelService.getAllYearLevels).toHaveBeenCalled();
  };

  test('does not show concession fee code columns in the popup table', async () => {
    // Non-finance view
    await openPopup({showingFinanceFigures: false});
    let tableProps = ComponentTestHelper.get(TableKey)[0];
    let headers = (tableProps?.columns || []).map((column: any) => column.header);
    expect(headers).not.toContain('Concession Fee Code');
    expect(headers).not.toContain('Concession Fee Code Description');
  });

  test('does not show concession fee code columns in finance view table either', async () => {
    await openPopup({
      showingFinanceFigures: true,
      feeNameMap: {CONC_A: 'Concession A', CONC_B: 'Concession B'},
    });

    const financeTableProps = ComponentTestHelper.get(TableKey)[0];
    const financeHeaders = (financeTableProps?.columns || []).map(
      (column: any) => column.header
    );
    expect(financeHeaders).not.toContain('Concession Fee Code');
    expect(financeHeaders).not.toContain('Concession Fee Code Description');
  });

  test('exports one row per concession in finance view only', async () => {
    await openPopup({
      showingFinanceFigures: true,
      feeNameMap: {CONC_A: 'Concession A', CONC_B: 'Concession B'},
    });

    const tableProps = ComponentTestHelper.get(TableKey)[0];
    await waitFor(() => {
      expect(`${tableProps?.id || ''}`.trim()).not.toBe('');
    });

    const tableEl = document.createElement('table');
    tableEl.id = tableProps.id;
    document.body.appendChild(tableEl);

    // Table rows do NOT include concession code/desc columns — they are injected from records
    (mockedXlsx.utils.sheet_to_json as jest.Mock).mockReturnValue([
      ['ID', 'First Name', 'Conessions'],
      ['1001', 'Ada', '($10.00)'],
    ]);

    await userEvent.click(screen.getByRole('button', {name: /export/i}));

    expect(mockedXlsx.utils.aoa_to_sheet).toHaveBeenCalledWith([
      [
        'ID',
        'First Name',
        'Concession Fee Code',
        'Concession Fee Code Description',
        'Conessions',
      ],
      ['1001', 'Ada', 'CONC_A', 'Concession A', '($10.00)'],
      ['1001', 'Ada', 'CONC_B', 'Concession B', '($10.00)'],
    ]);
    expect(mockedXlsx.writeFile).toHaveBeenCalled();

    document.body.removeChild(tableEl);
  });
});
