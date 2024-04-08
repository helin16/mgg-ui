import Table, { iTableColumn } from "../../../../components/common/Table";
import IFunnelLead, {
  FUNNEL_LEAD_STATUS_IGNORED,
  FUNNEL_LEAD_STATUS_SYNCD_WITH_SYNERGETIC
} from "../../../../types/Funnel/iFunnelLead";
import iPaginatedResult from "../../../../types/iPaginatedResult";
import FunnelLeadsFileDownloadPopupBtn, {
  getFunnelLeadFiles
} from "./FunnelLeadsFileDownloadPopupBtn";
import * as Icons from "react-bootstrap-icons";
import styled from "styled-components";
import DeleteConfirmPopupBtn from "../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn";
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/makeReduxStore';

const Wrapper = styled.div`
  td.status {
    &.${FUNNEL_LEAD_STATUS_IGNORED} {
      background-color: red;
      color: white;
    }
    &.${FUNNEL_LEAD_STATUS_SYNCD_WITH_SYNERGETIC} {
        background-color: green;
        color: white;
    }
  }
`;

type iFunnelLeadsTable = {
  funnelLeads: iPaginatedResult<IFunnelLead> | null;
  setCurrentPage?: (currentPage: number) => void;
  setPerPage?: (perPage: number) => void;
  isLoading?: boolean;
  onLeadUpdated?: (lead: IFunnelLead) => void;
  leadUpdatingFn?: (lead: IFunnelLead) => Promise<IFunnelLead>;
};
const FunnelLeadsTable = ({
  funnelLeads,
  setCurrentPage,
  setPerPage,
  onLeadUpdated,
  leadUpdatingFn,
  isLoading = false
}: iFunnelLeadsTable) => {
  const { user } = useSelector((state: RootState) => state.auth);
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
    <Wrapper>
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
                    {`${data.student_first_name ||
                      ""} ${data.student_last_name || ""}`.trim()}
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
              const etId = `${data.enquiryTrackerId || ""}`.trim();
              const content =
                etId === "" ? null : (
                  <a
                    href={`https://app.enquirytracker.net/enquiries/edit-student;studentId=${etId}`}
                    target={"__BLANK"}
                  >
                    {etId}
                  </a>
                );
              return <td key={col.key}>{content}</td>;
            }
          },
          {
            key: "status",
            header: "Status",
            cell: (col: iTableColumn, data: IFunnelLead) => {
              const status = `${data.status || ""}`.trim();
              const statusMeaning = `${data.statusMeaning || ""}`.trim();
              return (
                <td key={col.key} className={`status ${status.toUpperCase()}`}>
                  <div>{status.toUpperCase()}</div>
                  <div className={"ellipsis"}>
                    <small>{statusMeaning}</small>
                  </div>
                </td>
              );
            }
          },{
            key: "synergeticId",
            header: "Syn ID",
            cell: (col: iTableColumn, data: IFunnelLead) => {
              return (
                <td key={col.key}>
                  {data.synergeticId || ''}
                </td>
              );
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
                    <>
                      <FunnelLeadsFileDownloadPopupBtn
                        lead={data}
                        variant={"success"}
                        size={"sm"}
                        onUpdated={(lead) => onLeadUpdated && onLeadUpdated(lead)}
                      >
                        <Icons.Download /> {files.length} file(s)
                      </FunnelLeadsFileDownloadPopupBtn>
                      {' '}
                    </>
                  ) : null}

                  <DeleteConfirmPopupBtn
                    variant={"danger"}
                    deletingFn={async () => leadUpdatingFn && leadUpdatingFn(data)}
                    deletedCallbackFn={() => onLeadUpdated && onLeadUpdated(data)}
                    size={"sm"}
                    confirmBtnString={'Ignore'}
                    description={
                      <>
                        You are about to ignore any updates from Funnel for this student{" "}
                        <b>
                          {data.student_first_name}{" "}
                          {data.student_last_name}
                        </b>
                      </>
                    }
                    confirmString={`${user?.synergyId || 'na'}`}
                  >
                    <Icons.Trash /> Ignore
                  </DeleteConfirmPopupBtn>
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
    </Wrapper>
  );
};

export default FunnelLeadsTable;
