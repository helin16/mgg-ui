import styled from 'styled-components';
import ExplanationPanel from '../../../../components/ExplanationPanel';
import {useEffect, useState} from 'react';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import iBTItemCategory from '../../../../types/BudgetTacker/iBTItemCategory';
import {Button, Table} from 'react-bootstrap';
import BTItemCategoryService from '../../../../services/BudgetTracker/BTItemCategoryService';
import Toaster, {TOAST_TYPE_INFO} from '../../../../services/Toaster';
import * as _ from 'lodash';
import * as Icons from 'react-bootstrap-icons';
import DeleteConfirmPopupBtn from '../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import MathHelper from '../../../../helper/MathHelper';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/makeReduxStore';
import BTItemCategoryDetailsPopup from './BTItemCategoryDetailsPopup';

const Wrapper = styled.div``;
const BTItemCategoryAdminPanel = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<iBTItemCategory[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    BTItemCategoryService.getAll({
      where: JSON.stringify({ active: true })
    })
      .then(resp => {
        if(isCanceled) return;
        setCategories(resp);
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
      return <PageLoadingSpinner/>
    }
    return (
      <Table size={'sm'} hover striped>
        <thead>
        <tr>
          <th>Name</th>
          <th>Destination GL Code</th>
          <th className={'text-right'}>
            <BTItemCategoryDetailsPopup onSaved={() => setCount(MathHelper.add(count, 1))} >
              <Button variant={'success'} size={'sm'}>
                <Icons.Plus /> New
              </Button>
            </BTItemCategoryDetailsPopup>
          </th>
        </tr>
        </thead>
        <tbody>
        {
          _.orderBy(categories, ['name'], ['asc'])
            .map(category => {
              return (
                <tr key={category.guid}>
                  <td>{category.name}</td>
                  <td>{category.destination_gl_code}</td>
                  <td className={'text-right'}>
                    <BTItemCategoryDetailsPopup
                      onSaved={() => setCount(MathHelper.add(count, 1))}
                      category={category}
                    >
                      <Button variant={'secondary'} size={'sm'}>
                        <Icons.Pencil />
                      </Button>
                    </BTItemCategoryDetailsPopup>
                    {' '}
                    <DeleteConfirmPopupBtn
                      variant={'danger'}
                      deletingFn={() => BTItemCategoryService.deactivate(category.id)}
                      deletedCallbackFn={() => {
                        setCount(MathHelper.add(count, 1));
                        Toaster.showToast('Category Deleted.', TOAST_TYPE_INFO);
                      }}
                      size={'sm'}
                      description={<>You are about to delete category <u>{category.name}: {category.destination_gl_code}</u></>}
                      confirmString={`${user?.synergyId || 'na'}`}>
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
      <ExplanationPanel text={'NOTE: all Destination GL Codes are NOT reflected by Year!!!'} />
      {getContent()}
    </Wrapper>
  )
}

export default BTItemCategoryAdminPanel;
