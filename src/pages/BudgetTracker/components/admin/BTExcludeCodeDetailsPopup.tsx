import React, {useState} from 'react';
import PopupModal from '../../../../components/common/PopupModal';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import FormLabel from '../../../../components/form/FormLabel';
import {Form} from 'react-bootstrap';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';
import iBTExcludeCode from '../../../../types/BudgetTacker/iBTExcludeCode';
import BTExcludeGLService from '../../../../services/BudgetTracker/BTExcludeGLService';

type iBTExcludeCodeDetailsPopup = {
  children: any;
  onSaved: (newCode: iBTExcludeCode) => void;
}

const initial = {
  glcode: '',
}

const BTExcludeCodeDetailsPopup = ({children, onSaved}: iBTExcludeCodeDetailsPopup) => {

  const [isShowing, setIsShowing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCode, setEditingCode] = useState<iBTExcludeCode | typeof initial>(initial);

  const closePopup = () => {
    setEditingCode(initial);
    setIsShowing(false);
  }

  const save = () => {
    setIsSaving(true);
    const func = BTExcludeGLService.create(editingCode)
    func.then(resp => {
      Toaster.showToast(`Exclude Code (${editingCode.glcode}) added.`, TOAST_TYPE_SUCCESS);
      onSaved(resp);
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      setIsSaving(false);
    })
  }

  const getFooter = () => {
    return (
      <div>
        <div />
        <div>
          <LoadingBtn variant={'link'} isLoading={isSaving} onClick={() => closePopup()}>Cancel</LoadingBtn>
          <LoadingBtn variant={'primary'} isLoading={isSaving} onClick={() => save()}>
            {/* @ts-ignore*/}
            {editingCode.id ? 'Update' : 'Create'}
          </LoadingBtn>
        </div>
      </div>
    )
  }


  const getPopup = () => {
    if (!isShowing) return null;

    return (
      <PopupModal
        title={'Creating'}
        show={isShowing}
        handleClose={closePopup}
        footer={getFooter()}
      >
        <div>
          <div>
            <FormLabel label={'GL Code'} isRequired />
            <Form.Control
              value={editingCode?.glcode || ''}
              onChange={(event) => setEditingCode({...editingCode, glcode: event.target.value})}
            />
          </div>
        </div>
      </PopupModal>
    )
  }

  return (
    <>
      <span onClick={() => setIsShowing(true)}>
        {children}
      </span>
      {getPopup()}
    </>
  )
}

export default BTExcludeCodeDetailsPopup;
