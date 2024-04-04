import Table, { iTableColumn } from "../../../../components/common/Table";
import IFunnelLead from "../../../../types/Funnel/iFunnelLead";
import iPaginatedResult from "../../../../types/iPaginatedResult";
import FunnelLeadsFileDownloadPopupBtn, {
  getFunnelLeadFiles
} from "./FunnelLeadsFileDownloadPopupBtn";
import * as Icons from "react-bootstrap-icons";

type iFunnelLeadsTable = {
  funnelLeads: iPaginatedResult<IFunnelLead> | null;
  setCurrentPage?: (currentPage: number) => void;
  setPerPage?: (perPage: number) => void;
  isLoading?: boolean;
};
const FunnelLeadsTable = ({
  funnelLeads,
  setCurrentPage,
  setPerPage,
  isLoading = false
}: iFunnelLeadsTable) => {
  const getParentTd = (data: IFunnelLead, key: string) => {
    // @ts-ignore
    const parentEmail = `${data[`${key}_email`] || ""}`.trim();
    // @ts-ignore
    const parentPhone = `${data[`${key}_phone_number`] || ""}`.trim();
    return (
      <>
        <div>
          {`
              ${
                // @ts-ignore
                `${data[`${key}_relationship`] || ""}`.trim() === ""
                  ? ""
                  : // @ts-ignore
                    `[${data[`${key}_relationship`] || ""}]`
              } 
              ${
                // @ts-ignore
                data[`${key}_salutation`] || ""
              } 
              ${
                // @ts-ignore
                data[`${key}_first_name`] || ""
              } 
              ${
                // @ts-ignore
                data[`${key}_last_name`] || ""
              } 
            `.trim()}
        </div>
        {parentEmail === "" ? (
          ""
        ) : (
          <div>
            <a href={`mailto:${parentEmail}`}>
              <small>{parentEmail}</small>
            </a>
          </div>
        )}
        {parentPhone === "" ? (
          ""
        ) : (
          <div>
            <a href={`tel:${parentPhone}`}>
              <small>{parentPhone}</small>
            </a>
          </div>
        )}
      </>
    );
  };

  return (
    <Table
      isLoading={isLoading}
      columns={[
        {
          key: "student",
          header: "Student",
          cell: (col: iTableColumn, data: IFunnelLead) => {
            return (
              <td key={col.key}>
                <div>
                  {`${data.student_first_name || ""} ${data.student_last_name ||
                    ""}`.trim()}
                </div>
                <div>
                  <small>
                    <b>D.O.B</b>: {data.student_date_of_birth || ""}
                  </small>
                </div>
              </td>
            );
          }
        },
        {
          key: "funnel_stage",
          header: "Funnel Status",
          cell: (col: iTableColumn, data: IFunnelLead) => {
            return <td key={col.key}>{data.pipeline_stage_name || ""}</td>;
          }
        },
        {
          key: "student_entry_year",
          header: "Entry Year",
          cell: (col: iTableColumn, data: IFunnelLead) => {
            return <td key={col.key}>{data.student_starting_year || ""}</td>;
          }
        },
        {
          key: "student_entry_year_level",
          header: "Entry Year Level",
          cell: (col: iTableColumn, data: IFunnelLead) => {
            return (
              <td key={col.key}>
                {`${data.student_starting_year_level_code ||
                  ""} - ${data.student_starting_year_level || ""}`.trim()}
              </td>
            );
          }
        },
        {
          key: "Guardian1",
          header: "Guardian 1",
          cell: (col: iTableColumn, data: IFunnelLead) => {
            return <td key={col.key}>{getParentTd(data, "parent")}</td>;
          }
        },
        {
          key: "Guardian2",
          header: "Guardian 2",
          cell: (col: iTableColumn, data: IFunnelLead) => {
            return <td key={col.key}>{getParentTd(data, "parent1")}</td>;
          }
        },
        {
          key: "ET",
          header: "Enquiry Tracker",
          cell: (col: iTableColumn, data: IFunnelLead) => {
            const etId = `${data.enquiryTrackerId || ''}`.trim();
            const content = (etId === '' ? null : <a href={`https://app.enquirytracker.net/enquiries/edit-student;studentId=${etId}`} target={'__BLANK'}>{etId}</a>);
            return <td key={col.key}>{content}</td>;
          }
        },
        {
          key: "Operations",
          header: "",
          cell: (col: iTableColumn, data: IFunnelLead) => {
            const files = getFunnelLeadFiles(
              JSON.parse(data.externalObj?.custom_properties_json || null)
            );
            return (
              <td key={col.key} className={"text-right"}>
                {files.length > 0 ? (
                  <FunnelLeadsFileDownloadPopupBtn
                    lead={data}
                    variant={"success"}
                  >
                    <Icons.Download /> {files.length} file(s)
                  </FunnelLeadsFileDownloadPopupBtn>
                ) : null}
              </td>
            );
          }
        }
      ]}
      rows={funnelLeads?.data || []}
      pagination={{
        totalPages: funnelLeads?.pages || 0,
        currentPage: funnelLeads?.currentPage || 1,
        perPage: funnelLeads?.perPage || 10,
        onSetCurrentPage: currPage =>
          setCurrentPage && setCurrentPage(currPage),
        onPageSizeChanged: pPage => setPerPage && setPerPage(pPage)
      }}
      hover
      striped
      responsive
    />
  );
};

export default FunnelLeadsTable;
