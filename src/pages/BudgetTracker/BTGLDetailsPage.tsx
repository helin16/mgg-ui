import iSynGeneralLedger from '../../types/Synergetic/Finance/iSynGeneralLedager';
import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import BTGLJournalInMonthPanel from './components/BTGLJournalInMonthPanel';
import BTGLDetailsPanel from './components/BTGLDetailsPanel';
import BTItemCreatePopupBtn from './components/BTItemCreatePopupBtn';
import MathHelper from '../../helper/MathHelper';
import BTGLJournalListPanel from './components/BTGLJournalListPanel';
import iBTLockDown from '../../types/BudgetTacker/iBTLockDown';
import BTLockDownService from '../../services/BudgetTracker/BTLockDownService';
import moment from 'moment-timezone';
import Toaster from '../../services/Toaster';
import LoadingBtn from '../../components/common/LoadingBtn';

type iGLDetailsPage = {
  gl: iSynGeneralLedger;
  selectedYear: number;
  onNavBack: () => void;
}
const Wrapper = styled.div`
  .panel-wrapper {
    margin-bottom: 1rem;
  }
`
const BTGLDetailsPage = ({gl, selectedYear, onNavBack}: iGLDetailsPage) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showingYear, setShowingYear] = useState(selectedYear);
  const [showingJournals, setShowingJournals] = useState(false);
  const [count, setCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const [lockDown, setLockDown] = useState<iBTLockDown | null>(null);


  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    BTLockDownService.getAll({
      where: JSON.stringify({
        year: showingYear,
      }),
    }).then(resp => {
      if (isCanceled) return;
      let currentLockDowns = (resp || []);
      // trying to check whether the current year is passed
      if (currentLockDowns.length <= 0 && moment().year() >= showingYear) {
        // @ts-ignore
        currentLockDowns = [{year: showingYear, lockdown: moment(`${MathHelper.sub(showingYear, 1)}-12-31T23:59:59`).toISOString()}]
      }
      setLockDown(currentLockDowns.length > 0 ? currentLockDowns[0] : null);
      setIsDisabled(currentLockDowns.filter(lock => moment().isAfter(moment(lock.lockdown))).length > 0);
    }).catch(err => {
      if (isCanceled) return;
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) return;
      setIsLoading(false);
    });

    return () => {
      isCanceled = true;
    }
  }, [gl.GLCode, showingYear]);

  const getNavBtn = () => {
    if (showingJournals) {
      return (
        <LoadingBtn variant={'primary'} size={'sm'} onClick={() => setShowingJournals(false)} isLoading={isLoading}>
          <Icons.Clipboard /> GL Details in {showingYear}
        </LoadingBtn>
      )
    }

    return (
      <LoadingBtn variant={'primary'} size={'sm'} onClick={() => setShowingJournals(true)} isLoading={isLoading}>
        <Icons.List /> Journals in {showingYear}
      </LoadingBtn>
    )
  }


  const getContent = () => {
    if (showingJournals) {
      return <BTGLJournalListPanel gl={gl} year={showingYear} onYearChange={(year) => setShowingYear(year)}/>;
    }
    return (
      <BTGLDetailsPanel
        gl={gl}
        showingYear={showingYear}
        onChangeYear={(year) => setShowingYear(year || selectedYear)}
        lockDown={lockDown || undefined}
        isReadOnly={isDisabled}
        forceReloadCount={count}
      />
    )
  }

  const getOptionsPanel = () => {
    if (isDisabled) {
      return null;
    }
    return (
      <div className={'panel-wrapper'}>
        <h3>Options</h3>
        <div className={'d-grid gap-2'}>
          <BTItemCreatePopupBtn
            btItem={{}}
            onItemSaved={() => setCount(MathHelper.add(count, 1))}
            gl={gl}
            forYear={showingYear}
          >
            <Button variant={'success'} size={'sm'} style={{width: '100%'}}>
              <Icons.Plus /> New Item
            </Button>
          </BTItemCreatePopupBtn>
        </div>
      </div>
    )
  }

  return (
    <Wrapper>
      <Row>
        <Col sm={9}>
          {getContent()}
        </Col>
        <Col sm={3}>
          <div className={'panel-wrapper'}>
            <h3>Navigation</h3>
            <div className={'d-grid gap-2'}>
              <Button variant={'danger'} size={'sm'} onClick={() => onNavBack()}>
                <Icons.ArrowLeft /> GL List
              </Button>
              {getNavBtn()}
            </div>
          </div>

          {getOptionsPanel()}
          <BTGLJournalInMonthPanel year={showingYear} gl={gl} />
        </Col>
      </Row>
    </Wrapper>
  )
}

export default BTGLDetailsPage;
