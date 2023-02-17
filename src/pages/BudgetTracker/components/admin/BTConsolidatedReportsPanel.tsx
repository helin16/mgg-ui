import styled from 'styled-components';
import ExplanationPanel from '../../../../components/ExplanationPanel';
import {useEffect, useState} from 'react';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import {Button, Table} from 'react-bootstrap';
import MathHelper from '../../../../helper/MathHelper';
import moment from 'moment-timezone';
import iSynGeneralLedger from '../../../../types/Synergetic/Finance/iSynGeneralLedager';
import Toaster from '../../../../services/Toaster';
import SynGeneralLedgerService from '../../../../services/Synergetic/Finance/SynGeneralLedgerService';
import {FlexContainer} from '../../../../styles';
import * as Icons from 'react-bootstrap-icons';
import UtilsService from '../../../../services/UtilsService';
import BTItemService from '../../../../services/BudgetTracker/BTItemService';

const Wrapper = styled.div`
  .currency-col {
    text-align: right;
  }
  .current-year {
    background-color: #d9edf7;
  }
`;

type iSumMap = {[key: string]: {[key: number]: number}};
type iGLMap = {[key: string]: iSynGeneralLedger[]}
const BTConsolidatedReportsPanel = () => {
  const currentYear = moment().year();
  const [isLoading, setIsLoading] = useState(false);
  const [showingYear, setShowingYear] = useState(currentYear);
  const [showingPreviousYear, setShowingPreviousYear] = useState(MathHelper.sub(currentYear, 1));
  const [showingNextYear, setShowingNextYear] = useState(MathHelper.add(currentYear, 1));
  const [glmap, setGlmap] = useState<iGLMap>({});
  const [requestedSumMap, setRequestedSumMap] = useState<iSumMap>({});
  const [approvedSumMap, setApprovedSumMap] = useState<iSumMap>({});

  useEffect(() => {
    setShowingPreviousYear(MathHelper.sub(showingYear, 1));
    setShowingNextYear(MathHelper.add(showingYear, 1));
    const showingYears = [MathHelper.sub(showingYear, 1), showingYear, MathHelper.add(showingYear, 1)];
    let isCanceled = false;
    const fetchData = async () => {
      setIsLoading(true);
      try{
        const generalLedgers = await SynGeneralLedgerService.getAll({
          where: JSON.stringify({
            ActiveFlag: true,
            GLYear: showingYears,
          }),
          perPage: '99999',
          sort: 'GLCode:ASC'
        });

        if (isCanceled) return;
        const glMapObj = generalLedgers.data.reduce((map: iGLMap, gl) => {
          return {
            ...map,
            [gl.GLCode]: [...(map[gl.GLCode] || []), ...[gl]],
          }
        }, {});
        setGlmap(glMapObj);
        const glCodes = Object.keys(glMapObj);
        if (glCodes.length <= 0 ) return;

        const btItems = await BTItemService.getAll({
          where: JSON.stringify({
            gl_code: glCodes,
            year: showingYears
          })
        })
        if (isCanceled) return;
        setRequestedSumMap(btItems.data.reduce((map: iSumMap, btItem) => {
          const glCode = `${btItem.gl_code}`;
          const year = Number(btItem.year);
          const requestedAmt = MathHelper.mul(btItem.item_quantity || 0, btItem.item_cost || 0);
          return {
            ...map,
            [glCode]: {...map[glCode], [year]: MathHelper.add(glCode in map ? (map[glCode][year] || 0) : 0, requestedAmt)},
          }
        }, {}))
        setApprovedSumMap(btItems.data.reduce((map: iSumMap, btItem) => {
          const glCode = `${btItem.gl_code}`;
          const year = Number(btItem.year);
          const {approved} = BTItemService.getAmountByType(btItem);
          if (approved <= 0) {
            return map;
          }
          return {
            ...map,
            [glCode]: {...map[glCode], [year]: MathHelper.add(glCode in map ? (map[glCode][year] || 0) : 0, approved)},
          }
        }, {}))

        if (isCanceled) return;
        setIsLoading(false);
      } catch (err) {
        Toaster.showApiError(err);
        setIsLoading(false);
      }
    }
    fetchData();

    return () => {
      isCanceled = true;
    };
  }, [showingYear]);

  const getCurrentYearColClassName = (year: number) => {
    return `currency-col ${year === currentYear ? 'current-year': ''}`;
  }

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />
    }
    return (
      <>
        <FlexContainer className={'full-width justify-content space-between space-below'}>
          <Button variant={'secondary'} onClick={() => setShowingYear(showingPreviousYear)}>
            <Icons.ChevronLeft />{' '} previous
          </Button>
          <Button variant={'secondary'} onClick={() => setShowingYear(currentYear)}>Current Year</Button>
          <Button variant={'secondary'} onClick={() => setShowingYear(showingNextYear)}>
            next {' '}<Icons.ChevronRight />
          </Button>
        </FlexContainer>
        <Table>
          <thead>
            <tr>
              <th>
                GL Code - Description
              </th>
              <th colSpan={2} className={getCurrentYearColClassName(MathHelper.sub(showingYear, 1))}>
                {MathHelper.sub(showingYear, 1)}
              </th>
              <th colSpan={2} className={getCurrentYearColClassName(showingYear)}>
                {showingYear}
              </th>
              <th colSpan={2} className={getCurrentYearColClassName(MathHelper.add(showingYear, 1))}>
                {MathHelper.add(showingYear, 1)}
              </th>
            </tr>
            <tr>
              <th></th>
              <th className={getCurrentYearColClassName(showingPreviousYear)}>Requested</th>
              <th className={getCurrentYearColClassName(showingPreviousYear)}>Approved</th>
              <th className={getCurrentYearColClassName(showingYear)}>Requested</th>
              <th className={getCurrentYearColClassName(showingYear)}>Approved</th>
              <th className={getCurrentYearColClassName(MathHelper.add(showingYear, 1))}>Requested</th>
              <th className={getCurrentYearColClassName(MathHelper.add(showingYear, 1))}>Approved</th>
            </tr>
          </thead>
          <tbody>
          {
            Object.keys(glmap).map(glCode => {
              return (
                <tr key={glCode}>
                  <td>{glCode} - {glmap[glCode][0].GLDescription}</td>
                  <td className={getCurrentYearColClassName(showingPreviousYear)}>
                    {UtilsService.formatIntoCurrency(glCode in requestedSumMap ? (requestedSumMap[glCode][showingPreviousYear] || 0) : 0)}
                  </td>
                  <td className={getCurrentYearColClassName(showingPreviousYear)}>
                    {UtilsService.formatIntoCurrency(glCode in approvedSumMap ? (approvedSumMap[glCode][showingPreviousYear] || 0) : 0)}
                  </td>
                  <td className={getCurrentYearColClassName(showingYear)}>
                    {UtilsService.formatIntoCurrency(glCode in requestedSumMap ? (requestedSumMap[glCode][showingYear] || 0) : 0)}
                  </td>
                  <td className={getCurrentYearColClassName(showingYear)}>
                    {UtilsService.formatIntoCurrency(glCode in approvedSumMap ? (approvedSumMap[glCode][showingYear] || 0) : 0)}
                  </td>
                  <td className={getCurrentYearColClassName(showingNextYear)}>
                    {UtilsService.formatIntoCurrency(glCode in requestedSumMap ? (requestedSumMap[glCode][showingNextYear] || 0) : 0)}
                  </td>
                  <td className={getCurrentYearColClassName(showingNextYear)}>
                    {UtilsService.formatIntoCurrency(glCode in approvedSumMap ? (approvedSumMap[glCode][showingNextYear] || 0) : 0)}
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
      </>
    )
  }

  return (
    <Wrapper>
      <ExplanationPanel text={'NOTE: Requested value and Approved value are pulled from Budget Tracker Items'} />
      {getContent()}
    </Wrapper>
  )
}

export default BTConsolidatedReportsPanel;
