import {Button, ButtonGroup, Col, Form, Row, Spinner} from 'react-bootstrap';
import FormLabel from '../../../components/form/FormLabel';
import BTItemCategorySelector from './BTItemCategorySelector';
import UtilsService from '../../../services/UtilsService';
import MathHelper from '../../../helper/MathHelper';
import React, {useEffect, useState} from 'react';
import iBTItem, {
  BT_ITEM_STATUS_APPROVED,
  BT_ITEM_STATUS_DECLINED,
  BT_ITEM_STATUS_NEW
} from '../../../types/BudgetTacker/iBTItem';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import AuthService from '../../../services/AuthService';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../services/Toaster';
import BTItemService from '../../../services/BudgetTracker/BTItemService';
import {FlexContainer} from '../../../styles';
import LoadingBtn from '../../../components/common/LoadingBtn';
import moment from 'moment-timezone';
import styled from 'styled-components';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import FormErrorDisplay, {iErrorMap} from '../../../components/form/FormErrorDisplay';

type iBTItemEditPanel = {
  readyOnly?: boolean;
  btItem?: iBTItem;
  gl: iSynGeneralLedger;
  onItemSaved: (newItem: iBTItem) => void;
  onCancel: () => void;
  forYear: number;
  className?: string;
}

const Wrapper = styled.div`
  .row {
    margin-bottom: 8px;
    .title-col {
      font-weight: bold;
      text-align: right;
    }
  }
  
  .admin-row {
    border-top: 1px solid #dee2e6;
    padding-top: 1rem;
  }
  
  .reason-input {
    height: 100px;
  }
  
  .approver_info {
    &.approved {
      color: green;
    }
    &.declined {
      color: red;
    }
  }
`;

const initialItem: iBTItem = {
  item_cost: 0,
  item_quantity: 0,
}

const BTItemEditPanel = ({readyOnly, btItem, gl, forYear, onItemSaved, onCancel, className}: iBTItemEditPanel) => {
  const [isReadyOnly, setIsReadyOnly] = useState(readyOnly);
  const [editingBtItem, setEditingBtItem] = useState(initialItem);
  const [isSaving, setIsSaving] = useState(false);
  const [isModuleAdmin, setIsModuleAdmin] = useState(false);
  const [communityMap, setCommunityMap] = useState<{[key: number]: iSynCommunity}>({});
  const [gettingCommunityInfo, setGettingCommunityInfo] = useState(false);
  const [errorMap, setErrorMap] = useState({});
  const {user: currentUser} = useSelector((root: RootState) => root.auth);

  useEffect(() => {
    setEditingBtItem((btItem || {
      ...initialItem,
      gl_code: gl.GLCode,
    }))
    if (readyOnly === true) {
      setIsReadyOnly(readyOnly)
    } else {
      setIsReadyOnly(btItem?.author_id !== null && btItem?.author_id !== undefined && btItem?.author_id !== currentUser?.synergyId);
    }
    //eslint-disable-next-line
  }, [btItem, gl.GLCode, readyOnly, btItem?.author_id, currentUser?.synergyId])

  useEffect(() => {
    setCommunityMap({});
    let ids = [];
    if (`${btItem?.creator_id || ''}`.trim() !== '') {
      ids.push(btItem?.creator_id);
    }
    if (`${btItem?.author_id || ''}`.trim() !== '') {
      ids.push(btItem?.author_id);
    }
    if (ids.length <= 0) {
      return;
    }
    let isCanceled = false;
    setGettingCommunityInfo(true);
    Promise.all([
      SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({
          ID: ids,
        })
      }),
      AuthService.isModuleRole(MGGS_MODULE_ID_BUDGET_TRACKER, ROLE_ID_ADMIN),
    ]).then(resp => {
      if (isCanceled) return;
      setCommunityMap((resp[0].data || []).reduce((map, com) => {
        return {
          ...map,
          [com.ID]: com,
        }
      }, {}));
      setIsModuleAdmin(resp[1] === true)
    }).catch(err => {
      if (isCanceled) return;
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) return;
      setGettingCommunityInfo(false);
    })
    return () => {
      isCanceled = true;
    }
  }, [btItem])

  const setItem = (name: string, newValue: any) => {
    setEditingBtItem({
      ...(editingBtItem || {}),
      [name]: newValue
    });
  }

  const preCheck = () => {
    const errors: iErrorMap = {};
    if (`${editingBtItem.budget_item_category_guid || ''}`.trim() === '') {
      errors.budget_item_category_guid = `Category is required.`;
    }
    if (`${editingBtItem.name || ''}`.trim() === '') {
      errors.name = `Name is required.`;
    }
    if (`${editingBtItem.description || ''}`.trim() === '') {
      errors.description = `Reason is required.`;
    }
    if (`${editingBtItem.item_quantity || ''}`.trim() === '') {
      errors.item_quantity = `Item Qty is required.`;
    } else if (!UtilsService.isNumeric(`${editingBtItem.item_quantity || ''}`.trim())) {
      errors.item_quantity = `Item Qty needs to be a number like: 12 or 123.45`;
    }
    if (`${editingBtItem.item_cost || ''}`.trim() === '') {
      errors.item_cost = `Item Cost is required.`;
    } else if (!UtilsService.isNumeric(`${editingBtItem.item_cost || ''}`.trim())) {
      errors.item_cost = `Item Cost needs to be a number like: 12 or 123.45`;
    }

    if(editingBtItem.approved === true) {
      if (`${editingBtItem.approved_amount || ''}`.trim() === '') {
        errors.approved_amount = 'Approved amount is needed.'
      } else if (!UtilsService.isNumeric(`${editingBtItem.approved_amount || ''}`.trim())) {
        errors.approved_amount = `Approved Amount needs to be a number like: 12 or 123.45`;
      }
    }

    if(editingBtItem.declined === true && `${editingBtItem.approver_comments || ''}`.trim() === '') {
      errors.approver_comments = 'A reason for declining is needed.'
    }
    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  }

  const submit = () => {
    if (!preCheck()) {
      return;
    }
    setIsSaving(true);
    const func = editingBtItem.id ? BTItemService.update(editingBtItem.id, {
      ...editingBtItem,
      year: forYear,
    }) : BTItemService.create({
      ...editingBtItem,
      year: forYear,
    });
    func
      .then(resp => {
        Toaster.showToast('Item saved successfully', TOAST_TYPE_SUCCESS);
        onItemSaved(resp);
      }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      setIsSaving(false);
    })
  }

  const getCommentsDiv = () => {
    if (BTItemService.getBTItemStatusNameFromItem(editingBtItem) === BT_ITEM_STATUS_NEW) {
      return null;
    }

    return (
      <>
        {editingBtItem.approved !== true ? null : (
          <div>
            <FormLabel label={'Approved amount($)'} isRequired/>
            <Form.Control
              isInvalid={'approved_amount' in errorMap}
              disabled={isReadyOnly === true || isModuleAdmin !== true}
              onChange={(event) => setItem('approved_amount', event.target.value)}
              value={editingBtItem.approved_amount || ''}
            />
            <FormErrorDisplay errorsMap={errorMap} fieldName={'approved_amount'} />
          </div>
        )}
        <div>
          <FormLabel label={'Comments'} isRequired={editingBtItem.declined === true}/>
          <Form.Control
            isInvalid={'approver_comments' in errorMap}
            disabled={isReadyOnly === true || isModuleAdmin !== true}
            onChange={(event) => setItem('approver_comments', event.target.value)}
            value={editingBtItem.approver_comments || ''}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'approver_comments'} />
        </div>
      </>
    )
  }

  const getApproverInfo = (type: string) => {
    if (gettingCommunityInfo) {
      return (
        <div>
          <Spinner animation={'border'} />
        </div>
      )
    }
    const approverId = editingBtItem.author_id || 0
    if (!(approverId in communityMap) || !btItem || btItem.status === BT_ITEM_STATUS_NEW) {
      return null;
    }

    return (
      <div className={`approver_info ${btItem.status}`}>
        {type} by {communityMap[approverId]?.Given1} @ {moment(editingBtItem.updated_at).format('DD MMM YYYY HH:mm')}
      </div>
    )
  }

  const getCreationInfo = () => {
    if (!btItem) {
      return null;
    }
    if (gettingCommunityInfo) {
      return (
        <span className={'float-end'}>
          <Spinner animation={'border'} />
        </span>
      )
    }
    const creatorId = btItem.creator_id || 0
    if (!(creatorId in communityMap)) {
      return <div />;
    }
    return (
      <div>
        Requested by {communityMap[creatorId]?.Given1} @ {moment(btItem.created_at).format('DD MMM YYYY HH:mm')}
      </div>
    )
  }

  const getFooter = () => {
    if (isReadyOnly) {
      return (
        <FlexContainer className={'justify-content space-between full-width'}>
          {getCreationInfo()}
          <div>
            <LoadingBtn variant={'primary'} onClick={() => onCancel()}>
              OK
            </LoadingBtn>
          </div>
        </FlexContainer>
      )
    }
    return (
      <FlexContainer className={'justify-content space-between full-width'}>
        {getCreationInfo()}
        <div>
          <LoadingBtn variant={'link'} onClick={() => onCancel()} isLoading={isSaving}>
            Cancel
          </LoadingBtn>
          <LoadingBtn variant={'primary'} onClick={() => submit()} isLoading={isSaving}>
            {editingBtItem.id ? `Update` : 'Create'}
          </LoadingBtn>
        </div>
      </FlexContainer>
    )
  }

  const getAdminPanel = () => {
    if (!editingBtItem.id) {
      return null;
    }

    return (
      <Row className={'admin-row'}>
        <Col sm={2} className={'title-col'}><FormLabel label={'Admin:'} /></Col>
        <Col sm={10}>
          <FlexContainer className={'space-below justify-content space-between align-items end'}>
            {isReadyOnly === true ? null : (
              <ButtonGroup size={'sm'}>
                <Button
                  disabled={isModuleAdmin !== true}
                  onClick={() => setEditingBtItem({
                    ...editingBtItem,
                    approved: null,
                    declined: null,
                    approved_amount: null,
                    approver_comments: null,
                    author_id: null,
                  })}
                  variant={BTItemService.getBTItemStatusNameFromItem(editingBtItem) === BT_ITEM_STATUS_NEW ? 'secondary' : 'outline-secondary'}>
                  {BT_ITEM_STATUS_NEW.toUpperCase()}
                </Button>
                <Button
                  disabled={isModuleAdmin !== true}
                  onClick={() => setEditingBtItem({
                    ...editingBtItem,
                    approved: true,
                    declined: null,
                    author_id: currentUser?.synergyId || null,
                    approved_amount: MathHelper.mul(editingBtItem.item_quantity || 0 , editingBtItem.item_cost || 0),
                    approver_comments: null,
                  })}
                  variant={BTItemService.getBTItemStatusNameFromItem(editingBtItem) === BT_ITEM_STATUS_APPROVED ? 'success' : 'outline-success'}>
                  {BT_ITEM_STATUS_APPROVED.toUpperCase()}
                </Button>
                <Button
                  disabled={isModuleAdmin !== true}
                  onClick={() => setEditingBtItem({
                    ...editingBtItem,
                    approved: null,
                    declined: true,
                    author_id: currentUser?.synergyId || null,
                    approved_amount: null,
                    approver_comments: null,
                  })}
                  variant={BTItemService.getBTItemStatusNameFromItem(editingBtItem) === BT_ITEM_STATUS_DECLINED ? 'danger' : 'outline-danger'}>
                  {BT_ITEM_STATUS_DECLINED.toUpperCase()}
                </Button>
              </ButtonGroup>
            )}
            {getApproverInfo(btItem?.declined ? 'Declined' : (btItem?.approved ? 'Approved' : ''))}
          </FlexContainer>
          {getCommentsDiv()}
        </Col>
      </Row>
    )
  }

  const getTotal = () => {
    if (!UtilsService.isNumeric(`${editingBtItem?.item_quantity || ''}`.trim()) || !UtilsService.isNumeric(`${editingBtItem?.item_cost || ''}`.trim())) {
      return 0;
    }
    return UtilsService.formatIntoCurrency(MathHelper.mul(editingBtItem?.item_quantity || 0, editingBtItem?.item_cost || 0));
  }

  return (
    <Wrapper className={className}>
      <Row>
        <Col sm={2} className={'title-col'}><FormLabel label={'Budget Category:'} isRequired /></Col>
        <Col sm={10}>
          <BTItemCategorySelector
            isDisabled={isReadyOnly === true}
            isInvalid={'budget_item_category_guid' in errorMap}
            value={editingBtItem?.budget_item_category_guid || ''}
            onSelect={(option) => {
              const category = option?.data || null;
              setEditingBtItem({
                ...editingBtItem,
                budget_item_category_guid: category?.guid || null,
                gl_code: category?.destination_gl_code || gl.GLCode
              })
            }}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'budget_item_category_guid'} />
        </Col>
      </Row>
      <Row>
        <Col sm={2} className={'title-col'}><FormLabel label={'Item Name:'} isRequired /></Col>
        <Col sm={10}>
          <Form.Control
            isInvalid={'name' in errorMap}
            placeholder={'The name of the budget item...'}
            value={editingBtItem?.name || ''}
            onChange={(event) => setItem('name', event.target.value)}
            disabled={isReadyOnly === true}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'name'} />
        </Col>
      </Row>
      <Row>
        <Col sm={2} className={'title-col'}><FormLabel label={'Reason For Purchase:'} isRequired /></Col>
        <Col sm={10}>
          <Form.Control
            isInvalid={'description' in errorMap}
            disabled={isReadyOnly === true}
            className={'reason-input'}
            as="textarea"
            placeholder={'The reason for this budget item'}
            value={editingBtItem?.description || ''}
            onChange={(event) => setItem('description', event.target.value)}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'description'} />
        </Col>
      </Row>
      <Row>
        <Col sm={2} className={'title-col'}><FormLabel label={'Qty to purchase:'} isRequired /></Col>
        <Col sm={2}>
          <Form.Control
            isInvalid={'item_quantity' in errorMap}
            value={editingBtItem?.item_quantity || 0}
            disabled={isReadyOnly === true}
            onChange={(event) => setItem('item_quantity', event.target.value)}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'item_quantity'} />
        </Col>
        <Col sm={2} className={'title-col'}><FormLabel label={'Unit Cost($):'} isRequired /></Col>
        <Col sm={2}>
          <Form.Control
            isInvalid={'item_cost' in errorMap}
            value={editingBtItem?.item_cost || 0}
            disabled={isReadyOnly === true}
            onChange={(event) => setItem('item_cost', event.target.value)} />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'item_cost'} />
        </Col>
        <Col sm={2} className={'title-col'}>Total Cost($):</Col>
        <Col sm={2}>
          <h5>{getTotal()}</h5>
        </Col>
      </Row>
      {getAdminPanel()}
      <div className={'footer'}>
        {getFooter()}
      </div>
    </Wrapper>
  )
}

export default BTItemEditPanel;
