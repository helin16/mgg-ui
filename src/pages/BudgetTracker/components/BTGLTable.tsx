import {Form, Spinner, Table} from 'react-bootstrap';
import UtilsService from '../../../services/UtilsService';
import ISynGeneralLedager from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import iPaginatedResult from '../../../types/iPaginatedResult';
import {useEffect, useState} from 'react';
import BTItemService, {iBTItemSum} from '../../../services/BudgetTracker/BTItemService';
import Toaster from '../../../services/Toaster';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import * as _ from 'lodash';
import SynGeneralLedgerMonthlyBudgetService
  from '../../../services/Synergetic/Finance/SynGeneralLedgerMonthlyBudgetService';
import MathHelper from '../../../helper/MathHelper';

type iBTGLTable = {
  selectedYear: number;
  glCodesResults: iPaginatedResult<ISynGeneralLedager> | null;
  hideZeroBalance?: boolean;
  showPendingOnly?: boolean;
  onSelectGL: (gl: iSynGeneralLedger) => void;
}
type iBTItemMap = {[key: string]: iBTItemSum}
type iGLMonthlyBudgetMap = {[key: number]: number}
const BTGLTable = ({glCodesResults, selectedYear, onSelectGL, hideZeroBalance = false, showPendingOnly = false}: iBTGLTable) => {
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [btItemMap, setBtItemMap] = useState<iBTItemMap>({});
  const [excludingGLCodes, setExcludingGLCodes] = useState<string[]>([]);
  const [pendingGLCodes, setPendingGLCodes] = useState<string[]>([]);
  const [filterString, setFilterString] = useState('');
  const [glMonthlyBudgetMap, setGlMonthlyBudgetMap] = useState<iGLMonthlyBudgetMap>({});

  useEffect(() => {
    const glCodes = (glCodesResults?.data || []).map(result => result.GLCode);
    const glSeqs = (glCodesResults?.data || []).map(result => result.GeneralLedgerSeq);
    if (glCodes.length <= 0 || glSeqs.length <= 0){
      return;
    }

    let isCanceled = false;
    setIsLoadingItems(true);
    Promise.all([
      BTItemService.getAll({
        where: JSON.stringify({
          year: selectedYear + 1,
          gl_code: glCodes,
        }),
        perPage: '9999'
      }),
      SynGeneralLedgerMonthlyBudgetService.getAll({
        where: JSON.stringify({
          GeneralLedgerSeq: glSeqs,
        })
      })
    ]).then(resp => {
      if (isCanceled) return;
      setBtItemMap(resp[0].data.reduce((map: iBTItemMap, item) => {
        const glCode = `${item.gl_code || ''}`.trim();
        if (glCode === '') {
          return map;
        }
        return {
          ...map,
          // @ts-ignore
          [glCode]: BTItemService.getAmountByType(item, map[glCode] || {}),
        }
      }, {}));
      setGlMonthlyBudgetMap(resp[1].data.reduce((map: iGLMonthlyBudgetMap, budget) => {
        const glSeq = budget.GeneralLedgerSeq;
        return {
          ...map,
          // @ts-ignore
          [glSeq]: MathHelper.add(map[glSeq] || 0, budget.Budget1 || 0),
        }
      }, {}))
    }).catch(err => {
      if (isCanceled) return;
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) return;
      setIsLoadingItems(false);
    });

    return () => {
      isCanceled = true;
    }
  }, [glCodesResults?.data, selectedYear]);

  useEffect(() => {
    if (!hideZeroBalance) {
      setExcludingGLCodes([]);
      return;
    }
    setExcludingGLCodes((glCodesResults?.data || []).map(gl => {
      const glCode = gl.GLCode;
      if (!(glCode in btItemMap)) {
        return glCode;
      }
      const {approved, requested, pending, declined} = btItemMap[glCode];
      if (`${approved}` === '0' && `${requested}` === '0'  && `${pending}` === '0'  && `${declined}` === '0' ) {
        return glCode;
      }
      return '';
    }).filter(code => code !== ''))

  }, [btItemMap, hideZeroBalance, glCodesResults?.data])

  useEffect(() => {
    if (!showPendingOnly) {
      setPendingGLCodes([]);
      return;
    }
    setPendingGLCodes((glCodesResults?.data || []).map(gl => {
      const glCode = gl.GLCode;
      if (!(glCode in btItemMap)) {
        return '';
      }
      const {pending} = btItemMap[glCode];
      if (`${pending}` === '0' ) {
        return '';
      }
      return glCode;
    }).filter(code => code !== ''))

  }, [btItemMap, showPendingOnly, glCodesResults?.data])

  const filterByZeroBalance = (glCodes: iSynGeneralLedger[]) => {
    if (!hideZeroBalance) {
      return glCodes;
    }
    const excludeCodes = _.uniq(excludingGLCodes);
    return glCodes.filter(glCode => excludeCodes.indexOf(glCode.GLCode) < 0);
  }

  const filterPendingOnly = (glCodes: iSynGeneralLedger[]) => {
    if (!showPendingOnly) {
      return glCodes;
    }
    return glCodes.filter(glCode => pendingGLCodes.indexOf(glCode.GLCode) >= 0);
  }

  const filterBySearchString = (glCodes: iSynGeneralLedger[]) => {
    const searchString = `${filterString || ''}`.trim().toLowerCase();
    if (searchString === '') {
      return glCodes;
    }

    return glCodes.filter(glCode => {
      if (`${glCode.GLCode}`.toLowerCase().includes(searchString)) {
        return true;
      }

      if (`${glCode.GLDescription}`.toLowerCase().includes(searchString)) {
        return true;
      }

      if (`${glCode.GLCode} - ${glCode.GLDescription}`.toLowerCase().includes(searchString)) {
        return true;
      }

      return false;
    });
  }

  return (
    <Table striped hover className={'gl-table'} size={'sm'}>
      <thead>
      <tr>
        <th>
          GL Code / Description
        </th>
        <th colSpan={2}>
          {selectedYear}
        </th>
        <th colSpan={4} className={'future-col'}>
          {selectedYear + 1} Budget
        </th>
      </tr>
      <tr>
        <th>
          <Form.Control
            value={filterString}
            onChange={(event) => setFilterString(event.target.value)}
            size={'sm'}
            placeholder={'Filter GL codes or names'}
          />
        </th>
        <th className={'currency-col'}>
          {selectedYear} Budget
        </th>
        <th className={'currency-col'}>
          {selectedYear} Journals
        </th>
        <th className={'currency-col future-col'}>
          Approved For  {' '}
          {selectedYear + 1}
        </th>
        <th className={'currency-col future-col'}>
          Declined For {' '}
          {selectedYear + 1}
        </th>
        <th className={'currency-col future-col'}>
          Requested For {' '}
          {selectedYear + 1}
        </th>
        <th className={'currency-col future-col'}>
          Pending For {' '}
          {selectedYear + 1}
        </th>
      </tr>
      </thead>
      <tbody>
      {
        filterBySearchString(filterPendingOnly(filterByZeroBalance(glCodesResults?.data || []))).map(glCode => {
          return (
            <tr key={glCode.GLCode} className={'cursor-pointer'} onClick={() => onSelectGL(glCode)}>
              <td>
                {glCode.GLCode} - {glCode.GLDescription}
              </td>
              <td className={'currency-col'}>
                {UtilsService.formatIntoCurrency(glCode.GeneralLedgerSeq in glMonthlyBudgetMap ? glMonthlyBudgetMap[glCode.GeneralLedgerSeq] : 0)}
              </td>
              <td className={'currency-col'}>
                {UtilsService.formatIntoCurrency(glCode.CurrentBalance)}
              </td>
              {
                isLoadingItems ? (<td colSpan={4}><Spinner animation={'border'} /></td>): (
                  <>
                    <td className={'currency-col future-col'}>
                      {UtilsService.formatIntoCurrency(btItemMap[glCode.GLCode]?.approved || 0)}
                    </td>
                    <td className={'currency-col future-col'}>
                      {UtilsService.formatIntoCurrency(btItemMap[glCode.GLCode]?.declined || 0)}
                    </td>
                    <td className={'currency-col future-col'}>
                      {UtilsService.formatIntoCurrency(btItemMap[glCode.GLCode]?.requested || 0)}
                    </td>
                    <td className={'currency-col future-col'}>
                      {UtilsService.formatIntoCurrency(btItemMap[glCode.GLCode]?.pending || 0)}
                    </td>
                  </>
                )
              }
            </tr>
          )
        })
      }
      </tbody>
    </Table>
  );
}

export default BTGLTable;
