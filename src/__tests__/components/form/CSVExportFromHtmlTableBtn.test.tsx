import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as XLSX from 'sheetjs-style';
import CSVExportFromHtmlTableBtn from '../../../components/form/CSVExportFromHtmlTableBtn';

jest.mock('sheetjs-style', () => {
  const actual = jest.requireActual('sheetjs-style');
  return {
    ...actual,
    utils: {
      ...actual.utils,
      book_new: jest.fn(() => ({})),
      book_append_sheet: jest.fn(),
    },
    writeFile: jest.fn(),
  };
});

describe('CSVExportFromHtmlTableBtn', () => {
  const mockedXlsx = XLSX as jest.Mocked<typeof XLSX>;

  beforeEach(() => {
    // react-scripts' jest config resets mock implementations before every test,
    // so the jest.fn() defaults set in the jest.mock() factory above don't survive - reset them here.
    (mockedXlsx.utils.book_new as jest.Mock).mockReturnValue({});
  });

  const renderTableAndBtn = () => {
    render(
      <div>
        <table id="staff-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>DOB</th>
              <th>CPR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Smith</td>
              <td>01 Jan 1990</td>
              <td>
                <div className="skill-expiry-date bg-danger text-white">01 Jan 2020</div>
              </td>
            </tr>
            <tr>
              <td>Jane Doe</td>
              <td>01 Jan 1985</td>
              <td>
                <div className="skill-expiry-date">01 Jan 2030</div>
              </td>
            </tr>
          </tbody>
        </table>
        <CSVExportFromHtmlTableBtn tableHtmlId="staff-table" fileName="staff.xlsx" />
      </div>
    );
  };

  const getExportedWorksheet = () => {
    return mockedXlsx.utils.book_append_sheet.mock.calls[0][1];
  };

  it('highlights only the expired skill-expiry cell, not other date columns or non-expired skills', async () => {
    renderTableAndBtn();

    await userEvent.click(screen.getByRole('button', {name: /export/i}));

    const ws: any = getExportedWorksheet();
    const expiredSkillCellRef = XLSX.utils.encode_cell({r: 1, c: 2});
    const currentSkillCellRef = XLSX.utils.encode_cell({r: 2, c: 2});
    const dobCellRef = XLSX.utils.encode_cell({r: 1, c: 1});

    expect(ws[expiredSkillCellRef].s).toEqual({
      fill: {
        patternType: 'solid',
        fgColor: {rgb: 'FFFFFF00'},
        bgColor: {rgb: 'FFFFFF00'},
      },
      font: {bold: true, color: {rgb: 'FFFF0000'}},
    });
    expect(ws[currentSkillCellRef].s).toBeUndefined();
    expect(ws[dobCellRef].s).toBeUndefined();
  });

  it('writes the file with the provided fileName', async () => {
    renderTableAndBtn();

    await userEvent.click(screen.getByRole('button', {name: /export/i}));

    expect(mockedXlsx.writeFile).toHaveBeenCalledWith(expect.anything(), 'staff.xlsx');
  });
});
