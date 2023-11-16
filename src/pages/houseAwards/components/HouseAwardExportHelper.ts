import iVStudent from '../../../types/Synergetic/Student/iVStudent';
import * as XLSX from 'sheetjs-style';
import moment from 'moment-timezone';
import iSynLuHouse from '../../../types/Synergetic/Lookup/iSynLuHouse';
import iSynLuYearLevel from '../../../types/Synergetic/Lookup/iSynLuYearLevel';
import MathHelper from '../../../helper/MathHelper';
import iHouseAwardEvent from '../../../types/HouseAwards/iHouseAwardEvent';
import iHouseAwardScore from '../../../types/HouseAwards/iHouseAwardScore';

const genExcel = (data: ({student: iVStudent; lastYearTotal: number})[], house: iSynLuHouse, yearLevel: iSynLuYearLevel, fileYear: number, events: iHouseAwardEvent[], studentScoreMap: { [key: number]: {[key: number]: iHouseAwardScore} }) => {
  const titleRows = [[
    'ID',
    'Surname',
    'Preferred Name',
    `Year ${MathHelper.sub(fileYear, 1)}`,
    ...(events.map(event => event.name)),
    `Total ${fileYear}`,
    `Not Awarded Points`,
  ]];
  const rows = data.map(record => {
    const scoreMap = record.student.StudentID in studentScoreMap ? studentScoreMap[record.student.StudentID] : {}
    return [
      record.student.StudentID,
      record.student.StudentSurname,
      record.student.StudentPreferred,
      record.lastYearTotal,

      ...(events.map(event => {
        if (!(event.id in scoreMap)) {
          return '';
        }
        return scoreMap[event.id].score;
      })),

      MathHelper.add(record.lastYearTotal || 0, Object.keys(scoreMap).length),

      Object.values(scoreMap).filter(score => score.awarded_at === null).length,
    ]
  });
  // const {rows, cellStyleMap, mergeCells} = getRows(3); //start from row 3, as there are two title rows
  const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...rows]);

  const wb = XLSX.utils.book_new();
  const nowString = `${moment().format('DD_MMM_YYYY_HH_mm')}`;
  XLSX.utils.book_append_sheet(wb, ws, `${nowString}`);
  XLSX.writeFile(wb, `HBA_${house.Code}_${yearLevel.Code}_${fileYear}_${nowString}.xlsx`);
}

const HouseAwardExportHelper = {
  genExcel,
}

export default HouseAwardExportHelper;
