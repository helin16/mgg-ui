import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import {Spinner, Table} from 'react-bootstrap';
import SynGeneralLedgerJournalService from '../../../services/Synergetic/Finance/SynGeneralLedgerJournalService';
import Toaster from '../../../services/Toaster';
import moment from 'moment-timezone';
import UtilsService from '../../../services/UtilsService';
import iSynGeneralLedgerJournal from '../../../types/Synergetic/Finance/iSynGeneralLedagerJournal';
import FileYearSelector from '../../../components/student/FileYearSelector';
import ExplanationPanel from '../../../components/ExplanationPanel';

type iBTGLJournalListPanel = {
  year: number;
  gl: iSynGeneralLedger;
  onYearChange: (year: number) => void;
}

const Wrapper = styled.div`
  margin: 1rem 0;
  
  .year-selector-wrapper {
    display: inline-block;
    font-size: 12px;
    margin-right: 0.6rem;
  }
`;

const BTGLJournalListPanel = ({year, gl, onYearChange}: iBTGLJournalListPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [journals, setJournals] = useState<iSynGeneralLedgerJournal[]>([]);

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
      setJournals(resp.data)
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
      <h4>
        <span className={'year-selector-wrapper'}>
          <FileYearSelector
            value={year}
            max={moment().add(1, 'year').year()}
            min={moment().subtract(5, 'year').year()}
            onSelect={(newYear) => onYearChange(newYear || year)}
          />
        </span>
        <span>
          Journals for: {gl.GLCode} - {gl.GLDescription}
        </span>
      </h4>
      <ExplanationPanel text={'All information displayed below are directly from synergetic finance module.'} />
      <Table size={'sm'} striped hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th className={'text-right'}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {
            journals.sort((j1, j2) => moment(j1.GLDate).isAfter(moment(j2.GLDate)) ? -1 : 1)
              .map((journal) => {
              return (
                <tr  key={journal.GLJournalSeq}>
                  <td>{moment(journal.GLDate).format('DD/MM/YYYY')}</td>
                  <td>{journal.JournalDescription}</td>
                  <td className={'text-right'}>{UtilsService.formatIntoCurrency(journal.GLAmount)}</td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    </Wrapper>
  )
};

export default BTGLJournalListPanel;
