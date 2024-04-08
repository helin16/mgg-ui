import Page from "../../../layouts/Page";
import FunnelLeadsAdminPage from "./FunnelLeadsAdminPage";
import { MGGS_MODULE_ID_FUNNEL } from "../../../types/modules/iModuleUser";
import FunnelLeadsTable from "./Components/FunnelLeadsTable";
import FunnelLeadsSearchPanel, {
  iSearchCriteria
} from "./Components/FunnelLeadsSearchPanel";
import { useEffect, useState } from "react";
import iPaginatedResult from "../../../types/iPaginatedResult";
import IFunnelLead, {
  defaultSearchFunnelLeadsStatuses,
  FUNNEL_LEAD_STATUS_IGNORED
} from "../../../types/Funnel/iFunnelLead";
import MathHelper from "../../../helper/MathHelper";
import FunnelService from "../../../services/Funnel/FunnelService";
import { Button } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import { FlexContainer } from "../../../styles";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import {OP_AND, OP_OR} from '../../../helper/ServiceHelper';

const FunnelLeadsPage = () => {
  const [searchCriteria, setSearchCriteria] = useState<iSearchCriteria>({});

  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [funnelLeads, setFunnelLeads] = useState<iPaginatedResult<
    IFunnelLead
  > | null>(null);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    const searchStudentName = `${searchCriteria.studentName || ''}`.trim();
    const searchParent1 = `${searchCriteria.parent1 || ''}`.trim();
    const searchParent2 = `${searchCriteria.parent2 || ''}`.trim();
    const searchStatuses = searchCriteria.statuses || defaultSearchFunnelLeadsStatuses;
    const searchObj = [
      ...(searchStudentName === '' ? [] : [{[OP_OR]: [{student_first_name: searchStudentName}, {student_last_name: searchStudentName}]}]),
      ...(searchParent1 === '' ? [] : [{[OP_OR]: [{parent_first_name: searchParent1}, {parent_last_name: searchParent1}, {parent_email: searchParent1}, {parent_phone_number: searchParent1}]}]),
      ...(searchParent2 === '' ? [] : [{[OP_OR]: [{parent1_first_name: searchParent2}, {parent1_last_name: searchParent2}, {parent1_email: searchParent2}, {parent1_phone_number: searchParent2}]}]),
      ...(searchStatuses.length <= 0 ? [] : [{status: searchStatuses}]),
    ]

    FunnelService.getAll({
      where: JSON.stringify({
        isActive: true,
        ...(searchObj.length <= 0 ? {} : {[OP_AND]: searchObj}),
      }),
      sort: 'updated_at:DESC',
      currentPage,
      perPage
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setFunnelLeads(resp);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [currentPage, perPage, count, searchCriteria]);

  const onRefresh = () => {
    setCurrentPage(1);
    setCount(MathHelper.add(count, 1));
  };

  const getContent = () => {
    if (isLoading === true && funnelLeads === null) {
      return <PageLoadingSpinner />;
    }

    return (
      <>
        <FunnelLeadsSearchPanel
          isLoading={isLoading}
          className={"space-below"}
          onSearch={criteria => {
            setSearchCriteria(criteria);
            setCount(MathHelper.add(count, 1));
          }}
          onReset={() => {
            setFunnelLeads(null);
            setCurrentPage(1);
            setSearchCriteria({});
          }}
        />
        <FlexContainer className={"justify-content-start align-items-center"}>
          <div>
            Showing: {funnelLeads?.from || 0} ~ {funnelLeads?.to || 0} of{" "}
            {funnelLeads?.total}
          </div>

          <div>
            <Button size={"sm"} variant={"link"} onClick={() => onRefresh()}>
              <Icons.Recycle /> Refresh
            </Button>
          </div>
        </FlexContainer>
        <FunnelLeadsTable
          funnelLeads={funnelLeads}
          setCurrentPage={setCurrentPage}
          setPerPage={setPerPage}
          isLoading={isLoading}
          onLeadUpdated={() => onRefresh()}
          leadUpdatingFn={(lead) => FunnelService.update(lead.id, {status: FUNNEL_LEAD_STATUS_IGNORED})}
        />
      </>
    );
  };

  return (
    <Page
      title={<h3>Funnel Leads</h3>}
      AdminPage={FunnelLeadsAdminPage}
      moduleId={MGGS_MODULE_ID_FUNNEL}
    >
      {getContent()}
    </Page>
  );
};

export default FunnelLeadsPage;
