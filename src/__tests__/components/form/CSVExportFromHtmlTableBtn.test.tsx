import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as XLSX from 'sheetjs-style';
import CSVExportFromHtmlTableBtn from '../../../components/form/CSVExportFromHtmlTableBtn';

jest.mock('sheetjs-style', () => {
  const actual = jest.requireActual('sheetjs-style');
  return {
    ...actual,
    writeFile: jest.fn(),
  };
});

describe('CSVExportFromHtmlTableBtn', () => {
  const mockedXlsx = XLSX as jest.Mocked<typeof XLSX>;

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

  const getExportedWorkbook = () => {
    return mockedXlsx.writeFile.mock.calls[0][0];
  };

  const getExportedWorksheet = () => {
    const wb: any = getExportedWorkbook();
    return wb.Sheets[wb.SheetNames[0]];
  };

  it('highlights only the expired skill-expiry cell in red/white, not other date columns or non-expired skills', async () => {
    renderTableAndBtn();

    await userEvent.click(screen.getByRole('button', {name: /export/i}));

    const ws: any = getExportedWorksheet();
    const expiredSkillCellRef = XLSX.utils.encode_cell({r: 1, c: 2});
    const dobCellRef = XLSX.utils.encode_cell({r: 1, c: 1});

    expect(ws[expiredSkillCellRef].s).toEqual({
      fill: {
        patternType: 'solid',
        fgColor: {rgb: 'FFDC3545'},
        bgColor: {rgb: 'FFDC3545'},
      },
      font: {bold: true, color: {rgb: 'FFFFFFFF'}},
    });
    expect(ws[dobCellRef].s).toBeUndefined();
  });

  it('sets a dd-mmm-yyyy number format on every skill-expiry cell (expired or not)', async () => {
    renderTableAndBtn();

    await userEvent.click(screen.getByRole('button', {name: /export/i}));

    const ws: any = getExportedWorksheet();
    const expiredSkillCellRef = XLSX.utils.encode_cell({r: 1, c: 2});
    const currentSkillCellRef = XLSX.utils.encode_cell({r: 2, c: 2});

    expect(ws[expiredSkillCellRef].z).toBe('dd mmm yyyy');
    expect(ws[currentSkillCellRef].z).toBe('dd mmm yyyy');
  });

  it('renders skill-expiry dates as "DD MMM YYYY" (not US m/d/yy) once written and re-read as a real xlsx file', async () => {
    renderTableAndBtn();

    await userEvent.click(screen.getByRole('button', {name: /export/i}));

    const wb = getExportedWorkbook();
    const buffer = XLSX.write(wb, {type: 'buffer', bookType: 'xlsx'});
    const reReadWorkbook = XLSX.read(buffer, {type: 'buffer', cellText: true});
    const reReadSheet = reReadWorkbook.Sheets[reReadWorkbook.SheetNames[0]];

    expect(reReadSheet[XLSX.utils.encode_cell({r: 1, c: 2})].w).toBe('01 Jan 2020');
    expect(reReadSheet[XLSX.utils.encode_cell({r: 2, c: 2})].w).toBe('01 Jan 2030');
  });

  it('excludes .csv-export-exclude-column columns (e.g. selection checkboxes) from the export', async () => {
    render(
      <div>
        <table id="staff-table-with-selection">
          <thead>
            <tr>
              <th>
                <span className="csv-export-exclude-column">
                  <input type="checkbox" aria-label="Select all staff" readOnly />
                </span>
              </th>
              <th>Staff ID</th>
              <th>CPR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="csv-export-exclude-column">
                  <input type="checkbox" aria-label="Select staff 109" readOnly />
                </span>
              </td>
              <td>109</td>
              <td>
                <div className="skill-expiry-date bg-danger text-white">01 Jan 2020</div>
              </td>
            </tr>
          </tbody>
        </table>
        <CSVExportFromHtmlTableBtn tableHtmlId="staff-table-with-selection" fileName="staff.xlsx" />
      </div>
    );

    await userEvent.click(screen.getByRole('button', {name: /export/i}));

    const ws: any = getExportedWorksheet();
    expect(ws['A1'].v).toBe('Staff ID');
    expect(ws['B1'].v).toBe('CPR');
    expect(ws[XLSX.utils.encode_cell({r: 1, c: 1})].s).toEqual({
      fill: {
        patternType: 'solid',
        fgColor: {rgb: 'FFDC3545'},
        bgColor: {rgb: 'FFDC3545'},
      },
      font: {bold: true, color: {rgb: 'FFFFFFFF'}},
    });
  });

  it('writes the file with the provided fileName', async () => {
    renderTableAndBtn();

    await userEvent.click(screen.getByRole('button', {name: /export/i}));

    expect(mockedXlsx.writeFile).toHaveBeenCalledWith(expect.anything(), 'staff.xlsx');
  });
});
