import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SynGeneralLedgerJournalService from '../../../services/Synergetic/Finance/SynGeneralLedgerJournalService';
import Toaster from '../../../services/Toaster';
import moment from 'moment-timezone';
import MathHelper from '../../../helper/MathHelper';
import {FlexContainer} from '../../../styles';
import UtilsService from '../../../services/UtilsService';

type iBTGLJournalInMonthPanel = {
  year: number;
  gl: iSynGeneralLedger;
}

const Wrapper = styled.div`
  margin: 1rem 0;
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

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    SynGeneralLedgerJournalService.getAll({
      where: JSON.stringify({
        GLCode: gl.GLCode,
        GLYear: year,
      }),
      perPage: '99999',
    }).then(resp => {
      if(isCanceled) return;
      setJournalMap(resp.data.reduce((map: iSumMap, journal) => {
        const month = moment(journal.GLDate).format('MMMM');
        return {
          ...map,
          // @ts-ignore
          [month]: MathHelper.add(map[month] || 0, journal.GLAmount),
        }
      }, initSumMap))
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


  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <Wrapper>
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
    </Wrapper>
  )
};

export default BTGLJournalInMonthPanel;
