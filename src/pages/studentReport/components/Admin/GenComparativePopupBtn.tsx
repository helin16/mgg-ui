import * as Icons from 'react-bootstrap-icons';
import {Alert, Button, Spinner} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import PopupModal from '../../../../components/common/PopupModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/makeReduxStore';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import StudentReportService from '../../../../services/Synergetic/Student/StudentReportService';
import Toaster from '../../../../services/Toaster';

const GenComparativePopupBtn = () => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genFileSemester, setGenFileSemester] = useState<null | number>(null);
  const [genSuccess, setGenSuccess] = useState(false);
  const {user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if ((user?.SynCurrentFileSemester?.FileSemester || 0) < 4 && (user?.SynCurrentFileSemester?.FileSemester || 0) % 2 !== 0) {
      setGenFileSemester(null)
    }
    setGenFileSemester(Math.floor((user?.SynCurrentFileSemester?.FileSemester || 0) / 2) * 2);
  }, [user?.SynCurrentFileSemester?.FileSemester])


  const handleClose = () => {
    setShowingPopup(false);
    setIsGenerating(false);
    setGenSuccess(false);
  }

  const getPopupContent = () => {

    if (genSuccess) {
      return (
        <Alert variant="success">
          <Alert.Heading>Generated</Alert.Heading>
          <div>
            Comparative results for all students in {user?.SynCurrentFileSemester?.FileYear}{' '}
            Semester { genFileSemester } generated.
          </div>
        </Alert>
      )
    }

    if (isGenerating) {
      return (
        <>
          <h5>
            <Spinner animation={'border'} />
            Generating is in progress...
          </h5>
          <Alert variant="danger">
            <Alert.Heading>DO NOT CLOSE THIS POPUP OR CLOSE THIS WINDOW, UNTIL FINISH.</Alert.Heading>
          </Alert>
        </>
      )
    }

    if (genFileSemester === null) {
      return (
        <Alert variant="danger">
          <p>
            You can ONLY run Comparative Gen on Semester 2 or 4.
          </p>
        </Alert>
      );
    }
    return (
      <Alert variant="danger">
        <Alert.Heading>ACTION CAN NOT BE REVERSED!</Alert.Heading>
        <p>
          You are about to generate comparative result for all students in {user?.SynCurrentFileSemester?.FileYear}{' '}
          Semester { genFileSemester }
        </p>
      </Alert>
    )
  }

  const submitGen = () => {
    if (!user?.SynCurrentFileSemester || !user?.SynCurrentFileSemester?.FileYear || !genFileSemester) {
      return;
    }
    setIsGenerating(true);
    StudentReportService.genComparativeResults({
        fileYear: `${user?.SynCurrentFileSemester?.FileYear || 0}`,
        fileSemester: `${genFileSemester}`,
      })
      .then(resp => {
        setGenSuccess(resp.success || false)
      })
      .catch(error => {
        Toaster.showApiError(error);
      })
      .finally(() => {
        setIsGenerating(false);
      })
  }

  const getFooter = () => {
    if (genSuccess) {
      return (
        <Button
          variant={'primary'}
          onClick={() => handleClose()}>
          OK
        </Button>
      )
    }
    return (
      <div>
        <LoadingBtn
          variant={'link'}
          isLoading={isGenerating}
          onClick={() => handleClose()}>
          Cancel
        </LoadingBtn>
        <LoadingBtn
          isLoading={isGenerating}
          variant={'danger'}
          onClick={() => submitGen()}>
          Start Generating
        </LoadingBtn>
      </div>
    )
  }

  const getPopup = () => {
    if (!showingPopup) {
      return null;
    }
    return (
      <PopupModal
        show={showingPopup}
        size={'lg'}
        header={
          <h5>
            Trying to generate comparative results for {user?.SynCurrentFileSemester?.FileYear}{' '}
            Semester { genFileSemester }
          </h5>
        }

        footer={
          getFooter()
        }
      >
        {getPopupContent()}
      </PopupModal>
    )
  }

  return (
    <>
      <Button variant={'outline-warning'} size={'sm'} onClick={() => setShowingPopup(true)}>
        <Icons.List />{' '}
        <span className={'d-none d-sm-inline-block'}>Gen Comparatives</span>
      </Button>
      {getPopup()}
    </>
  )
}

export default GenComparativePopupBtn;
