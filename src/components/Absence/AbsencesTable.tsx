import Table, {iTableColumn} from '../common/Table';
import iSynVAbsence from '../../types/Synergetic/Absence/iSynVAbsence';

type iAbsencesTable = {
  absences: iSynVAbsence[];
}

const AbsencesTable = ({absences, ...props}: iAbsencesTable) => {
  const getColumns = () => [
    {
      key: "date",
      header: "Date",
      cell: (col: iTableColumn, data: iSynVAbsence) => {
        return (
          <td key={col.key}>
            {`${data.AbsenceDate || ""}`.replace("T00:00:00.000Z", "")}
          </td>
        );
      }
    },
    {
      key: "period",
      header: "Period",
      cell: (col: iTableColumn, data: iSynVAbsence) => {
        return <td key={col.key}>{data.AbsencePeriod}</td>;
      }
    },
    {
      key: "type",
      header: "Type",
      cell: (col: iTableColumn, data: iSynVAbsence) => {
        return (
          <td key={col.key}>
            {data.SynLuAbsenceType?.Code} - {data.SynLuAbsenceType?.Description}
          </td>
        );
      }
    },
    {
      key: "reason",
      header: "Reason",
      cell: (col: iTableColumn, data: iSynVAbsence) => {
        return (
          <td key={col.key}>
            {data.SynLuAbsenceReason?.Code} -{" "}
            {data.SynLuAbsenceReason?.Description}
          </td>
        );
      }
    },
    {
      key: "comments",
      header: "Comments",
      cell: (col: iTableColumn, data: iSynVAbsence) => {
        return (
          <td key={col.key}>
            {data.Description}
          </td>
        );
      }
    }
  ];

  return (
    <Table
      rows={absences.sort((absence1, absence2) => {
        return `${absence1.AbsenceDate}_${absence1.AbsencePeriodSort}` >
        `${absence2.AbsenceDate}_${absence2.AbsencePeriodSort}`
          ? 1
          : -1;
      })}
      columns={getColumns()}
      responsive
      hover
      striped
    />
  )
}

export default AbsencesTable
