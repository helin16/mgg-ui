import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import SynGeneralLedgerService from '../../../services/Synergetic/Finance/SynGeneralLedgerService';
import Toaster from '../../../services/Toaster';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import IPaginatedResult from '../../../types/iPaginatedResult';
import PanelTitle from '../../../components/PanelTitle';
import {FlexContainer} from '../../../styles';
import {lightBlue} from '../../../AppWrapper';
import BTGLTable from './BTGLTable';
import FileYearSelector from '../../../components/student/FileYearSelector';
import moment from 'moment-timezone';
import ModuleAdminBtn from '../../../components/module/ModuleAdminBtn';
import {MODULE_ID_BUDGET_TRACKER} from '../../../types/modules/iModuleUser';
import {BT_ADMIN_OPTION_USERS, iBTAdminOptions} from './admin/BTAdminOptionsPanel';

type iBTGLListPanel = {
  selectedYear: number;
  onChangeYear: (newYear: number) => void;
  onSelectGL: (gl: iSynGeneralLedger) => void;
  setShowingAdminPageModule?: (moduleName: iBTAdminOptions | null) => void;
}

const Wrapper = styled.div`
  .options {
    width: 180px;
  }
  .title-options {
    width: 280px;
  }
  .content-wrapper {
    margin: 0.8rem 0px;
    
    .gl-table {
      .currency-col {
        width: 120px;
        text-align: right;
      }
      .future-col {
        background-color: ${lightBlue};
      }
      thead {
        th:not(:first-child) {
          text-align: right;
        }
      }
    }
  }
`;

const BTGLListPanel = ({ selectedYear, onChangeYear, onSelectGL, setShowingAdminPageModule}: iBTGLListPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [glCodesResults, setGlCodesResults] = useState<IPaginatedResult<iSynGeneralLedger> | null>(null);
  const [hideZeroBalance, setHideZeroBalance] = useState(false);
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    SynGeneralLedgerService.getAll({
      where: JSON.stringify({
        GLYear: selectedYear,
      }),
      perPage: '9999'
    }).then(resp => {
      if (isCanceled) return;
      setGlCodesResults(resp);
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
  }, [selectedYear]);


  return (
    <Wrapper>
      <FlexContainer className={'justify-content space-between align-items end'}>
        <h3>Budget Tracker</h3>
        <FlexContainer className={'options justify-content space-between  align-items center'}>
          <div>
            <ModuleAdminBtn
              size={'sm'}
              moduleId={MODULE_ID_BUDGET_TRACKER}
              className={'admin-btn'}
              onClick={() => setShowingAdminPageModule && setShowingAdminPageModule(BT_ADMIN_OPTION_USERS)}
            />
          </div>
          <FileYearSelector
            value={selectedYear}
            className={'year-selector'}
            min={moment().subtract('5', 'year').year()}
            onSelect={(newYear) => onChangeYear(newYear || moment().year()) } />
        </FlexContainer>
      </FlexContainer>
      <PanelTitle>
        <FlexContainer className={'with-gap justify-content space-between'}>
          <div>General Ledger Codes</div>
          <FlexContainer className={'justify-content space-between title-options'}>
            <label>
              <input type={'checkbox'} checked={hideZeroBalance} onChange={(event) => {
                setHideZeroBalance(event.target.checked);
              }} /> {' '} Hide Zero Balance
            </label>
            <label>
              <input type={'checkbox'} checked={showPendingOnly} onChange={(event) => {
                setShowPendingOnly(event.target.checked);
              }} /> {' '} Show Pending Only
            </label>
          </FlexContainer>
        </FlexContainer>
      </PanelTitle>
      <div className={'content-wrapper'}>
        {
          isLoading ? <PageLoadingSpinner /> :
          <BTGLTable
            selectedYear={selectedYear}
            glCodesResults={glCodesResults}
            hideZeroBalance={hideZeroBalance}
            showPendingOnly={showPendingOnly}
            onSelectGL={onSelectGL}
          />
        }
      </div>
    </Wrapper>
  )
}

export default BTGLListPanel;
