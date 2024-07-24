import iSynDebtorPaymentMethod from '../../../../types/Synergetic/Finance/iSynDebtorPaymentMethod';
import Table, {iTableColumn} from '../../../../components/common/Table';
import {useEffect, useState} from 'react';
import iSynVDebtor from '../../../../types/Synergetic/Finance/iSynVDebtor';
import SynVDebtorService from '../../../../services/Synergetic/Finance/SynVDebtorService';
import * as _ from 'lodash';
import Toaster from '../../../../services/Toaster';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import {Table as BTable, Button} from 'react-bootstrap';
import PopupModal from '../../../../components/common/PopupModal';

type iExpiringCreditCardsTable = {
  data: iSynDebtorPaymentMethod[];
}


const ExpiringCreditCardsTable = ({data}: iExpiringCreditCardsTable) => {
  const [debtorMap, setDebtorMap] = useState<{[key: string]: iSynVDebtor}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showingDebtor, setShowingDebtor] = useState<iSynVDebtor | null>(null);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    SynVDebtorService.getAll({
      where: JSON.stringify({
        DebtorID: _.uniq(data.map(row => row.DebtorID).filter(id => `${id}`.trim() !== '')),
      }),
      perPage: 99999,
    }).then(resp => {
      if (isCanceled) { return }
      setDebtorMap((resp.data || []).reduce((map, row) => ({...map, [`${row.DebtorID}`]: row}), {}))
    }).catch(err => {
      if (isCanceled) { return }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) { return }
      setIsLoading(false);
    })

    return () => {
      isCanceled = true;
    }
  }, [data])

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: 'Debtor',
      header: 'Debtor',
      cell: (column: iTableColumn<T>, data: iSynDebtorPaymentMethod) => {
        return <td key={column.key}>
          {`${data.DebtorID}` in debtorMap ?
            <Button size={'sm'} variant={'link'} onClick={() => setShowingDebtor(debtorMap[`${data.DebtorID}`])}>
              {debtorMap[`${data.DebtorID}`].DebtorNameExternal} [{data.DebtorID}]
            </Button> : null }
        </td>
      }
    },
    {
      key: 'ccType',
      header: 'CC Type',
      cell: (column: iTableColumn<T>, data: iSynDebtorPaymentMethod) => {
        return <td key={column.key}>{data.CreditCardType}</td>
      }
    },
    {
      key: 'ccNumber',
      header: 'CC No.',
      cell: (column: iTableColumn<T>, data: iSynDebtorPaymentMethod) => {
        return <td key={column.key}>*******{data.CreditCardNumber}</td>
      }
    },
    {
      key: 'ccExpiry',
      header: 'CC Expiry',
      cell: (column: iTableColumn<T>, data: iSynDebtorPaymentMethod) => {
        return <td key={column.key}>{data.CreditCardExpiryYear} - {data.CreditCardExpiryMonth}</td>
      }
    }
  ];

  const getPopup = () => {
    if(!showingDebtor) {
      return null;
    }
    return (
      <PopupModal
        dialogClassName={'sm'}
        show={true}
        handleClose={() => setShowingDebtor(null)}
        title={`Debtor: ${showingDebtor.DebtorNameExternal}`}
      >
        <BTable striped>
          <tbody>
            <tr>
              <td><b>Home Phone: </b></td><td>{showingDebtor.DebtorHomePhone}</td>
            </tr>
            <tr>
              <td><b>Work Phone: </b></td><td>{showingDebtor.DebtorOccupPhone}</td>
            </tr>
            <tr>
              <td><b>Mobile: </b></td><td>{showingDebtor.DebtorMobilePhone}</td>
            </tr>
            <tr>
              <td><b>Home Email: </b></td><td><a href={`mailto:${showingDebtor.DebtorHomeEmail}`}>{showingDebtor.DebtorHomeEmail}</a></td>
            </tr>
            <tr>
              <td><b>Occup. Email: </b></td><td><a href={`mailto:${showingDebtor.DebtorOccupEmail}`}>{showingDebtor.DebtorOccupEmail}</a></td>
            </tr>
            <tr>
              <td><b>Comments: </b></td><td>{showingDebtor.DebtorComment}</td>
            </tr>
          </tbody>
        </BTable>
      </PopupModal>
    )
  }

  if (isLoading === true) {
    return <PageLoadingSpinner />
  }

  return (
    <>
      <Table columns={getColumns<iSynDebtorPaymentMethod>()} rows={data} hover striped />
      {getPopup()}
    </>
  )
}

export default ExpiringCreditCardsTable;
