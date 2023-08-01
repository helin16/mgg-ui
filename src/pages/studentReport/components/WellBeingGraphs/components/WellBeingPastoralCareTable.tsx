import styled from "styled-components";
import iSynTPastoralCare from "../../../../../types/Synergetic/iSynTPastoralCare";
import Table, { iTableColumn } from "../../../../../components/common/Table";
import moment from "moment-timezone";
import { useState } from "react";
import PopupModal from "../../../../../components/common/PopupModal";

const Wrapper = styled.div`
  .details-wrapper {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    :hover {
      text-decoration: underline;
    }
  }
`;
type iWellBeingStudentAlertsPanel = {
  pastoralCares: iSynTPastoralCare[];
};
const WellBeingPastoralCareTable = ({
  pastoralCares
}: iWellBeingStudentAlertsPanel) => {
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const getColumns = (): iTableColumn[] => [
    {
      key: "category",
      header: "Category",
      cell: (column, data: iSynTPastoralCare) => {
        return (
          <td key={column.key}>
            {data.SynLuPastoralCareCategory?.Description}
          </td>
        );
      }
    },
    {
      key: "details",
      header: "Details",
      cell: (column, data: iSynTPastoralCare) => {
        const details = `${data.Details || ''}`.trim();
        if (details === '') {
          return <td key={column.key}></td>;
        }

        return (
          <td
            key={column.key}
            className={"details-wrapper"}
            onClick={() => setShowDetails(data.Details || "")}
          >
            <small className={"cursor-pointer"}>{data.Details}</small>
          </td>
        );
      }
    },
    {
      key: "created",
      header: "Created Date",
      cell: (column, data: iSynTPastoralCare) => {
        return (
          <td key={column.key}>
            {moment(data.CreatedDate).format("DD/MM/YYYY")}
          </td>
        );
      }
    }
  ];

  const getPopup = () => {
    if (showDetails === null) {
      return null;
    }
    return (
      <PopupModal title={'Details'} show={true} handleClose={() => setShowDetails(null)}>
        <p>{showDetails}</p>
      </PopupModal>
    );
  };

  return (
    <Wrapper className={"pastoral-care-table"}>
      <Table columns={getColumns()} rows={pastoralCares} />
      {getPopup()}
    </Wrapper>
  );
};

export default WellBeingPastoralCareTable;
