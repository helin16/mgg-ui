import styled from "styled-components";
import iSynTPastoralCare from '../../../../../types/Synergetic/iSynTPastoralCare';
import Table, {iTableColumn} from '../../../../../components/common/Table';
import moment from 'moment-timezone';

const Wrapper = styled.div``;
type iWellBeingStudentAlertsPanel = {
  pastoralCares: iSynTPastoralCare[];
};
const WellBeingPastoralCareTable = ({
  pastoralCares
}: iWellBeingStudentAlertsPanel) => {

  const getColumns = (): iTableColumn[] => [{
    key: 'category',
    header: 'Category',
    cell: (column, data: iSynTPastoralCare) => {
      return <td key={column.key}>{data.SynLuPastoralCareCategory?.Description}</td>
    }
  }, {
    key: 'details',
    header: 'Details',
    cell: (column, data: iSynTPastoralCare) => {
      return <td key={column.key}>{data.Details}</td>
    }
  }, {
    key: 'created',
    header: 'Created Date',
    cell: (column, data: iSynTPastoralCare) => {
      return <td key={column.key}>{moment(data.CreatedDate).format('DD/MM/YYYY')}</td>
    }
  }];

  return (
    <Wrapper className={"pastoral-care-table"}>
      <Table columns={getColumns()} rows={pastoralCares} />
    </Wrapper>
  );
};

export default WellBeingPastoralCareTable;
