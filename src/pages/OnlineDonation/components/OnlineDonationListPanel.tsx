import { useEffect, useState } from "react";
import iPaginatedResult from "../../../types/iPaginatedResult";
import iSynOnlineDonation from "../../../types/Synergetic/Finance/iSynOnlineDonation";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import Table, { iTableColumn } from "../../../components/common/Table";
import SynOnlineDonationService from "../../../services/Payments/SynOnlineDonationService";
import Toaster from "../../../services/Toaster";
import moment from "moment-timezone";
import UtilsService from "../../../services/UtilsService";
import PopupModal from "../../../components/common/PopupModal";
import SectionDiv from "../../../components/common/SectionDiv";

const OnlineDonationListPanel = () => {
  const [onlineDonations, setOnlineDonations] = useState<iPaginatedResult<
    iSynOnlineDonation
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showingRecord, setShowingRecord] = useState<iSynOnlineDonation | null>(
    null
  );

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    SynOnlineDonationService.getAll({
      where: JSON.stringify({
        Active: true
      }),
      perPage: 20,
      sort: "CreatedAt:DESC",
      currentPage
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setOnlineDonations(resp);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
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
  }, [currentPage]);

  const getErrorDetailsPopup = () => {
    if (showingRecord === null) {
      return null;
    }
    return (
      <PopupModal
        header={<b>Error Details</b>}
        handleClose={() => setShowingRecord(null)}
        show={showingRecord !== null}
        size={"lg"}
      >
        <SectionDiv className={"margin-bottom"}>
          <pre>{JSON.stringify(JSON.parse(showingRecord.GatewaytError || '{}'), null, 2)}</pre>
        </SectionDiv>
      </PopupModal>
    );
  };

  const getStatusTd = (key: string, data: iSynOnlineDonation) => {
    if (`${data.GatewaytError || ""}`.trim() !== "") {
      return (
        <td key={key} className={"bg-danger text-white cursor-pointer"} onClick={() => setShowingRecord(data)}>
          ERROR
        </td>
      );
    }

    if (`${data.GatewayResponseText || ""}`.trim() !== "") {
      return (
        <td key={key} className={"bg-success text-white"}>
          SUCCESS
        </td>
      );
    }
    return <td key={key}></td>;
  };

  const getColumns = () => [
    {
      key: "date",
      header: "Date",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return (
          <td key={col.key}>
            {moment(data.DonationDate).format("DD MMM YYYY")}
          </td>
        );
      }
    },
    {
      key: "ref",
      header: "Reference",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return <td key={col.key}>{data.CustomerReferenceNumber}</td>;
      }
    },
    {
      key: "name",
      header: "Name",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return (
          <td key={col.key}>
            {data.Preferred} {data.Surname}
          </td>
        );
      }
    },
    {
      key: "email",
      header: "Email",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return (
          <td key={col.key}>
            <a href={`mailto:${data.Email}`}>{data.Email}</a>
          </td>
        );
      }
    },
    {
      key: "phone",
      header: "Phone",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return <td key={col.key}>{data.MobilePhone}</td>;
      }
    },
    {
      key: "amount",
      header: "Amount",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return (
          <td key={col.key}>
            {UtilsService.formatIntoCurrency(data.DonationAmount)}
          </td>
        );
      }
    },
    {
      key: "fundDirection",
      header: "Donation Direction",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return <td key={col.key}>{data.DonationFund}</td>;
      }
    },
    {
      key: "remainAnonymous",
      header: "Prefer Anonymous?",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return (
          <td key={col.key}>
            {data.AnonymousDonationFlag === true ? "Y" : ""}
          </td>
        );
      }
    },
    {
      key: "address",
      header: "Address",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return <td key={col.key}>{data.FullAddress}</td>;
      }
    },
    {
      key: "status",
      header: "Status",
      cell: (col: iTableColumn, data: iSynOnlineDonation) => {
        return getStatusTd(col.key, data);
      }
    }
  ];

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <>
      <Table
        columns={getColumns()}
        rows={onlineDonations?.data || []}
        pagination={{
          currentPage,
          totalPages: onlineDonations?.pages || 0,
          onSetCurrentPage: newPage => setCurrentPage(newPage)
        }}
      />
      {getErrorDetailsPopup()}
    </>
  );
};

export default OnlineDonationListPanel;
