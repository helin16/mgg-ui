import {useCallback, useState} from "react";
import iSynOnlineDonation from "../../../types/Synergetic/Finance/iSynOnlineDonation";
import { iTableColumn } from "../../../components/common/Table";
import SynOnlineDonationService from "../../../services/Payments/SynOnlineDonationService";
import moment from "moment-timezone";
import UtilsService from "../../../services/UtilsService";
import PopupModal from "../../../components/common/PopupModal";
import SectionDiv from "../../../components/common/SectionDiv";
import useListCrudHook from "../../../components/hooks/useListCrudHook/useListCrudHook";
import iSynVDonorReceipt from "../../../types/Synergetic/Finance/iSynVDonorReceipt";

const OnlineDonationListPanel = () => {
  const [showingRecord, setShowingRecord] = useState<iSynOnlineDonation | null>(
    null
  );

  const { renderDataTable } = useListCrudHook({
    perPage: 20,
    getFn: useCallback(config => {
      const { filter, sort, ...props } = config || {};
      return SynOnlineDonationService.getAll({
        where: JSON.stringify({
          ...filter,
          Active: true
        }),
        sort: sort || "CreatedAt:DESC",
        ...props
      });
    }, []),
  });

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
          <pre>
            {JSON.stringify(
              JSON.parse(showingRecord.GatewaytError || "{}"),
              null,
              2
            )}
          </pre>
        </SectionDiv>
      </PopupModal>
    );
  };

  const getStatusTd = (key: string, data: iSynOnlineDonation) => {
    if (`${data.GatewaytError || ""}`.trim() !== "") {
      return (
        <td
          key={key}
          className={"bg-danger text-white cursor-pointer"}
          onClick={() => setShowingRecord(data)}
        >
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

  const getColumns = <T extends {}>() => [
    {
      key: "date",
      header: "Date",
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
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
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
        return <td key={col.key}>{data.CustomerReferenceNumber}</td>;
      }
    },
    {
      key: "name",
      header: "Name",
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
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
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
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
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
        return <td key={col.key}>{data.MobilePhone}</td>;
      }
    },
    {
      key: "amount",
      header: "Amount",
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
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
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
        return <td key={col.key}>{data.DonationFund}</td>;
      }
    },
    {
      key: "remainAnonymous",
      header: "Prefer Anonymous?",
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
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
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
        return <td key={col.key}>{data.FullAddress}</td>;
      }
    },
    {
      key: "status",
      header: "Status",
      cell: (col: iTableColumn<T>, data: iSynOnlineDonation) => {
        return getStatusTd(col.key, data);
      }
    }
  ];

  return (
    <>
      {renderDataTable({
        columns: getColumns<iSynVDonorReceipt>()
      })}
      {getErrorDetailsPopup()}
    </>
  );
};

export default OnlineDonationListPanel;
