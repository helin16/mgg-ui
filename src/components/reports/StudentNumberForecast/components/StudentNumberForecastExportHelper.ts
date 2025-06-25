import iVStudent, {SYN_STUDENT_STATUS_ID_FINALISED} from "../../../../types/Synergetic/Student/iVStudent";
import iFunnelLead from "../../../../types/Funnel/iFunnelLead";
import moment from "moment-timezone";
import * as XLSX from "sheetjs-style";
import UtilsService from "../../../../services/UtilsService";
import * as _ from "lodash";
import MathHelper from '../../../../helper/MathHelper';
import iSynDebtorStudentConcession from '../../../../types/Synergetic/Finance/iSynDebtorStudentConcession';
import iSynVDebtorFee from '../../../../types/Synergetic/Finance/iSynVDebtorFee';

type iSiblingDiscountFee = iSynVDebtorFee & { discountAmount?: number };
const getFinanceColumnTitles = (showingFinanceFigures = false) => {
  if (showingFinanceFigures !== true) {
    return [];
  }
  return [
    "Fee Total",
    "Tuition Fee",
    "Consolidated Charges",
    "Dis. Code",
    "Dis. Name",
    "Dis. From",
    "Dis. To",
    "Dis. %",
    "Dis. Amount",
    "Dis. Comments"
  ];
};

const getDefaultStudentRow = (record: iVStudent | iFunnelLead) => {
  return [
    "StudentID" in record ? record.StudentID : "",
    "StudentGiven1" in record
      ? record.StudentGiven1
      : record.student_first_name,
    "StudentSurname" in record
      ? record.StudentSurname
      : record.student_last_name,
    "StudentStatusDescription" in record
      ? record.StudentStatusDescription
      : "",
    "StudentLeavingDate" in record
      ? `${record.StudentLeavingDate || ""}`.trim() === ""
        ? ""
        : moment(record.StudentLeavingDate).format("YYYY-MM-DD")
      : "",
    // @ts-ignore
    (record.isFuture === true || `${record.StudentStatus || ""}`.trim() === SYN_STUDENT_STATUS_ID_FINALISED) ? '' : `${record.StudentYearLevelDescription || ""}`,
    "StudentForm" in record ? record.StudentForm : "",
    "FullFeeFlag" in record && record.FullFeeFlag === true ? "Y" : "",
    // @ts-ignore
    `${record.StudentEntryDate || ""}`.trim() === ""
      ? ""
      : // @ts-ignore
      moment(record.StudentEntryDate).format("YYYY-MM-DD"),
    // @ts-ignore
    `${record.StudentYearLevelDescription || ""}`.trim(),
    // "pipeline_stage_name" in record ? record.pipeline_stage_name : "",
  ]
}

const getStudentRow = (record: iVStudent | iFunnelLead, showingFinanceFigures = false, showingFuture = false, feeNameMap: {[key: string]: string} = {}): (string | number | null)[][] => {
  const defaultColumns = getDefaultStudentRow(record);
  if (showingFinanceFigures !== true) {
    return [defaultColumns];
  }

  const defaultColumnsWithFinanceFigures = [
    ...defaultColumns,
    // @ts-ignore
    showingFuture === true ? (record.futureTotalFeeAmount || 0) : (record.currentTotalFeeAmount || 0),
    // @ts-ignore
    showingFuture === true ? (record.futureTuitionFees || 0) : (record.tuitionFees || 0),
    // @ts-ignore
    showingFuture === true ? (record.futureConsolidateFees || 0) : (record.consolidateFees || 0),
  ]
  const concessions = (
    // @ts-ignore
    showingFuture === true ? ( record.nextYearConcessions || []) : ( record.currentConcessions || [])
  );
  const siblingDiscounts = (
    // @ts-ignore
    showingFuture === true ? ( record.nextYearSiblingDiscounts || []) : ( record.currentSiblingDiscounts || [])
  );
  if (concessions.length <= 0 && siblingDiscounts.length <= 0) {
    return [defaultColumnsWithFinanceFigures];
  }


  const returnArr: any[]  = [];
  concessions.forEach((concession: iSynDebtorStudentConcession, index: number) => {
    returnArr.push([
      // ...(index === 0 ? defaultColumnsWithFinanceFigures : _.range(0, defaultColumnsWithFinanceFigures.length).map(() => '')),
      ...defaultColumnsWithFinanceFigures,
      `${concession.FeeCode}`,
      `${concession.FeeCode in feeNameMap ? feeNameMap[concession.FeeCode] : ''}`,
      `${concession.EffectiveFromDate || ""}`.trim() === ""
        ? ""
        : moment(`${concession.EffectiveFromDate || ""}`).format("YYYY-MM-DD"),
      `${concession.EffectiveToDate || ""}`.trim() === ""
        ? ""
        : moment(`${concession.EffectiveToDate || ""}`).format("YYYY-MM-DD"),
      `${concession.OverridePercentage}%`,
      // @ts-ignore
      `${concession.concessionAmount || ''}`.trim() === '' ? '' : concession.concessionAmount,
      `${concession.Comment || ''}`
    ]);
  })
  siblingDiscounts.forEach((discount: iSiblingDiscountFee, index: number) => {
    returnArr.push([
      // ...(index === 0 ? defaultColumnsWithFinanceFigures : _.range(0, defaultColumnsWithFinanceFigures.length).map(() => '')),
      ...defaultColumnsWithFinanceFigures,
      `${discount.FeeCode}`,
      `${discount.FeeCode in feeNameMap ? feeNameMap[discount.FeeCode] : ''}`,
      "",
      "",
      `${discount.DiscountPercentage}%`,
      // @ts-ignore
      MathHelper.mul(
        showingFuture === true
          ? // @ts-ignore
          record.futureTuitionFees || 0
          : // @ts-ignore
          record.tuitionFees || 0,
        MathHelper.div(
          discount.DiscountPercentage || 0,
          100
        )
      ),
      `Sibling Discount`,
    ]);
  })
  return returnArr;
};

const downloadHeadCounts = (
  data: (iVStudent | iFunnelLead)[],
  showingFinanceFigures = false,
  showingFuture = false,
  feeNameMap: {[key: string]: string} = {}
) => {
  const titleRows: any = [
    [
      `ID`,
      "First Name",
      "Last Name",
      "Status",
      "Leaving Date",
      "Current Year Level",
      "Form",
      "Full Fee?",
      "Entry Date",
      "Entry Year Level",
      // "Lead Stage",
      ...getFinanceColumnTitles(showingFinanceFigures)
    ]
  ];
  let rowNo = 1;
  const mergeCells: {s: { r: number, c: number }, e: { r: number, c: number }}[] = [];
  const rows = data.map((record: iVStudent | iFunnelLead) => {
    const recordRows =  getStudentRow(record, showingFinanceFigures, showingFuture, feeNameMap);
    if (recordRows.length > 1) {
      _.range(0, 14).forEach(col => {
        mergeCells.push({s: { r: rowNo, c: col }, e: { r: MathHelper.sub(MathHelper.add(rowNo, recordRows.length), 1), c: col }})
      })
    }
    // skipping the next row
    // rowNo = MathHelper.add(rowNo, recordRows.length);

    // repeat the next row
    rowNo = MathHelper.add(rowNo, 1);
    return recordRows;
  }).reduce((arr, rowA) => [...arr, ...rowA], []);
  // const {rows, cellStyleMap, mergeCells} = getRows(3); //start from row 3, as there are two title rows
  const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...rows]);

  const columRange = UtilsService.letterRange("A", showingFinanceFigures === true ? "T" : 'J');
  columRange.forEach(colRef => {
    ws[`${colRef}1`].s = {
      font: { sz: 14, bold: true }
    };
  });

  // ws["!merges"] = mergeCells;
  const nowString = `${moment().format("DD_MMM_YYYY_HH_mm_ss")}`;
  const nextYear = `${moment().add(1, 'year').year()}`;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Student_No_${showingFuture === true ? `${nextYear}` : 'current'}`);
  XLSX.writeFile(wb, `Student_No${showingFuture === true ? `_${nextYear}` : ''}_${nowString}.xlsx`);
};

const StudentNumberForecastExportHelper = {
  downloadHeadCounts
};

export default StudentNumberForecastExportHelper;
