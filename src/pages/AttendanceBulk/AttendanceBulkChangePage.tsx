import Page from '../../layouts/Page';
import AttendancesListWithSearchPanel from '../../components/Attendance/AttendancesListWithSearchPanel';


const AttendanceBulkChangePage = () => {
  return (
    <Page title={<h3>Bulk edit attendances</h3>}>
      <AttendancesListWithSearchPanel />
    </Page>
  )
}

export default AttendanceBulkChangePage;
