import {Button, ButtonProps} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import * as XLSX from 'sheetjs-style';
import moment from 'moment-timezone';

const EXPIRED_SKILL_CELL_STYLE = {
  fill: {
    patternType: 'solid',
    fgColor: {rgb: 'FFFFFF00'},
    bgColor: {rgb: 'FFFFFF00'},
  },
  font: {bold: true, color: {rgb: 'FFFF0000'}},
};

type iCSVExportFromHtmlTableBtn = ButtonProps & {
  tableHtmlId: string;
  fileName: string;
  btnTxt?: string
}
const CSVExportFromHtmlTableBtn = ({tableHtmlId, fileName, btnTxt = 'Export', ...props}: iCSVExportFromHtmlTableBtn) => {
  // Expired skill-expiry cells are already marked on-screen with `.skill-expiry-date.bg-danger`
  // (see StaffListTable.tsx) - table_to_sheet only carries inline styles, not Bootstrap classes,
  // so we re-derive the same cells here from the live DOM and style them directly on the sheet.
  const highlightExpiredSkillCells = (table: HTMLElement, ws: any) => {
    const headerRowCount = table.querySelectorAll('thead tr').length;
    Array.from(table.querySelectorAll('tbody tr')).forEach((tr, rowIndexInBody) => {
      Array.from(tr.children).forEach((td, colIndex) => {
        if (!td.querySelector('.skill-expiry-date.bg-danger')) {
          return;
        }
        const cellRef = XLSX.utils.encode_cell({r: headerRowCount + rowIndexInBody, c: colIndex});
        if (!ws[cellRef]) {
          return;
        }
        ws[cellRef].s = EXPIRED_SKILL_CELL_STYLE;
      });
    });
  };

  const doExport = () => {
    const data = document.getElementById(tableHtmlId);
    const ws = XLSX.utils.table_to_sheet(data)
    if (data) {
      highlightExpiredSkillCells(data, ws);
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
    XLSX.writeFile(wb, fileName);
  }


  return (
    <>
      <Button {...props} onClick={() => doExport()}>
        <Icons.Download />{' '}
        {btnTxt}
      </Button>
    </>
  )
};

export default CSVExportFromHtmlTableBtn;
