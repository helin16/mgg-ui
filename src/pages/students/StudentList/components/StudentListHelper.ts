import {iTableColumn} from '../../../../components/common/Table';
import {iVPastAndCurrentStudent} from '../../../../types/Synergetic/iVStudent';
import moment from 'moment-timezone';
import * as XLSX from 'sheetjs-style';

const getCell = (columnName: string, forExport = false) =>  (col: iTableColumn, data: iVPastAndCurrentStudent) => {
  // @ts-ignore
  const value = `${data[columnName] || ""}`.trim();
  if (value.toLowerCase() === "true") {
    return "Y";
  }
  if (value.toLowerCase() === "false") {
    return "N";
  }
  const regex = /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/;
  if (regex.test(value) && `${columnName}`.includes('Date')) {
    return moment(value).format(forExport === true ? 'YYYY-MM-DD' : "DD MMM YYYY");
  }
  return value;
}

const genStudentListExcel = (columns: iTableColumn[], students: iVPastAndCurrentStudent[]) => {
  const data = students.map(student => {
    return columns.reduce((map, column) => {
      return {
        ...map,
        [column.key]: getCell(column.key, true)(column, student),
      }
    }, {})
  });

  const ws = XLSX.utils.json_to_sheet(data);

  const wb = XLSX.utils.book_new();
  const now = moment().format('DD-MMM-YYYY_HH_mm_ss');
  XLSX.utils.book_append_sheet(wb, ws, `${now}`);
  XLSX.writeFile(wb, `Student_List_${now}.xlsx`);
};

const StudentListHelper = {
  getCell,
  genStudentListExcel,
}

export default StudentListHelper;
