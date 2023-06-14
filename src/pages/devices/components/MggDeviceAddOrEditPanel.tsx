import styled from 'styled-components';
import iMggAppDevice from '../../../types/Settings/iMggAppDevice';
import {Alert, Col, FormControl, Row} from 'react-bootstrap';
import FormLabel from '../../../components/form/FormLabel';
import {useState} from 'react';
import LoadingBtn from '../../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import {FlexContainer} from '../../../styles';
import FormErrorDisplay from '../../../components/form/FormErrorDisplay';
import Toaster, {TOAST_TYPE_ERROR} from '../../../services/Toaster';
import moment from 'moment-timezone';
import SectionDiv from '../../studentReport/components/AcademicReports/DetailsComponents/sections/SectionDiv';

const Wrapper = styled.div``;
type iMggDeviceAddOrEditPanel = {
  mggAppDevice?: iMggAppDevice;
  onCancel?: () => void;
  onSave?: (data: any) => void;
  isSubmitting?: boolean
}
const MggDeviceAddOrEditPanel = ({mggAppDevice, onCancel, onSave, isSubmitting = false}: iMggDeviceAddOrEditPanel) => {
  const [device, setDevice] = useState<iMggAppDevice | null>(mggAppDevice || null);
  const [errorMap, setErrorMap] = useState<{ [key: string]: string }>({});

  const handleChange = (fieldName: string, newValue: any) => {
    // @ts-ignore
    setDevice({
      ...(device || {}),
      [fieldName]: newValue,
    })
  }


  const getAppCodeCol = () => {
    const code = `${device?.code || ''}`.trim();
    if (code === '') {
      return null;
    }
    return (
      <Col md={4}>
        <Alert variant={'info'}>App Code: <b>{code}</b></Alert>
      </Col>
    )
  }

  const preSave = () => {
    const error: { [key: string]: string } = {};
    if (`${device?.name || ''}`.trim() === '') {
      error.name = 'Name is required.';
    }
    if (`${device?.deviceId || ''}`.trim() === '') {
      error.deviceId = 'DeviceId is required.';
    }

    setErrorMap(error);
    return Object.keys(error).length === 0;
  }

  const handleSave = () => {
    if (preSave() !== true) {
      Toaster.showToast('Error in your form, check all fields', TOAST_TYPE_ERROR);
      return;
    }
    const {CreatedBy, UpdatedBy, MggApp, ...deviceInfo} = (device || {});
    onSave && onSave(deviceInfo || {});
  }

  const appPanel = () => {
    if (!device?.MggApp) {
      return null;
    }

    return (
      <Row>
        <Col>
          <SectionDiv>
            <Alert variant={'warning'}>
              <div><b>App Token</b>: {device?.MggApp.token}</div>
              <div><b>Expires At</b>: {`${device?.MggApp.expiresAt || ''}`.trim() === '' ? '' : moment(device?.MggApp.expiresAt).format('lll')}</div>
            </Alert>
          </SectionDiv>
        </Col>
      </Row>
    )
  }

  return (
    <Wrapper>
      <Row>
        <Col md={4}>
          <FormLabel label={'Name'} isRequired />
          <FormControl
            placeholder={'The name of the device'}
            value={device?.name || ''}
            onChange={(event) => handleChange('name', event.target.value)}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'name'} />
        </Col>
        <Col md={4}>
          <FormLabel label={'Device ID'} isRequired />
          <FormControl
            placeholder={'The Device ID we set internally.'}
            value={`${device?.deviceId || ''}`.toLowerCase()}
            onChange={(event) => handleChange('deviceId', `${event.target.value}`.toLowerCase())}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'deviceId'} />
        </Col>
        {getAppCodeCol()}
      </Row>
      <Row>
        <Col md={6}>
          <FormLabel label={'Make'} needSpaceTop/>
          <FormControl
            placeholder={'The Make / Brand of the device (ie: Apple)'}
            value={device?.make || ''}
            onChange={(event) => handleChange('make', event.target.value)}
          />
        </Col>
        <Col md={6}>
          <FormLabel label={'Model'} needSpaceTop/>
          <FormControl
            placeholder={'The Model of the device (ie: MC90)'}
            value={device?.model || ''}
            onChange={(event) => handleChange('model', event.target.value)}
          />
        </Col>
        <Col md={12}>
          <FormLabel label={'Location'} needSpaceTop/>
          <FormControl
            placeholder={'The Location of the device (ie: IT room)'}
            value={device?.location || ''}
            onChange={(event) => handleChange('location', event.target.value)}
          />
        </Col>
      </Row>
      {appPanel()}
      <FlexContainer className={'space-above justify-content space-between'}>
        <LoadingBtn
          variant={'link'}
          onClick={() => onCancel && onCancel()}
          isLoading={isSubmitting}
        >
          <Icons.XLg /> Cancel
        </LoadingBtn>
        <LoadingBtn
          variant={'primary'}
          isLoading={isSubmitting}
          onClick={() => handleSave()}
        >
          <Icons.Send /> Submit
        </LoadingBtn>
      </FlexContainer>
    </Wrapper>
  )
}

export default MggDeviceAddOrEditPanel;
