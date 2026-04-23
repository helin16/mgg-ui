import styled from 'styled-components';
import ExplanationPanel from '../../../../components/ExplanationPanel';
import {useEffect, useState} from 'react';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import {Button, Table} from 'react-bootstrap';
import Toaster, {TOAST_TYPE_INFO} from '../../../../services/Toaster';
import * as _ from 'lodash';
import * as Icons from 'react-bootstrap-icons';
import DeleteConfirmPopupBtn from '../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import MathHelper from '../../../../helper/MathHelper';
import BTExcludeGLService from '../../../../services/BudgetTracker/BTExcludeGLService';
import iBTExcludeCode from '../../../../types/BudgetTacker/iBTExcludeCode';
import BTExcludeCodeDetailsPopup from './BTExcludeCodeDetailsPopup';

const Wrapper = styled.div``;
const BTExcludeGLAdminPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [excludeCodes, setExcludeCodes] = useState<iBTExcludeCode[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    BTExcludeGLService.getAll()
      .then(resp => {
        if(isCanceled) return;
        setExcludeCodes(resp);
      })
      .catch(err => {
        if(isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if(isCanceled) return;
        setIsLoading(false);
      })
    return () => {
      isCanceled = true;
    };
  }, [count]);


  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />
    }
    return (
      <Table size={'sm'} hover striped>
        <thead>
        <tr>
          <th>Name</th>
          <th className={'text-right'}>
            <BTExcludeCodeDetailsPopup onSaved={() => setCount(MathHelper.add(count, 1))} >
              <Button variant={'success'} size={'sm'}>
                <Icons.Plus /> New
              </Button>
            </BTExcludeCodeDetailsPopup>
          </th>
        </tr>
        </thead>
        <tbody>
        {
          _.orderBy(excludeCodes, ['glcode'], ['asc'])
            .map(excludeCode => {
              return (
                <tr key={excludeCode.id}>
                  <td>{excludeCode.glcode}</td>
                  <td className={'text-right'}>
                    <DeleteConfirmPopupBtn
                      variant={'danger'}
                      deletingFn={() => BTExcludeGLService.deactivate(excludeCode.id)}
                      deletedCallbackFn={() => {
                        setCount(MathHelper.add(count, 1));
                        Toaster.showToast(`ExcludeCode(${excludeCode.glcode}) Deleted.`, TOAST_TYPE_INFO);
                      }}
                      size={'sm'}
                      description={<>You are about to delete ExcludeCode <u>{excludeCode.glcode}</u></>}
                      confirmString={excludeCode.glcode}>
                      <Icons.Trash />
                    </DeleteConfirmPopupBtn>
                  </td>
                </tr>
              )
            })
        }
        </tbody>
      </Table>
    )
  }

  return (
    <Wrapper>
      <ExplanationPanel text={'NOTE: all the GLCodes list below will be hidden on the glcode list.'} />
      {getContent()}
    </Wrapper>
  )
}

export default BTExcludeGLAdminPanel;
