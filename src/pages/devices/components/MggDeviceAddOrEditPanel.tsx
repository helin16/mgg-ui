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
import UtilsService from '../../../services/UtilsService';

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
    if (`${device?.macAddress || ''}`.trim() === '') {
      error.macAddress = 'MAC is required.';
    } else if (UtilsService.validateMacAddress(`${device?.macAddress || ''}`.trim()) !== true) {
      error.macAddress = 'Please provide a valid MAC address xx:xx:xx:xx:xx:xx';
    }
    setErrorMap(error);
    return Object.keys(error).length === 0;
  }

  const handleSave = () => {
    if (preSave() !== true) {
      Toaster.showToast('Error in your form, check all fields', TOAST_TYPE_ERROR);
      return;
    }
    onSave && onSave(device || {});
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
          <FormLabel label={'MAC address'} isRequired />
          <FormControl
            placeholder={'The MAC address of the device'}
            value={`${device?.macAddress || ''}`.toLowerCase()}
            onChange={(event) => handleChange('macAddress', `${event.target.value}`.toLowerCase())}
          />
          <FormErrorDisplay errorsMap={errorMap} fieldName={'macAddress'} />
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
