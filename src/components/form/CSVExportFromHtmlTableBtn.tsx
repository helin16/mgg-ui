import {Button, ButtonProps} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import * as XLSX from 'sheetjs-style';
import moment from 'moment-timezone';


type iCSVExportFromHtmlTableBtn = ButtonProps & {
  tableHtmlId: string;
  fileName: string;
  btnTxt?: string
}
const CSVExportFromHtmlTableBtn = ({tableHtmlId, fileName, btnTxt = 'Export', ...props}: iCSVExportFromHtmlTableBtn) => {
  const doExport = () => {
    const data = document.getElementById(tableHtmlId);
    const ws = XLSX.utils.table_to_sheet(data)

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
