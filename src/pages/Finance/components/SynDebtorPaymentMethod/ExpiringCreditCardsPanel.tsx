import ExplanationPanel from '../../../../components/ExplanationPanel';
import {useCallback} from 'react';
import iSynDebtorPaymentMethod from '../../../../types/Synergetic/Finance/iSynDebtorPaymentMethod';
import SynDebtorPaymentMethodService from '../../../../services/Synergetic/Finance/SynDebtorPaymentMethodService';
import {OP_AND, OP_LT, OP_LTE, OP_NOT, OP_OR} from '../../../../helper/ServiceHelper';
import moment from 'moment-timezone';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import useListCrudHook from '../../../../components/hooks/useListCrudHook/useListCrudHook';
import {iConfigParams} from '../../../../services/AppService';
import ExpiringCreditCardsTable from './ExpiringCreditCardsTable';


const ExpiringCreditCardsPanel = () => {
  const getNextMonth = () => {
    return moment().add(1, 'month');
  };

  const {
    state,
  // @ts-ignore
  } = useListCrudHook<iSynDebtorPaymentMethod>({
    paginationApplied: true,
    getFn: useCallback((config?: iConfigParams) => {
      const nextMonth = getNextMonth();
      const where = config ? JSON.parse(config?.where || '{}') : {};
      return SynDebtorPaymentMethodService.getAllCurrent({
        ...config,
        perPage: 99999,
        sort: 'CreditCardExpiryYear:DESC,CreditCardExpiryMonth:DESC',
        where: JSON.stringify({
          ...where,
          CreditCardNumber: {[OP_NOT]: ''},
          [OP_AND]: [
            {[OP_OR]: [
                {CreditCardExpiryYear: {[OP_LT]: nextMonth.year()}},
                {
                  CreditCardExpiryYear: nextMonth.year(),
                  CreditCardExpiryMonth: {[OP_LTE]: nextMonth.month()},
                }
            ]}
          ],
        }),
      })
    }, []),
  });


  const getContent = () => {
    if (state.isLoading) {
      return <PageLoadingSpinner />
    }
    if (state.data.length <= 0) {
      return null;
    }
    return <ExpiringCreditCardsTable data={state.data} />;
  }

  return (
    <>
      <h6>{(state.data || []).length} Expiring Credit Card (s)</h6>
      <ExplanationPanel
        text={
          <>List of all <b>CURRENT</b> debtors with credit cards that <u>have expired</u> or <u>about to expire</u> in <b>{getNextMonth().format('MMMM YYYY')}</b>.</>
        }
      />
      {getContent()}
    </>
  )
}

export default ExpiringCreditCardsPanel;
