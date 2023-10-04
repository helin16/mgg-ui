import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import {Alert, Spinner} from 'react-bootstrap';
import SynGeneralLedgerJournalService from '../../../services/Synergetic/Finance/SynGeneralLedgerJournalService';
import Toaster from '../../../services/Toaster';
import moment from 'moment-timezone';
import MathHelper from '../../../helper/MathHelper';
import {FlexContainer} from '../../../styles';
import UtilsService from '../../../services/UtilsService';
import SynGeneralLedgerMonthlyBudgetService
  from '../../../services/Synergetic/Finance/SynGeneralLedgerMonthlyBudgetService';

type iBTGLJournalInMonthPanel = {
  year: number;
  gl: iSynGeneralLedger;
}

const Wrapper = styled.div`
  margin: 1rem 0;
  .summary-row {
    font-weight: bold;
    border-top: 1px #ccc solid;
    margin-top: 0.3rem;
    padding-top: 0.3rem;
  }
`;

type iSumMap = {
  January: number;
  February: number;
  March: number;
  April: number;
  May: number;
  June: number;
  July: number;
  August: number;
  September: number;
  October: number;
  November: number;
  December: number;
};

const initSumMap: iSumMap = {
  January: 0,
  February: 0,
  March: 0,
  April: 0,
  May: 0,
  June: 0,
  July: 0,
  August: 0,
  September: 0,
  October: 0,
  November: 0,
  December: 0,
};
const BTGLJournalInMonthPanel = ({year, gl}: iBTGLJournalInMonthPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [journalMap, setJournalMap] = useState<iSumMap>(initSumMap);
  const [actualBudget, setActualBudget] = useState<number | null>(null);
  const [yearToDateJournalTotal, setYearToDateJournalTotal] = useState(0);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);

    Promise.all([
      SynGeneralLedgerJournalService.getAll({
        where: JSON.stringify({
          GLCode: gl.GLCode,
          GLYear: year,
        }),
        perPage: '99999',
      }),
      SynGeneralLedgerMonthlyBudgetService.getAllByYearAndGLCode(year, gl.GLCode)
    ])
    .then(resp => {
      if(isCanceled) return;

      const jMap = resp[0].data.reduce((map: iSumMap, journal) => {
        const month = moment(journal.GLDate).format('MMMM');
        // @ts-ignore
        const subTotal = MathHelper.add(map[month] || 0, journal.GLAmount);
        return {
          ...map,
          [month]: subTotal,
        }
      }, initSumMap);
      setJournalMap(jMap)
      if ((resp[1] || []).length > 0) {
        setActualBudget((resp[1] || []).reduce((sum, record) => {
          return MathHelper.add(sum, Number(record.Budget1 || 0));
        }, 0))
      } else {
        setActualBudget(null);
      }

      setYearToDateJournalTotal(Object.values(jMap).reduce((sum, subTotal) => MathHelper.add(sum, subTotal), 0));
    }).catch(err => {
      if(isCanceled) return;
      Toaster.showApiError(err)
    }).finally(() => {
      if(isCanceled) return;
      setIsLoading(false);
    })

    return () => {
      isCanceled = true;
    }
  }, [year, gl])


  const getBudgetPanel = () => {
    if (actualBudget === null) {
      return null;
    }

    return (
      <>
        <h4>Actual Budget</h4>
        <Alert variant={'success'} className={'text-center'}>
          <h4>{UtilsService.formatIntoCurrency(actualBudget)}</h4>
          <small>Budget approved in Synergetic</small>
        </Alert>
      </>
    )
  }


  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <Wrapper>
      {getBudgetPanel()}
      <h4>Actual Spent in {year}</h4>
      {
        Object.keys(journalMap).map((month: string) => {
          return (
            <FlexContainer className={'full-width justify-content space-between'} key={month}>
              <div>{month}</div>
              {/* @ts-ignore*/}
              <div>{UtilsService.formatIntoCurrency(journalMap[month] || 0)}</div>
            </FlexContainer>
          )
        })
      }
      <FlexContainer className={'full-width justify-content space-between summary-row'}>
        <div><b>Total</b></div>
        <div>{UtilsService.formatIntoCurrency(yearToDateJournalTotal)}</div>
      </FlexContainer>
    </Wrapper>
  )
};

export default BTGLJournalInMonthPanel;
