import iAlumniRequest from '../../../types/Alumni/iAlumniRequest';
import React, {useState} from 'react';
import PopupModal from '../../../components/common/PopupModal';
import LoadingBtn from '../../../components/common/LoadingBtn';
import {Table} from 'react-bootstrap';
import AlumniRequestService from '../../../services/Alumni/AlumniRequestService';
import Toaster from '../../../services/Toaster';


type iAlumniRequestApprovePopup = {
  request: iAlumniRequest;
  onApproved: (updatedRequest: iAlumniRequest) => void;
}
const AlumniRequestApprovePopupBtn = ({request, onApproved}: iAlumniRequestApprovePopup) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const approveRequest = () => {
    setIsSaving(true);
    AlumniRequestService.approve(request.id)
      .then(resp => {
        onApproved(resp);
      })
      .catch(err => {
        Toaster.showApiError(err)
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  const getPopup = () => {
    if (isConfirming !== true) {
      return null;
    }
    return (
      <PopupModal
        title={'Approving this request...'}
        show={true}
        handleClose={() => setIsConfirming(false)}
        footer={
          <>
            <div />
            <div>
              <LoadingBtn
                variant={'link'}
                onClick={() => setIsConfirming(false)}
                isLoading={isSaving === true}
              >
                Cancel
              </LoadingBtn>
              <LoadingBtn
                variant={'success'}
                isLoading={isSaving === true}
                onClick={() => approveRequest()}
              >
                Approve
              </LoadingBtn>
            </div>
          </>
        }
      >
        <div>
          <p>You are about to approve this request:</p>
          <Table borderless striped hover>
            <tbody>
            {Object.keys(request)
              .filter(key => ['approved_by_id', 'approved', 'approved_at', 'isActive', 'approvedBy', 'updatedAt', 'updatedById'].indexOf(key) < 0)
              .map(key => {
                return (
                  <tr key={key}>
                    <td><b>{key}</b></td>
                    {/*// @ts-ignore*/}
                    <td>{`${request[key]}`}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </Table>
        </div>
      </PopupModal>
    )
  }
  return (
    <>
      <LoadingBtn
        size={'sm'}
        variant={'outline-success'}
        onClick={() => setIsConfirming(true)}
        isLoading={isConfirming === true}>
        Approve
      </LoadingBtn>
      {getPopup()}
    </>
  )
}

export default AlumniRequestApprovePopupBtn;
