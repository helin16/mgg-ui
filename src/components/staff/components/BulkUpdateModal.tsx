import {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import PopupModal from '../../common/PopupModal';
import FormLabel from '../../form/FormLabel';
import FormErrorDisplay, {iErrorMap} from '../../form/FormErrorDisplay';
import LoadingBtn from '../../common/LoadingBtn';
import IconDisplay from '../../IconDisplay';
import SynLuSkillSelector from '../../Community/SynLuSkillSelector';
import {iAutoCompleteSingle} from '../../common/AutoComplete';
import SynCommunitySkillService from '../../../services/Synergetic/Community/SynCommunitySkillService';
import Toaster, {TOAST_TYPE_SUCCESS, TOAST_TYPE_WARNING} from '../../../services/Toaster';

type iBulkUpdateModal = {
  selectedStaffIds: number[];
  isShowing: boolean;
  handleClose: () => void;
  onSuccess: () => void;
};

const BulkUpdateModal = ({selectedStaffIds, isShowing, handleClose, onSuccess}: iBulkUpdateModal) => {
  const [skillOption, setSkillOption] = useState<iAutoCompleteSingle | null>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [errMap, setErrMap] = useState<iErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setSkillOption(null);
    setExpiryDate('');
    setErrMap({});
  };

  const preSubmit = () => {
    const errors: iErrorMap = {};
    if (!skillOption) {
      errors.skillCode = 'Skill is required.';
    }
    if (`${expiryDate || ''}`.trim() === '') {
      errors.expiryDate = 'Expiration date is required.';
    }
    setErrMap(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (preSubmit() !== true || !skillOption) {
      return;
    }
    setIsSubmitting(true);
    try {
      const results = await SynCommunitySkillService.bulkUpdateSkillExpiryDate(
        selectedStaffIds,
        skillOption.value,
        expiryDate
      );
      const failureCount = results.filter(result => result.status === 'rejected').length;
      const successCount = results.length - failureCount;
      if (failureCount > 0) {
        Toaster.showToast(
          `Updated ${successCount} of ${results.length} staff. ${failureCount} failed - please retry.`,
          TOAST_TYPE_WARNING
        );
      } else {
        Toaster.showToast(`Updated ${successCount} staff.`, TOAST_TYPE_SUCCESS);
      }
      reset();
      if (successCount > 0) {
        onSuccess();
      }
    } catch (err) {
      Toaster.showApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBody = () => {
    return (
      <>
        <div>
          <FormLabel isRequired label={'Skill'} />
          <SynLuSkillSelector
            values={skillOption ? [skillOption] : []}
            onSelect={option => setSkillOption(Array.isArray(option) ? option[0] || null : option)}
            allowClear
          />
          <FormErrorDisplay errorsMap={errMap} fieldName={'skillCode'} />
        </div>
        <div className={'space-top'}>
          <FormLabel isRequired label={'New Expiration Date'} htmlFor={'bulk-update-expiry-date'} />
          <Form.Control
            id={'bulk-update-expiry-date'}
            type={'date'}
            isInvalid={'expiryDate' in errMap}
            value={expiryDate}
            onChange={event => setExpiryDate(event.target.value)}
          />
          <FormErrorDisplay errorsMap={errMap} fieldName={'expiryDate'} />
        </div>
      </>
    );
  };

  const getFooter = () => {
    return (
      <>
        <Button
          variant={'link'}
          disabled={isSubmitting}
          onClick={() => {
            reset();
            handleClose();
          }}
        >
          <IconDisplay name={'X'} /> Cancel
        </Button>
        <LoadingBtn isLoading={isSubmitting} variant={'primary'} onClick={() => handleSubmit()}>
          <IconDisplay name={'Send'} /> Submit
        </LoadingBtn>
      </>
    );
  };

  return (
    <PopupModal
      header={<b>Bulk Update Skill Expiration ({selectedStaffIds.length} staff selected)</b>}
      show={isShowing}
      footer={getFooter()}
      handleClose={() => {
        reset();
        handleClose();
      }}
    >
      {getBody()}
    </PopupModal>
  );
};

export default BulkUpdateModal;
