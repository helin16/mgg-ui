import iSynGeneralLedger from '../../types/Synergetic/Finance/iSynGeneralLedager';
import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import BTGLJournalInMonthPanel from './components/BTGLJournalInMonthPanel';
import BTGLDetailsPanel from './components/BTGLDetailsPanel';
import BTItemCreatePopupBtn from './components/BTItemCreatePopupBtn';
import BTItemBulkCreatePopupBtn from './components/BTItemBulkCreatePopupBtn';
import MathHelper from '../../helper/MathHelper';
import BTGLJournalListPanel from './components/BTGLJournalListPanel';
import iBTLockDown from '../../types/BudgetTacker/iBTLockDown';
import BTLockDownService from '../../services/BudgetTracker/BTLockDownService';
import moment from 'moment-timezone';
import Toaster from '../../services/Toaster';
import LoadingBtn from '../../components/common/LoadingBtn';
import AuthService from '../../services/AuthService';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../types/modules/iModuleUser';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';

type iGLDetailsPage = {
  gl: iSynGeneralLedger;
  selectedYear: number;
  onNavBack: () => void;
}

// Mirrors canShowDeleteForSelectedItems in BTGLDetailsPanel.tsx: a small pure gate so the
// visibility rule for the New Item / Bulk Create Items options is unit-testable on its own.
// An exempt user (Budget Tracker Admin or Exception member) keeps the create options even
// on a locked-down budget year.
export const canShowCreateOptions = ({
  isDisabled,
  isExempt,
}: {
  isDisabled: boolean;
  isExempt: boolean;
}): boolean => !isDisabled || isExempt;

// Whether the budget-item list must be forced read-only on a locked-down year.
// Admin users keep editing on any year; Exception users keep editing only when the
// viewed year is the budget year (current calendar year + 1). Everyone else, and
// Exception users on any other locked year, get the read-only clamp.
export const getItemListReadOnly = ({
  isDisabled,
  isAdmin,
  isException,
  showingYear,
  budgetYear,
}: {
  isDisabled: boolean;
  isAdmin: boolean;
  isException: boolean;
  showingYear: number;
  budgetYear: number;
}): boolean =>
  isDisabled && !(isAdmin || (isException && showingYear === budgetYear));

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
  const [isExempt, setIsExempt] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isException, setIsException] = useState(false);
  const [isCheckingExempt, setIsCheckingExempt] = useState(true);

  const [lockDown, setLockDown] = useState<iBTLockDown | null>(null);


  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    setIsCheckingExempt(true);
    Promise.all([
      BTLockDownService.getAll({
        where: JSON.stringify({
          year: showingYear,
        }),
      }),
      AuthService.canAccessModule(MGGS_MODULE_ID_BUDGET_TRACKER)
        .then(resp => {
          if (isCanceled) return;
          const admin = resp[ROLE_ID_ADMIN]?.canAccess === true;
          const exception = resp[ROLE_ID_NORMAL]?.canAccess === true;
          setIsAdmin(admin);
          setIsException(exception);
          setIsExempt(admin || exception);
        })
        .catch(err => {
          if (isCanceled) return;
          setIsAdmin(false);
          setIsException(false);
          setIsExempt(false);
          Toaster.showApiError(err);
        })
        .finally(() => {
          if (isCanceled) return;
          setIsCheckingExempt(false);
        }),
    ]).then(([resp]) => {
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


  const budgetYear = moment().year() + 1;
  const itemListReadOnly = getItemListReadOnly({
    isDisabled,
    isAdmin,
    isException,
    showingYear,
    budgetYear,
  });

  const getContent = () => {
    if (showingJournals) {
      return <BTGLJournalListPanel gl={gl} year={showingYear} onYearChange={(year) => setShowingYear(year)}/>;
    }
    // Don't render the item list until lockdown + admin/exception status are known, so an
    // exempt user is never briefly shown a read-only list (and vice versa) - FR-006.
    if (isLoading || isCheckingExempt) {
      return <PageLoadingSpinner />;
    }
    return (
      <BTGLDetailsPanel
        gl={gl}
        showingYear={showingYear}
        onChangeYear={(year) => setShowingYear(year || selectedYear)}
        lockDown={lockDown || undefined}
        isReadOnly={itemListReadOnly}
        forceReloadCount={count}
      />
    )
  }

  const getOptionsPanel = () => {
    // Don't flash the create options while lockdown / exempt status is still resolving.
    if (isLoading || isCheckingExempt) {
      return null;
    }
    if (!canShowCreateOptions({isDisabled, isExempt})) {
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
          <BTItemBulkCreatePopupBtn
            onItemsSaved={() => setCount(MathHelper.add(count, 1))}
            gl={gl}
            forYear={showingYear}
          >
            <Button variant={'outline-primary'} size={'sm'} style={{width: '100%'}}>
              <Icons.Upload /> Bulk Create Items
            </Button>
          </BTItemBulkCreatePopupBtn>
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
