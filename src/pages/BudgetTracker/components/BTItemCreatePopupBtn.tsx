import styled from 'styled-components';
import {Button, ButtonGroup, Col, Form, Row, Spinner} from 'react-bootstrap';
import iBTItem, {
  BT_ITEM_STATUS_APPROVED,
  BT_ITEM_STATUS_DECLINED,
  BT_ITEM_STATUS_NEW
} from '../../../types/BudgetTacker/iBTItem';
import PopupModal from '../../../components/common/PopupModal';
import React, {useEffect, useState} from 'react';
import LoadingBtn from '../../../components/common/LoadingBtn';
import BTItemCategorySelector from './BTItemCategorySelector';
import UtilsService from '../../../services/UtilsService';
import MathHelper from '../../../helper/MathHelper';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import BTItemService from '../../../services/BudgetTracker/BTItemService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../services/Toaster';
import FormLabel from '../../../components/form/FormLabel';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import moment from 'moment-timezone';
import {FlexContainer} from '../../../styles';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import AuthService from '../../../services/AuthService';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';

type iBTItemCreatePopupBtn = {
  onItemSaved: (newItem: iBTItem) => void;
  children: any;
  gl: iSynGeneralLedger;
  forYear: number;
  btItem?: iBTItem;
  forceReadyOnly?: boolean;
}

const Wrapper = styled.div`
`;
const BodyWrapper = styled.div`
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

const BTItemCreatePopupBtn = ({onItemSaved, children, btItem, gl, forYear, forceReadyOnly = false}: iBTItemCreatePopupBtn) => {
  const [isReadyOnly, setIsReadyOnly] = useState(forceReadyOnly);
  const [showingPopup, setShowingPopup] = useState(false);
  const [editingBtItem, setEditingBtItem] = useState(initialItem);
  const [isSaving, setIsSaving] = useState(false);
  const [communityMap, setCommunityMap] = useState<{[key: number]: iSynCommunity}>({});
  const [gettingCommunityInfo, setGettingCommunityInfo] = useState(false);
  const {user: currentUser} = useSelector((root: RootState) => root.auth);

  useEffect(() => {
    setEditingBtItem((btItem || {
      ...initialItem,
      gl_code: gl.GLCode,
    }))
    if (forceReadyOnly === true) {
      setIsReadyOnly(forceReadyOnly)
    } else {
      setIsReadyOnly(editingBtItem.author_id !== null && editingBtItem.author_id !== undefined);
    }
    //eslint-disable-next-line
  }, [btItem, gl.GLCode, forYear, currentUser, forceReadyOnly, editingBtItem.author_id])

  useEffect(() => {
    setCommunityMap({});
    if (!showingPopup) return;

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
        if (resp[1] === true) {
          setIsReadyOnly( false);
        }
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
  }, [btItem, showingPopup])

  const closePopup = () => {
    // setEditingBtItem(initialItem);
    setShowingPopup(false);
  }

  const setItem = (name: string, newValue: any) => {
    setEditingBtItem({
      ...(editingBtItem || {}),
      [name]: newValue
    });
  }

  const submit = () => {
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
        closePopup();
        onItemSaved(resp);
      }).catch(err => {
        Toaster.showApiError(err);
      }).finally(() => {
        setIsSaving(false);
      })
  }

  const getFooter = () => {
    if (isReadyOnly) {
      return (
        <FlexContainer className={'justify-content space-between full-width'}>
          {getCreationInfo()}
          <div>
            <LoadingBtn variant={'primary'} onClick={() => closePopup()}>
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
          <LoadingBtn variant={'link'} onClick={() => closePopup()} isLoading={isSaving}>
            Cancel
          </LoadingBtn>
          <LoadingBtn variant={'primary'} onClick={() => submit()} isLoading={isSaving}>
            {editingBtItem.id ? `Update` : 'Create'}
          </LoadingBtn>
        </div>
      </FlexContainer>
    )
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
              disabled={isReadyOnly === true}
              onChange={(event) => setItem('approved_amount', event.target.value)}
              value={editingBtItem.approved_amount || ''}
            />
          </div>
        )}
        <div>
          <FormLabel label={'Comments'} isRequired={editingBtItem.declined === true}/>
          <Form.Control
            disabled={isReadyOnly === true}
            onChange={(event) => setItem('approver_comments', event.target.value)}
            value={editingBtItem.approver_comments || ''}
          />
        </div>
      </>
    )
  }
  const getCreationInfo = () => {
    if (gettingCommunityInfo) {
      return (
        <span className={'float-end'}>
          <Spinner animation={'border'} />
        </span>
      )
    }
    const creatorId = editingBtItem.creator_id || 0
    if (!(creatorId in communityMap)) {
      return <div />;
    }
    return (
      <div>
        Requested by {communityMap[creatorId]?.Given1} @ {moment(editingBtItem.created_at).format('DD MMM YYYY HH:mm')}
      </div>
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
              <ButtonGroup aria-label="Basic example" size={'sm'}>
                <Button
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
  const getBody = () => {
    return (
      <BodyWrapper>
        <Row>
          <Col sm={2} className={'title-col'}><FormLabel label={'Budget Category:'} isRequired /></Col>
          <Col sm={10}>
            <BTItemCategorySelector
              isDisabled={isReadyOnly === true}
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
          </Col>
        </Row>
        <Row>
          <Col sm={2} className={'title-col'}><FormLabel label={'Item Name:'} isRequired /></Col>
          <Col sm={10}>
            <Form.Control
              placeholder={'The name of the budget item...'}
              value={editingBtItem.name || ''}
              onChange={(event) => setItem('name', event.target.value)}
              disabled={isReadyOnly === true}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={2} className={'title-col'}><FormLabel label={'Reason For Purchase:'} isRequired /></Col>
          <Col sm={10}>
            <Form.Control
              disabled={isReadyOnly === true}
              className={'reason-input'}
              as="textarea"
              placeholder={'The reason for this budget item'}
              value={editingBtItem.description || ''}
              onChange={(event) => setItem('description', event.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={2} className={'title-col'}><FormLabel label={'Qty to purchase:'} isRequired /></Col>
          <Col sm={2}>
            <Form.Control
              value={editingBtItem.item_quantity || 0}
              disabled={isReadyOnly === true}
              onChange={(event) => setItem('item_quantity', event.target.value)}
            />
          </Col>
          <Col sm={2} className={'title-col'}><FormLabel label={'Unit Cost($):'} isRequired /></Col>
          <Col sm={2}>
            <Form.Control
              value={editingBtItem.item_cost || 0}
              disabled={isReadyOnly === true}
              onChange={(event) => setItem('item_cost', event.target.value)} />
          </Col>
          <Col sm={2} className={'title-col'}>Total Cost($):</Col>
          <Col sm={2}>
            <h5>{UtilsService.formatIntoCurrency(MathHelper.mul(editingBtItem.item_quantity || 0, editingBtItem.item_cost || 0))}</h5>
          </Col>
        </Row>
        {getAdminPanel()}
      </BodyWrapper>
    )
  }

  const getPopup = () => {
    return (
      <PopupModal
        header={
          <b>{editingBtItem.id ? `Editing` : `Request for ${gl.GLCode} - ${gl.GLDescription} in ${forYear}`}</b>
        }
        show={showingPopup}
        handleClose={closePopup}
        footer={getFooter()}
        size={'lg'}
      >
        {getBody()}
      </PopupModal>
    )
  }
  return (
    <Wrapper>
      <span onClick={() => setShowingPopup(true)}>
        {children}
      </span>
      {getPopup()}
    </Wrapper>
  )
}

export default BTItemCreatePopupBtn;
