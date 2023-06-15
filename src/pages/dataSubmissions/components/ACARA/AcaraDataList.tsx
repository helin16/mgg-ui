import iAcaraData from './iAcaraData';
import Table, {iTableColumn} from '../../../../components/common/Table';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import moment from 'moment-timezone';

type iAcaraDataList = {
  records: iAcaraData[];
  isLoading?: boolean;
}
const AcaraDataList = ({records, isLoading = false}: iAcaraDataList) => {
  if (records.length <= 0) {
    return null;
  }

  const getColumns = () => {
    return [{
      key: 'ID',
      header: 'ID',
      cell: (column: iTableColumn, row: iAcaraData) => {
        return <td key={column.key}>{row.ID}</td>
      }
    }, {
      key: 'FileYear',
      header: 'Year',
      cell: (column: iTableColumn, row: iAcaraData) => {
        return <td key={column.key}>{row.fileYear}</td>
      }
    }, {
      key: 'FileSemester',
      header: 'Semester',
      cell: (column: iTableColumn, row: iAcaraData) => {
        return <td key={column.key}>{row.fileSemester}</td>
      }
    }, {
      key: 'yearLevel',
      header: 'Yr Lvl.',
      cell: (column: iTableColumn, row: iAcaraData) => {
        return <td key={column.key}>{row.yearLevelCode}</td>
      }
    }, {
      key: 'dateOfBirth',
      header: 'Date Of Birth',
      cell: (column: iTableColumn, row: iAcaraData) => {
        return <td key={column.key}>{moment(row.dateOfBirth).format('DD/MM/YYYY')}</td>
      }
    }, {
      key: 'ATSIStatus',
      header: 'ATSI Status (Aboriginal and/or Torres Strait Islander status)',
      cell: (column: iTableColumn, row: iAcaraData) => {
        return <td key={column.key}>{row.ATSIStatus}</td>
      }
    }, {
      key: 'ParentGuardian1SchoolEducation',
      header: 'Parent Guardian 1 School Education (Parent 1 School Education)'
    }, {
      key: 'ParentGuardian1HighestNonSchoolEducation',
      header: 'Parent Guardian 1 Highest NonSchool Education (Parent 1 Non-School Education)'
    }, {
      key: 'ParentGuardian1OccupationGroup',
      header: 'Parent Guardian 1 Occupation Group (Parent 1 Occupation Group)'
    }, {
      key: 'ParentGuardian1MainSLG',
      header: 'Parent Guardian 1 Main SLG (Parent 1 Language other than English spoken at home)'
    }, {
      key: 'ParentGuardian2SchoolEducation',
      header: 'Parent Guardian 2 School Education (Parent 2 School Education)'
    }, {
      key: 'ParentGuardian2HighestNonSchoolEducation',
      header: 'Parent Guardian 2 Highest NonSchool Education (Parent 2 Non-School Education)'
    }, {
      key: 'ParentGuardian2OccupationGroup',
      header: 'Parent Guardian 2 Occupation Group (Parent 2 Occupation Group)'
    }, {
      key: 'ParentGuardian2MainSLG',
      header: 'Parent Guardian 2 Main SLG (Parent 2 Language other than English spoken at home)'
    }]
  }

  if (isLoading === true) {
    return <PageLoadingSpinner />
  }

  return (
    <Table
      hover
      striped
      responsive
      columns={getColumns()}
      rows={records}
    />
  )
}

export default AcaraDataList;
