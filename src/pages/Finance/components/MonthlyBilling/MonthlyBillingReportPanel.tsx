import styled from "styled-components";
import ExplanationPanel from "../../../../components/ExplanationPanel";
import MonthlyBillingSearchPanel, {
  iSearchCriteria
} from "./MonthlyBillingSearchPanel";
import { useState } from "react";
import iSynDebtorTransaction from "../../../../types/Synergetic/Finance/iSynDebtorTransaction";
import SynDebtorTransactionService from "../../../../services/Synergetic/Finance/SynDebtorTransactionService";
import { OP_BETWEEN } from "../../../../helper/ServiceHelper";
import Toaster from "../../../../services/Toaster";
import Table, { iTableColumn } from "../../../../components/common/Table";
import moment from "moment-timezone";
import iSynVDebtor, {
  SYN_DEBTOR_STATEMENT_GROUP_MONTHLY
} from "../../../../types/Synergetic/Finance/iSynVDebtor";
import * as _ from "lodash";
import SynVDebtorService from "../../../../services/Synergetic/Finance/SynVDebtorService";
import CSVExportFromHtmlTableBtn from "../../../../components/form/CSVExportFromHtmlTableBtn";
import SynVDebtorFeeService from "../../../../services/Synergetic/Finance/SynVDebtorFeeService";
import { FlexContainer } from "../../../../styles";

const Wrapper = styled.div``;
type iDebtorMap = { [key: number]: iSynVDebtor };
const MonthlyBillingReportPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionList, setTransactionList] = useState<
    iSynDebtorTransaction[] | null
  >(null);

  const getDebtorMap = async () => {
    const result = await SynVDebtorService.getAll({
      where: JSON.stringify({
        DebtorStatementGroup: SYN_DEBTOR_STATEMENT_GROUP_MONTHLY
      }),
      perPage: 99999
    });
    return (result.data || []).reduce((map: iDebtorMap, iSynVDebtor) => {
      return {
        ...map,
        [iSynVDebtor.DebtorID]: iSynVDebtor
      };
    }, {});
  };

  const getFeeCodes = async (criteria: iSearchCriteria) => {
    const categoryCodes = criteria.debtorFeeCategoryCodes || [];
    const result = await SynVDebtorFeeService.getAll({
      perPage: 999999,
      ...(categoryCodes.length <= 0
        ? {}
        : {
            where: JSON.stringify({
              FeeCategoryCode: categoryCodes
            })
          })
    });
    return (result.data || []).map(fee => fee.FeeCode);
  };

  const getData = async (criteria: iSearchCriteria) => {
    const debtorMap = await getDebtorMap();
    const feeCodes = await getFeeCodes(criteria);
    const result = await Promise.all(
      _.chunk(Object.keys(debtorMap), 100).map(ids =>
        SynDebtorTransactionService.getAll({
          where: JSON.stringify({
            DebtorID: ids,
            FeeCode: feeCodes,
            TransactionDate: {
              [OP_BETWEEN]: [criteria.dates.start, criteria.dates.end]
            }
          }),
          perPage: 999999999
        })
      )
    );

    return _.uniqBy(
      result.reduce((arr: iSynDebtorTransaction[], res) => {
        return [...arr, ...res.data];
      }, []),
      tran => tran.TransactionSeq
    ).map(trans => ({
      ...trans,
      SynVDebtor: trans.DebtorID in debtorMap ? debtorMap[trans.DebtorID] : null
    }));
  };

  const doSearch = (criteria: iSearchCriteria) => {
    setIsLoading(true);
    getData(criteria)
      .then(resp => {
        setTransactionList(resp);
      })
      .catch(err => {
        Toaster.showToast(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getResultTable = <T,>() => {
    if (transactionList === null) {
      return null;
    }
    const tableHtmlId = `sl-${moment().unix()}-${Math.random()}`;
    return (
      <>
        <FlexContainer
          className={"justify-content-between space-above align-items-end"}
        >
          <div>
            <b>Total transactions found: {transactionList.length}</b>
          </div>
          <CSVExportFromHtmlTableBtn
            size={"sm"}
            variant={"secondary"}
            tableHtmlId={tableHtmlId}
            fileName={`monthly_billing_${moment().format(
              "YYYY_MM_DD_HH_mm_ss"
            )}.xlsx`}
          />
        </FlexContainer>
        <Table
          id={tableHtmlId}
          rows={transactionList}
          responsive
          hover
          striped
          columns={[
            {
              key: "debtor",
              header: "DebtorName and ID",
              cell: (column: iTableColumn<T>, data) => {
                return (
                  <td key={column.key}>
                    {data.SynVDebtor?.DebtorMailName} - {data.DebtorID}
                  </td>
                );
              }
            },
            {
              key: "debtorStatementGroup",
              header: "Debtor Statement Group",
              cell: (column: iTableColumn<T>, data) => {
                return (
                  <td key={column.key}>
                    {data.SynVDebtor?.DebtorStatementGroup}
                  </td>
                );
              }
            },
            {
              key: "TransactionSeq",
              header: "Transaction Seq",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.TransactionSeq}</td>;
              }
            },
            {
              key: "DebtorID",
              header: "Debtor ID",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.DebtorID}</td>;
              }
            },
            {
              key: "DebtorStudentID",
              header: "Debtor Student ID",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.DebtorStudentID}</td>;
              }
            },
            {
              key: "StudentID",
              header: "Student ID",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.StudentID}</td>;
              }
            },
            {
              key: "PostingNumber",
              header: "Posting Number",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.PostingNumber}</td>;
              }
            },
            {
              key: "PostingSource",
              header: "Posting Source",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.PostingSource}</td>;
              }
            },
            {
              key: "InstalmentSeq",
              header: "Instalment Seq",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.InstalmentSeq}</td>;
              }
            },
            {
              key: "InstalmentsRemaining",
              header: "Instalments Remaining",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.InstalmentsRemaining}</td>;
              }
            },
            {
              key: "StatementNumber",
              header: "Statement Number",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.StatementNumber}</td>;
              }
            },
            {
              key: "ReceiptNumber",
              header: "Receipt Number",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.ReceiptNumber}</td>;
              }
            },
            {
              key: "FeeCode",
              header: "Fee Code",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.FeeCode}</td>;
              }
            },
            {
              key: "TransactionDate",
              header: "Transaction Date",
              cell: (column: iTableColumn<T>, data) => {
                return (
                  <td key={column.key}>
                    {data.TransactionDate.replace("T00:00:00.000Z", "")}
                  </td>
                );
              }
            },
            {
              key: "TransactionAmount",
              header: "Transaction Amount",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.TransactionAmount}</td>;
              }
            },
            {
              key: "TransactionDescription",
              header: "Transaction Description",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.TransactionDescription}</td>;
              }
            },
            {
              key: "AllocatedAmount",
              header: "Allocated Amount",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.AllocatedAmount}</td>;
              }
            },
            {
              key: "FeeUnits",
              header: "Fee Units",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.FeeUnits}</td>;
              }
            },
            {
              key: "FeeRate",
              header: "Fee Rate",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.FeeRate}</td>;
              }
            },
            {
              key: "SaleInvoiceNumber",
              header: "Sales Invoice Number",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.SaleInvoiceNumber}</td>;
              }
            },
            {
              key: "CreditorPostingNumber",
              header: "Creditor Posting Number",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.CreditorPostingNumber}</td>;
              }
            },
            {
              key: "CreditorTransactionSeq",
              header: "Creditor Transaction Seq",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.CreditorTransactionSeq}</td>;
              }
            },
            {
              key: "CreditorGLJournalSeq",
              header: "Creditor GL Journal Seq",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.CreditorGLJournalSeq}</td>;
              }
            },
            {
              key: "StudentCourseChargesSeq",
              header: "Student Course Charges Seq",
              cell: (column: iTableColumn<T>, data) => {
                return <td key={column.key}>{data.StudentCourseChargesSeq}</td>;
              }
            },
            {
              key: "CreatedDate",
              header: "Created Date",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return (
                  <td key={column.key}>
                    {moment(data.CreatedDate)
                      .utc()
                      .format("YYYY-MM-DD")}
                  </td>
                );
              }
            },
            {
              key: "CreatedById",
              header: "Created By",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return <td key={column.key}>{data.CreatedByID}</td>;
              }
            },
            {
              key: "ModifiedDate",
              header: "Modified Date",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return (
                  <td key={column.key}>
                    {moment(data.ModifiedDate)
                      .utc()
                      .format("YYYY-MM-DD")}
                  </td>
                );
              }
            },
            {
              key: "ModifiedBy",
              header: "Modified By",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return <td key={column.key}>{data.ModifiedByID}</td>;
              }
            },
            {
              key: "ObjectLoansSeqOverdueCharge",
              header: "Object Loans Seq Overdue Charge",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return (
                  <td key={column.key}>{data.ObjectLoansSeqOverdueCharge}</td>
                );
              }
            },
            {
              key: "ObjectLoansSeqOverdueReversal",
              header: "Object Loans Seq Overdue Reversal",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return (
                  <td key={column.key}>{data.ObjectLoansSeqOverdueReversal}</td>
                );
              }
            },
            {
              key: "DebtorName",
              header: "Debtor Name",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return (
                  <td key={column.key}>{data.SynVDebtor?.DebtorMailName}</td>
                );
              }
            },
            {
              key: "Surname",
              header: "Surname",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return (
                  <td key={column.key}>{data.SynVDebtor?.DebtorSurname}</td>
                );
              }
            },
            {
              key: "Given1",
              header: "Given1",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return (
                  <td key={column.key}>{data.SynVDebtor?.DebtorGiven1}</td>
                );
              }
            },
            {
              key: "Preferred",
              header: "Preferred",
              cell: (column: iTableColumn<T>, data: iSynDebtorTransaction) => {
                return (
                  <td key={column.key}>{data.SynVDebtor?.DebtorPreferred}</td>
                );
              }
            }
          ]}
        />
      </>
    );
  };

  return (
    <Wrapper>
      <ExplanationPanel
        text={
          <>
            This report is designed to reduce Raw Data for the Monthly Billing
            Report. It will ONLY fetch all transaction related to Debtors in
            Group: <b>{SYN_DEBTOR_STATEMENT_GROUP_MONTHLY}</b>
          </>
        }
      />
      <MonthlyBillingSearchPanel onSearch={doSearch} isLoading={isLoading} />
      {getResultTable<iSynDebtorTransaction>()}
    </Wrapper>
  );
};

export default MonthlyBillingReportPanel;
