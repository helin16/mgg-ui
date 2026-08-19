import {Button, ButtonProps} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import * as XLSX from 'sheetjs-style';
import moment from 'moment-timezone';

// Excel date format matching the on-screen "DD MMM YYYY" (moment) formatting used for skill-expiry
// cells - without this, table_to_sheet auto-detects the date and defaults to a US m/d/yy display.
// Must be set on `.z` (not just `.s.numFmt`): table_to_sheet already sets `.z` on auto-detected date
// cells, and sheetjs-style's writer always overwrites `.s.numFmt` from `.z` when `.z` is present.
const SKILL_EXPIRY_DATE_NUM_FMT = 'dd mmm yyyy';
const EXPIRED_SKILL_CELL_STYLE = {
  fill: {
    patternType: 'solid',
    fgColor: {rgb: 'FFDC3545'},
    bgColor: {rgb: 'FFDC3545'},
  },
  font: {bold: true, color: {rgb: 'FFFFFFFF'}},
};

type iCSVExportFromHtmlTableBtn = ButtonProps & {
  tableHtmlId: string;
  fileName: string;
  btnTxt?: string
}
const CSVExportFromHtmlTableBtn = ({tableHtmlId, fileName, btnTxt = 'Export', ...props}: iCSVExportFromHtmlTableBtn) => {
  // Interactive-only columns (e.g. the staff-selection checkboxes) are marked with
  // `.csv-export-exclude-column` and dropped from the export - they have no meaningful export value.
  const removeExcludedColumns = (table: HTMLElement) => {
    const headerRow = table.querySelector('thead tr');
    if (!headerRow) {
      return;
    }
    const excludedColIndexes = Array.from(headerRow.children)
      .map((cell, index) => (cell.querySelector('.csv-export-exclude-column') ? index : -1))
      .filter(index => index !== -1)
      .sort((a, b) => b - a);
    if (excludedColIndexes.length === 0) {
      return;
    }
    Array.from(table.querySelectorAll('tr')).forEach(tr => {
      excludedColIndexes.forEach(index => {
        const cell = tr.children[index];
        if (cell) {
          tr.removeChild(cell);
        }
      });
    });
  };

  // Skill-expiry cells are marked on-screen with `.skill-expiry-date` (expired ones additionally get
  // `.bg-danger.text-white`, see StaffListTable.tsx) - table_to_sheet only carries inline styles, not
  // Bootstrap classes or the on-screen date format, so both are re-derived here from the live DOM.
  const formatSkillExpiryCells = (table: HTMLElement, ws: any) => {
    const headerRowCount = table.querySelectorAll('thead tr').length;
    Array.from(table.querySelectorAll('tbody tr')).forEach((tr, rowIndexInBody) => {
      Array.from(tr.children).forEach((td, colIndex) => {
        const skillExpiryCell = td.querySelector('.skill-expiry-date');
        if (!skillExpiryCell) {
          return;
        }
        const cellRef = XLSX.utils.encode_cell({r: headerRowCount + rowIndexInBody, c: colIndex});
        if (!ws[cellRef]) {
          return;
        }
        ws[cellRef].z = SKILL_EXPIRY_DATE_NUM_FMT;
        if (skillExpiryCell.classList.contains('bg-danger')) {
          // Clone rather than reuse the shared constant - sheetjs-style's writer mutates `.s` in place
          // (merging `.z` into it as `numFmt`), which would otherwise permanently pollute the constant.
          ws[cellRef].s = {...EXPIRED_SKILL_CELL_STYLE};
        }
      });
    });
  };

  const doExport = () => {
    const data = document.getElementById(tableHtmlId);
    // Clone so excluded columns can be stripped without mutating the live, React-managed table.
    const exportTable = data ? (data.cloneNode(true) as HTMLElement) : null;
    if (exportTable) {
      removeExcludedColumns(exportTable);
    }
    const ws = XLSX.utils.table_to_sheet(exportTable || data)
    if (exportTable) {
      formatSkillExpiryCells(exportTable, ws);
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
