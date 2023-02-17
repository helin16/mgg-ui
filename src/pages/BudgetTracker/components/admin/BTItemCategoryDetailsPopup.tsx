import React, {useEffect, useState} from 'react';
import PopupModal from '../../../../components/common/PopupModal';
import iBTItemCategory from '../../../../types/BudgetTacker/iBTItemCategory';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import FormLabel from '../../../../components/form/FormLabel';
import {Form} from 'react-bootstrap';
import BTItemCategoryService from '../../../../services/BudgetTracker/BTItemCategoryService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';

type iBTItemCategoryDetailsPopup = {
  children: any;
  category?: iBTItemCategory;
  onSaved: (newCategory: iBTItemCategory) => void;
}

const initial = {
  name: '',
  destination_gl_code: '',
}

const BTItemCategoryDetailsPopup = ({children, category, onSaved}: iBTItemCategoryDetailsPopup) => {

  const [isShowing, setIsShowing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<iBTItemCategory | typeof initial>(initial);

  useEffect(() => {
    setEditingCategory(category || initial);
  }, [category]);


  const closePopup = () => {
    setEditingCategory(initial);
    setIsShowing(false);
  }

  const save = () => {
    setIsSaving(true);
    // @ts-ignore
    const func = `${editingCategory.id || ''}`.trim() !== '' ?
      // @ts-ignore
      BTItemCategoryService.update(editingCategory.id, editingCategory)
      : BTItemCategoryService.create(editingCategory)

    func.then(resp => {
      Toaster.showToast(`Category (${editingCategory.name}) saved.`, TOAST_TYPE_SUCCESS);
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
            {editingCategory.id ? 'Update' : 'Create'}
          </LoadingBtn>
        </div>
      </div>
    )
  }

  const getPopup = () => {
    if (!isShowing) return null;

    return (
      <PopupModal
        title={
          // @ts-ignore
          editingCategory.id ? `Update Category` : 'Create Category'
        }
        show={isShowing}
        handleClose={closePopup}
        footer={getFooter()}
      >
        <div>
          <div>
            <FormLabel label={'Category Name'} isRequired />
            <Form.Control
              value={editingCategory?.name || ''}
              onChange={(event) => setEditingCategory({...editingCategory, name: event.target.value})}
            />
          </div>
          <div>
            <FormLabel label={'Destination GL Code'} />
            <Form.Control
              value={editingCategory?.destination_gl_code || ''}
              onChange={(event) => setEditingCategory({...editingCategory, destination_gl_code: event.target.value})}
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

export default BTItemCategoryDetailsPopup;
