import styled from 'styled-components';
import React, {useState} from 'react';
import {Alert, Button} from 'react-bootstrap';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';
import BTLockDownService from '../../../../services/BudgetTracker/BTLockDownService';
import iBTLockDown from '../../../../types/BudgetTacker/iBTLockDown';
import moment from 'moment-timezone';
import MathHelper from '../../../../helper/MathHelper';
import PopupModal from '../../../../components/common/PopupModal';
import FormLabel from '../../../../components/form/FormLabel';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import DateTimePicker from '../../../../components/common/DateTimePicker';

const Wrapper = styled.div``;

type iBTLockDownCreatePopup = {
  currentLockDown?: iBTLockDown;
  onSaved: (newLockDown: iBTLockDown) => void;
}
const BTLockDownCreatePopup = ({onSaved, currentLockDown}: iBTLockDownCreatePopup) => {
  const currentBudgetYear = MathHelper.add(moment().year(), 1);
  const [showingPopup, setShowingPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lockDownTime, setLockDownTime] = useState(moment().toISOString())

  const closePopup = () => {
    setShowingPopup(false);
  }

  const hasCurrentLockDown = () => {
    return currentLockDown && `${currentLockDown.year}`.trim() === `${currentBudgetYear}`.trim();
  }

  const getContent = () => {
    if (hasCurrentLockDown()) {
      return (
        <Alert variant={'danger'}>
          There is an Lockdown for budget year: {currentBudgetYear} already.
          <div><b>You can NOT create another lock down for budget year: {currentBudgetYear}</b></div>
        </Alert>
      )
    }
    return (
      <div>
        <FormLabel label={'Lockdown at: '} />
        <DateTimePicker
          isValidDate={(cDate, sDate) => {
            return moment(sDate).isSameOrBefore(cDate);
          }}
          value={lockDownTime}
          onChange={(selected) => {
            if(typeof selected === 'object') {
              setLockDownTime(selected.toISOString())
            }
          }}/>
      </div>
    );
  }

  const save = () => {
    setIsSaving(true);
    BTLockDownService.create({
      lockdown: lockDownTime,
      year: currentBudgetYear,
    }).then(resp => {
      closePopup();
      Toaster.showToast(`Lock down for ${resp?.year} created`, TOAST_TYPE_SUCCESS);
      onSaved(resp);
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      setIsSaving(false);
    })
  }

  const getFooter = () => {
    if (hasCurrentLockDown()) {
      return (
        <div>
          <div>
            <div />
            <div>
              <Button variant={'primary'} onClick={() => closePopup()}>OK</Button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        <div />
        <div>
          <LoadingBtn variant={'link'} onClick={() => closePopup()} isLoading={isSaving}>Cancel</LoadingBtn>
          <LoadingBtn
            variant={'danger'}
            onClick={() => save()}
            isLoading={isSaving}>
            Save
          </LoadingBtn>
        </div>
      </div>
    )
  }

  const getPopup = () => {
    if (!showingPopup) return null;

    return (
      <PopupModal
        title={`Locking down for budget year: ${currentBudgetYear}`}
        show={showingPopup}
        handleClose={closePopup}
        footer={getFooter()}
      >
        {getContent()}
      </PopupModal>
    )
  }

  return (
    <Wrapper>
      <Button variant={hasCurrentLockDown() ? 'secondary' : 'danger'} onClick={() => setShowingPopup(true)}>
        Lock down for budget year: {currentBudgetYear}
      </Button>
      {getPopup()}
    </Wrapper>
  )
}

export default BTLockDownCreatePopup;
